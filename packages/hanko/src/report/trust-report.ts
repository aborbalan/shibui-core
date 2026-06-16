/* ============================================================
   hanko · Trust Report (F6) — agregador

   La capa que COMPONE el sello. F2–F5 producen veredictos por
   capa (Floor, contrato, a11y, resiliencia); F6 los agrega en un
   `TrustReport`: por componente, qué capas pasaron, su procedencia
   (`ContractSource`) y los hallazgos que lo descalifican.

   Motor PURO: recibe los `*Result` ya calculados (no corre checks,
   no toca el DOM, no importa shibui). Así se testea en Node con
   resultados falsos. El runner que ejecuta de verdad las cuatro
   capas sobre el shibui-ui real —Floor estático + contrato/a11y/
   resiliencia vía el harness de navegador— y emite report.json /
   report.html es el INCREMENTO 2 (necesita navegador + CEM real).

   Regla de oro (coherente con los checks): una capa NO evaluada
   no es fallo → queda `skipped`; un componente solo es `trusted`
   si TODAS sus capas evaluadas pasan (y se evaluó al menos una).

   Spec: docs/specs/trust-report.md
   ============================================================ */
import type { ContractSource } from '../core/contract';
import type { FloorResult } from '../checks/floor';
import type { ContractResult } from '../checks/contract';
import type { A11yResult } from '../checks/a11y';
import type { ResilienceResult } from '../checks/resilience';

/** Las cuatro capas que componen el sello, de la más básica a la más exigente. */
export type TrustLayer = 'floor' | 'contract' | 'a11y' | 'resilience';

export type LayerStatus = 'pass' | 'fail' | 'skipped';

/** Veredicto de una capa para un componente. */
export interface LayerVerdict {
  layer: TrustLayer;
  status: LayerStatus;
  /** Nº de hallazgos que hacen fallar el sello. */
  violations: number;
  /** Nº de avisos (no fallan; informan). */
  warnings: number;
}

/** Sello agregado de un componente. */
export interface ComponentTrust {
  tagName: string;
  /** Procedencia del contrato (alimenta la fuerza del sello). */
  source: ContractSource;
  /** ¿Pasa TODAS las capas evaluadas (con al menos una evaluada)? */
  trusted: boolean;
  /** Veredicto de las cuatro capas (las no evaluadas quedan `skipped`). */
  layers: LayerVerdict[];
  /** Mensajes de las violaciones, prefijados por capa, para el detalle. */
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

/** Resultados de las capas de un componente. Cualquiera ausente → capa `skipped`. */
export interface ComponentChecks {
  tagName: string;
  source: ContractSource;
  floor?: FloorResult;
  contract?: ContractResult;
  a11y?: A11yResult;
  resilience?: ResilienceResult;
}

export interface TrustReportOptions {
  /** Timestamp inyectable (determinismo en tests). Por defecto, ahora. */
  generatedAt?: string;
}

function skip(layer: TrustLayer): LayerVerdict {
  return { layer, status: 'skipped', violations: 0, warnings: 0 };
}

function verdict(
  layer: TrustLayer,
  pass: boolean,
  violations: number,
  warnings: number,
): LayerVerdict {
  return { layer, status: pass ? 'pass' : 'fail', violations, warnings };
}

/** Compone el sello de un componente a partir de los resultados de sus capas. */
function trustOf(c: ComponentChecks): ComponentTrust {
  const layers: LayerVerdict[] = [];
  const findings: string[] = [];

  if (c.floor === undefined) {
    layers.push(skip('floor'));
  } else {
    layers.push(verdict('floor', c.floor.pass, c.floor.violations.length, 0));
    for (const v of c.floor.violations) findings.push(`floor: ${v}`);
  }

  if (c.contract === undefined) {
    layers.push(skip('contract'));
  } else {
    layers.push(verdict('contract', c.contract.pass, c.contract.violations.length, 0));
    for (const v of c.contract.violations) findings.push(`contract/${v.facet}: ${v.message}`);
  }

  if (c.a11y === undefined) {
    layers.push(skip('a11y'));
  } else {
    layers.push(verdict('a11y', c.a11y.pass, c.a11y.violations.length, c.a11y.warnings.length));
    for (const v of c.a11y.violations) findings.push(`a11y/${v.rule}: ${v.message}`);
  }

  if (c.resilience === undefined) {
    layers.push(skip('resilience'));
  } else {
    layers.push(
      verdict(
        'resilience',
        c.resilience.pass,
        c.resilience.violations.length,
        c.resilience.warnings.length,
      ),
    );
    for (const v of c.resilience.violations) {
      findings.push(`resilience/${v.scenario}: ${v.message}`);
    }
  }

  const evaluated = layers.filter((l) => l.status !== 'skipped');
  const trusted = evaluated.length > 0 && evaluated.every((l) => l.status === 'pass');

  return { tagName: c.tagName, source: c.source, trusted, layers, findings };
}

/** Agrega los veredictos por capa de un conjunto de componentes en un Trust Report. */
export function buildTrustReport(
  components: ComponentChecks[],
  options: TrustReportOptions = {},
): TrustReport {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const items = components.map(trustOf);
  const trusted = items.filter((c) => c.trusted).length;
  return {
    generatedAt,
    total: items.length,
    trusted,
    untrusted: items.length - trusted,
    components: items,
  };
}
