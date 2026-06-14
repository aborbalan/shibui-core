/* ============================================================
   hanko · runner del smoke (F2 · incremento 2)

   Lee un Custom Elements Manifest y emite el SmokeReport por
   consola. Sale con código ≠ 0 si algún componente no pasa el
   Floor → listo para ser un gate de CI.

   Uso:
     pnpm --filter @shibui-ui/hanko smoke            # CEM de shibui-ui por defecto
     pnpm --filter @shibui-ui/hanko smoke <ruta.json>

   Comunicación con shibui-ui: SOLO vía el fichero CEM (sin import).
   Ver docs/reference/runner-y-comunicacion.html
   ============================================================ */
import { readFileSync } from 'node:fs';
import { smoke } from './smoke';
import type { CustomElementsManifest } from '../ingest/cem-types';

// Por defecto, el CEM de shibui-ui (cwd = packages/hanko al correr con pnpm --filter).
const path = process.argv[2] ?? '../shibui-ui/dist/custom-elements.json';

function loadManifest(p: string): CustomElementsManifest {
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as CustomElementsManifest;
  } catch (err) {
    console.error(`hanko smoke · no pude leer/parsear el manifest en "${p}":`);
    console.error(String(err));
    process.exit(2);
  }
}

const report = smoke(loadManifest(path));

console.log('hanko smoke · Floor');
console.log(`  total ${report.total} · pass ${report.passed} · fail ${report.failed}\n`);

for (const seal of report.seals) {
  const mark = seal.pass ? '✓' : '✗';
  const facets = Object.entries(seal.coverage)
    .filter(([, declared]) => declared)
    .map(([facet]) => facet)
    .join('·');
  const viol = seal.violations.length ? `  ⟵ ${seal.violations.join('; ')}` : '';
  console.log(`  ${mark} ${seal.tagName}  [${facets || '—'}]${viol}`);
}

if (report.failed > 0) {
  console.error(`\nhanko: ${report.failed} componente(s) no pasan el Floor.`);
  process.exit(1);
}
console.log('\nhanko: todos pasan el Floor ✓');
