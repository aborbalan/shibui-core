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
