/* Barrel del subsistema de reporte (Trust Report · F6). */
export { buildTrustReport } from './trust-report';
export type {
  TrustReport,
  TrustLayer,
  LayerStatus,
  LayerVerdict,
  ComponentTrust,
  ComponentChecks,
  TrustReportOptions,
} from './trust-report';
export { renderTrustReportJson, renderTrustReportHtml } from './render';
export {
  toIssueDrafts,
  syncGithubIssues,
  parseMarker,
  RestGithubClient,
  HANKO_LABEL,
} from './github-issues';
export type {
  IssueDraft,
  ExistingIssue,
  GithubClient,
  SyncSummary,
  SyncOptions,
  RestGithubClientOptions,
} from './github-issues';
// Gate de regresión sobre baseline (F6 · ADR-003). Motor puro, parte de la
// superficie pública: un consumidor que adopte hanko construye su Trust Report
// y protege su propio suelo de sellos con estas funciones.
export { reportCoverage, baselineFromReport, gateAgainstBaseline } from './gate';
export type { Baseline, GateResult } from './gate';
// `Coverage` (unión floor/four-layer del gate) colisiona en el barrel raíz
// con el interface homónimo de `smoke`; se expone con alias para mantener
// ambas APIs públicas sin ambigüedad (TS2308).
export type { Coverage as BaselineCoverage } from './gate';
