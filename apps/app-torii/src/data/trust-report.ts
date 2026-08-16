// Tipos del Trust Report de hanko (shape del JSON que el cockpit consume).
// Es una copia LOCAL del contrato público — el cockpit NO importa de hanko,
// solo modela el JSON que publica en hanko-report.web.app/trust-report.json.
// Fuente de verdad: packages/hanko/src/report/trust-report.ts

export type TrustLayer = 'floor' | 'contract' | 'a11y' | 'resilience';

export type LayerStatus = 'pass' | 'fail' | 'skipped';

/** Procedencia del contrato (alimenta la fuerza del sello). */
export interface ContractSource {
  kind: 'cem' | 'adapter' | 'inferred';
}

/** Veredicto de una capa para un componente. */
export interface LayerVerdict {
  layer: TrustLayer;
  status: LayerStatus;
  /** Hallazgos que hacen fallar el sello. */
  violations: number;
  /** Avisos (no fallan; informan). */
  warnings: number;
}

/** Sello agregado de un componente. */
export interface ComponentTrust {
  tagName: string;
  source: ContractSource;
  /** ¿Pasa TODAS las capas evaluadas (con al menos una evaluada)? */
  trusted: boolean;
  /** Veredicto de las cuatro capas (las no evaluadas quedan `skipped`). */
  layers: LayerVerdict[];
  /** Mensajes de las violaciones, prefijados por capa (p.ej. "a11y/…"). */
  findings: string[];
}

export interface TrustReport {
  /** ISO timestamp de generación. */
  generatedAt: string;
  total: number;
  trusted: number;
  untrusted: number;
  components: ComponentTrust[];
}

/** Las cuatro capas en orden canónico (útil para charts y tablas). */
export const TRUST_LAYERS: readonly TrustLayer[] = [
  'floor',
  'contract',
  'a11y',
  'resilience',
] as const;
