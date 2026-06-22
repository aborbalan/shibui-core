/* ============================================================
   hanko · gate de regresión del Trust Report (F6)

   El gate NO exige que todos sellen (eso acoplaría hanko al
   estado de su consumer #1, shibui, castigando el drift de su
   CEM). En su lugar compara el Trust Report actual contra un
   BASELINE commiteado y falla SOLO ante una REGRESIÓN: un
   componente que estaba sellado deja de estarlo.

   Genérico: cualquier proyecto que adopte hanko commitea su
   propio baseline y el gate protege ese suelo. El drift
   preexistente queda congelado en el baseline → no es falta.

   Motor PURO: recibe el `TrustReport` ya construido (no corre
   checks, no toca disco, no importa shibui). El runner que lee
   los ficheros y sale con código ≠ 0 es `gate-run.ts`.

   Spec: docs/specs/trust-report.md · ADR-003.
   ============================================================ */
import type { TrustReport } from './trust-report';

/** Qué capas cubrió el report. El baseline solo es comparable con su misma cobertura. */
export type Coverage = 'floor' | 'four-layer';

/** Suelo de sellos commiteado contra el que se mide la regresión. */
export interface Baseline {
  coverage: Coverage;
  /** ISO de cuándo se capturó (trazabilidad; no afecta la comparación). */
  generatedAt: string;
  total: number;
  trusted: number;
  /** Tags sellados que el gate exige preservar (ordenados). */
  trustedTags: string[];
}

/** Resultado del gate. `ok` resume solo las regresiones; la cobertura se valida aparte. */
export interface GateResult {
  ok: boolean;
  coverage: Coverage;
  baselineCoverage: Coverage;
  /** El report y el baseline cubren capas distintas → comparación inválida (el runner aborta). */
  coverageMismatch: boolean;
  /** Tags sellados en el baseline, presentes hoy pero SIN sello → regresión (falla). */
  regressed: string[];
  /** Tags sellados hoy ausentes del baseline → mejora (informativo, no falla). */
  newlyTrusted: string[];
  /** Tags del baseline ausentes del report (componente eliminado) → informativo, no falla. */
  removed: string[];
  baselineTrusted: number;
  currentTrusted: number;
}

/**
 * Deriva la cobertura de un report: `four-layer` si alguna de las capas
 * contrato/a11y/resiliencia se evaluó en algún componente; si solo hubo
 * Floor (las demás `skipped`), `floor`.
 */
export function reportCoverage(report: TrustReport): Coverage {
  for (const c of report.components) {
    for (const l of c.layers) {
      if (l.layer !== 'floor' && l.status !== 'skipped') return 'four-layer';
    }
  }
  return 'floor';
}

/** Captura un baseline a partir de un report (para sembrar/refrescar el suelo). */
export function baselineFromReport(report: TrustReport, coverage?: Coverage): Baseline {
  const trustedTags = report.components
    .filter((c) => c.trusted)
    .map((c) => c.tagName)
    .sort();
  return {
    coverage: coverage ?? reportCoverage(report),
    generatedAt: report.generatedAt,
    total: report.total,
    trusted: trustedTags.length,
    trustedTags,
  };
}

/**
 * Compara el report contra el baseline. Falla (`ok:false`) solo si un tag
 * sellado en el baseline, todavía presente, perdió su sello (regresión
 * per-tag estricta: una mejora en otro tag NO compensa). Componentes nuevos
 * sin sello y componentes eliminados no son regresión.
 */
export function gateAgainstBaseline(report: TrustReport, baseline: Baseline): GateResult {
  const coverage = reportCoverage(report);
  const presentTags = new Set(report.components.map((c) => c.tagName));
  const trustedNow = new Set(report.components.filter((c) => c.trusted).map((c) => c.tagName));
  const baselineSet = new Set(baseline.trustedTags);

  const regressed = baseline.trustedTags.filter((t) => presentTags.has(t) && !trustedNow.has(t));
  const removed = baseline.trustedTags.filter((t) => !presentTags.has(t));
  const newlyTrusted = [...trustedNow].filter((t) => !baselineSet.has(t)).sort();

  const coverageMismatch = coverage !== baseline.coverage;

  return {
    ok: !coverageMismatch && regressed.length === 0,
    coverage,
    baselineCoverage: baseline.coverage,
    coverageMismatch,
    regressed,
    newlyTrusted,
    removed,
    baselineTrusted: baseline.trusted,
    currentTrusted: trustedNow.size,
  };
}
