/* ============================================================
   hanko · Check Floor (F2)

   El SUELO obligatorio del ADR-001: lo mínimo que cualquier Web
   Component —incluso vanilla con manifest pobre— debe cumplir.
   A nivel F2 es estático: el componente declara un tagName de
   custom element VÁLIDO. La verificación contra el runtime
   (registrable de verdad) llega en F3.

   Spec: docs/specs/smoke.md · docs/decisions/adr-001-baseline-minima-viable.md
   ============================================================ */
import type { ComponentContract } from '../core/contract';

export interface FloorResult {
  tagName: string;
  pass: boolean;
  violations: string[];
}

/**
 * Nombres de custom element reservados por el estándar (no son válidos como
 * autonomous custom elements).
 */
const RESERVED = new Set<string>([
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph',
]);

/**
 * Nombre de custom element válido (versión simplificada del PCEN del estándar):
 * empieza por minúscula, contiene al menos un guion, sin mayúsculas.
 * El PCEN completo (rangos unicode) se afinará en F3 si hace falta.
 */
const CUSTOM_ELEMENT_NAME = /^[a-z][a-z0-9._]*-[a-z0-9._-]*$/;

export function isValidCustomElementName(name: string): boolean {
  return CUSTOM_ELEMENT_NAME.test(name) && !RESERVED.has(name);
}

/** Aplica el Floor a un componente. */
export function floorCheck(component: ComponentContract): FloorResult {
  const violations: string[] = [];
  if (!component.tagName) {
    violations.push('sin tagName');
  } else if (!isValidCustomElementName(component.tagName)) {
    violations.push(`tagName no es un custom element válido: "${component.tagName}"`);
  }
  return {
    tagName: component.tagName,
    pass: violations.length === 0,
    violations,
  };
}
