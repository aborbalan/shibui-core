/* ============================================================
   hanko · runner del Trust Report (F6 · incremento 2 — slice Floor)

   Lee el CEM de shibui-ui, ejecuta las capas DISPONIBLES sin
   navegador (hoy: solo el Floor estático) y emite el Trust Report
   a disco: `hanko-report/index.html` (humano) + `trust-report.json`
   (máquina). CI lo despliega a hanko-report.web.app en main.

   Contrato · a11y · resiliencia exigen el harness de navegador
   (aún sin cablear en CI) → se dejan sin rellenar y el agregador
   las marca `skipped` (regla de oro). A medida que el harness se
   integre, esas columnas se rellenan sin tocar este runner.

   Comunicación con shibui: SOLO vía el fichero CEM (sin import).
   Uso:
     pnpm --filter @shibui-ui/hanko report            # CEM por defecto → hanko-report/
     pnpm --filter @shibui-ui/hanko report <cem.json> <out-dir>

   Spec: docs/specs/trust-report.md
   ============================================================ */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ingestCem } from '../ingest/cem';
import { floorCheck } from '../checks/floor';
import { buildTrustReport, type ComponentChecks } from './trust-report';
import { renderTrustReportJson, renderTrustReportHtml } from './render';
import type { CustomElementsManifest } from '../ingest/cem-types';

const cemPath = process.argv[2] ?? '../shibui-ui/dist/custom-elements.json';
const outDir = process.argv[3] ?? 'hanko-report';

function loadManifest(p: string): CustomElementsManifest {
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as CustomElementsManifest;
  } catch (err) {
    console.error(`hanko report · no pude leer/parsear el manifest en "${p}":`);
    console.error(String(err));
    process.exit(2);
  }
}

const set = ingestCem(loadManifest(cemPath));

// Solo el Floor por ahora (estático, sin navegador). El resto → skipped.
const components: ComponentChecks[] = [...set.components.values()].map((c) => ({
  tagName: c.tagName,
  source: c.source,
  floor: floorCheck(c),
}));

const report = buildTrustReport(components);
const note =
  'Cobertura actual: Floor (registrabilidad del manifest). Contrato · a11y · resiliencia quedan ' +
  'sin evaluar (–) hasta cablear el harness de navegador en CI.';

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), renderTrustReportHtml(report, note), 'utf-8');
writeFileSync(join(outDir, 'trust-report.json'), renderTrustReportJson(report), 'utf-8');

console.log(
  `hanko report · ${report.total} componentes · ${report.trusted} sellados (Floor) → ${outDir}/index.html`,
);
