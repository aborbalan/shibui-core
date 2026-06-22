/* ============================================================
   hanko · runner del gate de regresión (F6)

   Lee el Trust Report generado (`hanko-report/trust-report.json`)
   y un BASELINE commiteado, y sale con código ≠ 0 si hay
   regresión → listo para gatear el build.

   Uso:
     # comprobar (CI): falla (exit 1) si un sello del baseline se cae
     pnpm --filter @shibui-ui/hanko gate                 # 4 capas (default)
     pnpm --filter @shibui-ui/hanko gate:floor           # solo Floor
     tsx src/report/gate-run.ts <baseline.json> [report.json]

     # (re)sembrar el baseline desde el report actual
     tsx src/report/gate-run.ts <baseline.json> [report.json] --write

   Códigos de salida:
     0  sin regresión (o baseline reescrito con --write)
     1  REGRESIÓN: un componente sellado en el baseline perdió el sello
     2  error de configuración (falta el report/baseline, o cobertura no casa)

   Comunicación con shibui: ninguna (consume solo ficheros JSON).
   Spec: docs/specs/trust-report.md · ADR-003.
   ============================================================ */
import { readFileSync, writeFileSync } from 'node:fs';
import { gateAgainstBaseline, baselineFromReport, type Baseline } from './gate';
import type { TrustReport } from './trust-report';

const args = process.argv.slice(2);
const write = args.includes('--write');
const positional = args.filter((a) => !a.startsWith('--'));
const baselinePath = positional[0] ?? 'dogfood/baseline.json';
const reportPath = positional[1] ?? 'hanko-report/trust-report.json';

function readJson<T>(path: string, label: string): T {
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T;
  } catch (err) {
    console.error(`hanko gate · no pude leer/parsear ${label} en "${path}":`);
    console.error(String(err));
    process.exit(2);
  }
}

const report = readJson<TrustReport>(reportPath, 'el Trust Report');

if (write) {
  const baseline = baselineFromReport(report);
  writeFileSync(baselinePath, JSON.stringify(baseline, null, 2) + '\n', 'utf-8');
  console.log(
    `hanko gate · baseline (${baseline.coverage}) reescrito → ${baselinePath} · ${baseline.trusted}/${baseline.total} sellados`,
  );
  process.exit(0);
}

const baseline = readJson<Baseline>(baselinePath, 'el baseline');
const result = gateAgainstBaseline(report, baseline);

console.log(`hanko gate · cobertura ${result.coverage} · baseline ${baselinePath}`);
console.log(`  sellados: baseline ${result.baselineTrusted} · actual ${result.currentTrusted}`);
if (result.newlyTrusted.length > 0) {
  console.log(`  ✚ nuevos sellos (no en baseline): ${result.newlyTrusted.join(', ')}`);
  console.log('    → cuando se estabilicen, refresca el baseline con --write.');
}
if (result.removed.length > 0) {
  console.log(`  – tags del baseline ausentes (eliminados): ${result.removed.join(', ')}`);
}

if (result.coverageMismatch) {
  console.error(
    `\nhanko gate · cobertura del report (${result.coverage}) ≠ baseline (${result.baselineCoverage}). ` +
      'No comparo: usa el baseline de la misma cobertura.',
  );
  process.exit(2);
}

if (!result.ok) {
  console.error(
    `\nhanko gate · REGRESIÓN: ${result.regressed.length} componente(s) sellado(s) perdieron el sello:`,
  );
  for (const tag of result.regressed) console.error(`  ✗ ${tag}`);
  console.error('\nEl build falla: una regresión de sello no se compensa con sellos nuevos.');
  process.exit(1);
}

console.log('\nhanko gate · sin regresión: el suelo de sellos se preserva ✓');
