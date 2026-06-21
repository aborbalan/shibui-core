/* ============================================================
   hanko · sonda de dogfood (F6 · incr. 2 — Etapa 1)

   El MÚSCULO de navegador del Trust Report. Corre el harness de hanko
   sobre los componentes REALES de shibui-ui y emite `observations.json`,
   que la Etapa 2 (`src/report/run.ts`) consume para rellenar las capas
   contrato/a11y/resiliencia del sello.

   Flujo:
     1. lee el CEM → lista de tags (misma normalización que el motor);
     2. esbuild bundlea `browser-glue.ts` (shibui + harness + axe) a un
        IIFE inline —así el navegador no resuelve módulos/chunks por
        file:// (CORS de about:blank);
     3. Playwright/chromium inyecta el bundle y sondea cada tag;
     4. escribe `hanko-report/observations.json`.

   Vive FUERA de `src/` porque carga shibui (ver browser-glue.ts). No se
   publica (no está en `files`). El core sigue hablando con shibui solo
   por el fichero CEM.

   Uso:
     pnpm --filter @shibui-ui/hanko observe                    # rutas por defecto
     pnpm --filter @shibui-ui/hanko observe <cem.json> <out-dir>

   Requiere los navegadores de Playwright:
     pnpm --filter @shibui-ui/hanko exec playwright install chromium

   Spec: docs/specs/harness.md · docs/specs/trust-report.md
   ============================================================ */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from 'playwright';
import { ingestCem } from '../src/ingest/cem';
import type { CustomElementsManifest } from '../src/ingest/cem-types';
import type { PropTypeHint } from '../src/harness/probe';
import type {
  BrowserDiagnostic,
  ComponentObservation,
  ObservationsFile,
} from '../src/report/observations';

const HERE = dirname(fileURLToPath(import.meta.url)); // packages/hanko/dogfood
const PKG = resolve(HERE, '..'); //                     packages/hanko

const cemPath = process.argv[2] ?? resolve(PKG, '../shibui-ui/dist/custom-elements.json');
const outDir = process.argv[3] ?? resolve(PKG, 'hanko-report');

async function main(): Promise<void> {
  // 1 · Tags a sondear: los custom elements del CEM (misma ingestión que el motor).
  const manifest = JSON.parse(readFileSync(cemPath, 'utf-8')) as CustomElementsManifest;
  const ingested = ingestCem(manifest);
  const tags = [...ingested.components.keys()];
  if (tags.length === 0) {
    console.error(`hanko observe · el CEM en "${cemPath}" no declara custom elements.`);
    process.exit(2);
  }

  // Tipo DECLARADO por prop (del CEM) por tag → tipa el sentinel de reflexión en
  // el harness (enums válidos, booleanos). Es un dato plano que se inyecta en el
  // navegador; el harness no conoce el `ComponentContract`, solo recibe pistas.
  const propTypesByTag: Record<string, Record<string, PropTypeHint>> = {};
  for (const [tag, contract] of ingested.components) {
    const hints: Record<string, PropTypeHint> = {};
    for (const p of contract.properties ?? []) {
      hints[p.property] = p.type.literals
        ? { kind: p.type.kind, literals: p.type.literals }
        : { kind: p.type.kind };
    }
    propTypesByTag[tag] = hints;
  }

  // 2 · Bundle del glue (shibui + harness + axe) → IIFE inline.
  const bundled = await build({
    entryPoints: [resolve(HERE, 'browser-glue.ts')],
    bundle: true,
    format: 'iife',
    platform: 'browser',
    // Sin tree-shaking: el import de shibui es side-effect puro (registra los
    // custom elements vía @customElement). Si se poda, nada queda registrado y
    // todo el contrato sale "no registrado". El bundle es desechable: no importa
    // que quede más grande.
    treeShaking: false,
    // Ignora `sideEffects` de package.json: sin esto esbuild descarta la
    // evaluación de los chunks de shibui (que no figuran en su sideEffects) y
    // los @customElement nunca corren → 0 componentes registrados.
    ignoreAnnotations: true,
    write: false,
    logLevel: 'silent',
  });
  const glue = bundled.outputFiles?.[0]?.text;
  if (glue === undefined || glue === '') {
    console.error('hanko observe · esbuild no produjo el bundle del glue de navegador.');
    process.exit(1);
  }

  // 3 · Navegador: inyecta el glue y sondea cada tag.
  const browser = await chromium.launch();
  const observations: ComponentObservation[] = [];
  // Errores crudos del navegador, deduplicados por mensaje (muchos componentes
  // lanzan el mismo). Se vuelcan a observations.json para el report-full.
  const diagCounts = new Map<string, BrowserDiagnostic>();
  const recordDiag = (kind: string, message: string): void => {
    const key = `${kind}::${message}`;
    const hit = diagCounts.get(key);
    if (hit) hit.count++;
    else diagCounts.set(key, { kind, message, count: 1 });
  };
  try {
    const page = await browser.newPage();
    page.on('pageerror', (e) => {
      recordDiag('pageerror', e.message);
      console.error('  ⚠ page error:', e.message);
    });
    page.on('console', (m) => {
      if (m.type() === 'error' || m.type() === 'warning') {
        recordDiag(`console.${m.type()}`, m.text());
        console.error(`  ⚠ console.${m.type()}: ${m.text()}`);
      }
    });
    await page.setContent('<!doctype html><html><head></head><body></body></html>');
    await page.addScriptTag({ content: glue });

    // Diagnóstico: ¿se montó el puente y cuántos custom elements quedaron
    // registrados tras cargar shibui? (registered=0 → shibui no corrió sus define()).
    const ready = await page.evaluate(() =>
      Boolean((window as { __hankoProbe?: unknown }).__hankoProbe),
    );
    const registered = await page.evaluate(
      (ts) => ts.filter((t) => Boolean(customElements.get(t))).length,
      tags,
    );
    console.log(
      `hanko observe · __hankoProbe=${ready} · ${registered}/${tags.length} tags registrados`,
    );
    if (!ready) throw new Error('el glue no expuso window.__hankoProbe');

    for (const tag of tags) {
      const obs = (await page.evaluate(
        ({ t, types }) => window.__hankoProbe.observe(t, types),
        { t: tag, types: propTypesByTag[tag] ?? {} },
      )) as ComponentObservation;
      observations.push(obs);
    }
    // Deja aflorar los errores async de Lit (renderan en microtask) antes de cerrar.
    await new Promise((r) => setTimeout(r, 200));
  } finally {
    await browser.close();
  }

  // 4 · Escribe observations.json junto al resto de artefactos del report.
  const diagnostics = [...diagCounts.values()].sort((a, b) => b.count - a.count);
  const file: ObservationsFile = {
    generatedAt: new Date().toISOString(),
    via: 'playwright-chromium',
    components: observations,
    diagnostics,
  };
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, 'observations.json');
  writeFileSync(outPath, JSON.stringify(file, null, 2), 'utf-8');
  console.log(
    `hanko observe · ${observations.length} componentes · ${diagnostics.length} diagnósticos → ${outPath}`,
  );
}

main().catch((err) => {
  console.error('hanko observe · fallo en la sonda:');
  console.error(err);
  process.exit(1);
});
