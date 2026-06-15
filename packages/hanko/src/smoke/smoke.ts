/* ============================================================
   hanko · Smoke / primer sello (F2)

   Primer flujo end-to-end: manifest → ingestión → Floor → sello.
   Emite un sello básico por componente y, desde el minuto uno,
   un reporte de COBERTURA (qué facetas declara cada manifest).
   Valida la tesis: ¿el flujo funciona a escala real (10→99)?

   `smoke()` recibe el CEM ya parseado. Leer el fichero / correr
   sobre el shibui-ui real es un paso del llamante (próximo incremento).

   Spec: docs/specs/smoke.md
   ============================================================ */
import type { ComponentContract, ContractSource } from '../core/contract';
import type { CustomElementsManifest } from '../ingest/cem-types';
import { ingestCem } from '../ingest/cem';
import { floorCheck } from '../checks/floor';

/** Qué facetas DECLARA el manifest (presencia, no contenido). */
export interface Coverage {
  properties: boolean;
  events: boolean;
  slots: boolean;
  cssParts: boolean;
  cssProps: boolean;
}

export interface SmokeSeal {
  tagName: string;
  pass: boolean;
  level: 'floor';
  violations: string[];
  source: ContractSource;
  coverage: Coverage;
}

export interface SmokeReport {
  total: number;
  passed: number;
  failed: number;
  seals: SmokeSeal[];
}

/** Ingiere el CEM y emite un sello Floor + cobertura por componente. */
export function smoke(manifest: CustomElementsManifest): SmokeReport {
  const set = ingestCem(manifest);
  const seals: SmokeSeal[] = [];
  for (const component of set.components.values()) {
    seals.push(toSeal(component));
  }
  const passed = seals.filter((s) => s.pass).length;
  return {
    total: seals.length,
    passed,
    failed: seals.length - passed,
    seals,
  };
}

function toSeal(component: ComponentContract): SmokeSeal {
  const floor = floorCheck(component);
  return {
    tagName: component.tagName,
    pass: floor.pass,
    level: 'floor',
    violations: floor.violations,
    source: component.source,
    coverage: coverageOf(component),
  };
}

/** Cobertura = presencia de cada faceta (undefined ⇒ no declarada). */
function coverageOf(c: ComponentContract): Coverage {
  return {
    properties: c.properties !== undefined,
    events: c.events !== undefined,
    slots: c.slots !== undefined,
    cssParts: c.cssParts !== undefined,
    cssProps: c.cssProps !== undefined,
  };
}
