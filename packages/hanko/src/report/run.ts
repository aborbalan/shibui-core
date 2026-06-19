/* ============================================================
   hanko · runner del Trust Report (F6 · incremento 2)

   Etapa 2 del puente. Lee el CEM de shibui-ui y, si existe, el
   `observations.json` que la sonda de navegador (Etapa 1,
   `dogfood/probe-shibui.ts`) dejó. Compone el Trust Report:

     · Floor      — estático, siempre (sin navegador).
     · Contrato   ┐
     · a11y       ├─ desde las observaciones del harness, si las hay.
     · Resiliencia┘

   Sin `observations.json` → solo Floor (las otras tres quedan
   `skipped` por la regla de oro): el runner sigue siendo robusto
   en una corrida solo-Node. Con él → las cuatro capas se rellenan
   SIN tocar `buildTrustReport` ni los checks (siguen puros).

   Emite a disco `hanko-report/index.html` (humano) + `trust-report.json`
   (máquina). CI lo despliega a hanko-report.web.app en main.

   Comunicación con shibui: SOLO vía el fichero CEM (sin import).
   Uso:
     pnpm --filter @shibui-ui/hanko report                       # rutas por defecto
     pnpm --filter @shibui-ui/hanko report <cem.json> <out-dir> [obs.json]

   Spec: docs/specs/trust-report.md
   ============================================================ */
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ingestCem } from '../ingest/cem';
import { floorCheck } from '../checks/floor';
import { contractCheck } from '../checks/contract';
import { a11yCheck } from '../checks/a11y';
import { resilienceCheck } from '../checks/resilience';
import { buildTrustReport, type ComponentChecks } from './trust-report';
import { renderTrustReportJson, renderTrustReportHtml } from './render';
import type { CustomElementsManifest } from '../ingest/cem-types';
import type { ComponentObservation, ObservationsFile } from './observations';

const cemPath = process.argv[2] ?? '../shibui-ui/dist/custom-elements.json';
const outDir = process.argv[3] ?? 'hanko-report';
const obsPath = process.argv[4] ?? join(outDir, 'observations.json');

function loadManifest(p: string): CustomElementsManifest {
  try {
    return JSON.parse(readFileSync(p, 'utf-8')) as CustomElementsManifest;
  } catch (err) {
    console.error(`hanko report · no pude leer/parsear el manifest en "${p}":`);
    console.error(String(err));
    process.exit(2);
  }
}

/** Observaciones del harness, indexadas por tagName. `undefined` = no hubo sonda. */
function loadObservations(p: string): Map<string, ComponentObservation> | undefined {
  if (!existsSync(p)) return undefined;
  try {
    const file = JSON.parse(readFileSync(p, 'utf-8')) as ObservationsFile;
    return new Map(file.components.map((c): [string, ComponentObservation] => [c.tagName, c]));
  } catch (err) {
    // Un observations.json ilegible no debe tumbar el report: degradamos a Floor.
    console.error(`hanko report · observations.json ilegible en "${p}", sigo solo con Floor:`);
    console.error(String(err));
    return undefined;
  }
}

const set = ingestCem(loadManifest(cemPath));
const observations = loadObservations(obsPath);

const components: ComponentChecks[] = [...set.components.values()].map((c) => {
  const checks: ComponentChecks = { tagName: c.tagName, source: c.source, floor: floorCheck(c) };
  const obs = observations?.get(c.tagName);
  if (obs !== undefined) {
    // Checks puros sobre las observaciones del navegador. La regla de oro vive
    // dentro de cada check: faceta no observada → skipped, no fallo.
    checks.contract = contractCheck(c, obs.runtime);
    checks.a11y = a11yCheck(obs.a11y);
    checks.resilience = resilienceCheck(obs.resilience);
  }
  return checks;
});

const report = buildTrustReport(components);

const fullCoverage = observations !== undefined;
const note = fullCoverage
  ? undefined
  : 'Cobertura actual: Floor (registrabilidad del manifest). Contrato · a11y · resiliencia quedan ' +
    'sin evaluar (–) hasta cablear el harness de navegador en CI.';

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'index.html'), renderTrustReportHtml(report, note), 'utf-8');
writeFileSync(join(outDir, 'trust-report.json'), renderTrustReportJson(report), 'utf-8');

const cobertura = fullCoverage ? '4 capas' : 'Floor';
console.log(
  `hanko report · ${report.total} componentes · ${report.trusted} sellados (${cobertura}) → ${outDir}/index.html`,
);
