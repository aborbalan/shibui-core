/* ============================================================
   hanko · Check de Resiliencia (F5)

   La tercera capa UNIVERSAL (como a11y, F4): no lee el contrato.
   Verifica que el componente NO se rompe ante entradas adversas
   — props basura, props vacías, RTL, montaje/desmontaje, SSR.

   Separación política / mecanismo (igual que F3 y F4):
     · MECANISMO (incremento 2): el harness monta el elemento bajo
       cada escenario y captura si lanzó → rellena `ResilienceObservation`.
     · POLÍTICA (este fichero): decide qué convierte esos resultados
       en un sello — qué escenarios son obligatorios y cuáles tolerables.
       Motor PURO, node-testable, agnóstico a los escenarios concretos.

   Regla de oro (simétrica): escenario no probado → se OMITE (no es
   fallo) y queda en `skipped`.

   Spec: docs/specs/checks-resilience.md
   ============================================================ */

/** Resultado de un intento de montaje bajo un escenario adverso (lo produce el harness). */
export interface ResilienceTrial {
  /** Identificador del escenario, p.ej. `'empty'` | `'junk-attrs'` | `'rtl'` | `'ssr'` | `'remount'`. */
  scenario: string;
  /** ¿Sobrevivió sin lanzar una excepción? */
  survived: boolean;
  /** Mensaje del error capturado, si lanzó. */
  error?: string;
}

/** Instantánea de resiliencia de un componente. La produce el harness. */
export interface ResilienceObservation {
  tagName: string;
  /** Intentos ejecutados. `undefined` = no se probó → se omite. */
  trials?: ResilienceTrial[];
}

export interface ResilienceFinding {
  scenario: string;
  message: string;
}

export interface ResilienceResult {
  tagName: string;
  pass: boolean;
  /** Escenarios obligatorios que se rompieron → hacen fallar el sello. */
  violations: ResilienceFinding[];
  /** Escenarios tolerables que se rompieron → informan, no fallan. */
  warnings: ResilienceFinding[];
  /** Escenarios evaluados (transparencia de cobertura). */
  checked: string[];
  /** Qué se omitió y por qué. */
  skipped: string[];
}

export interface ResilienceOptions {
  /**
   * Escenarios cuyo fallo se TOLERA (degradan a warning en vez de violación).
   * P.ej. `['ssr']` si el design system no apunta a server-side rendering.
   */
  optional?: string[];
}

/** Evalúa la observación de resiliencia de un componente contra la política de sello. */
export function resilienceCheck(
  obs: ResilienceObservation,
  options: ResilienceOptions = {},
): ResilienceResult {
  const optional = new Set(options.optional ?? []);
  const violations: ResilienceFinding[] = [];
  const warnings: ResilienceFinding[] = [];
  const checked: string[] = [];
  const skipped: string[] = [];

  if (obs.trials === undefined || obs.trials.length === 0) {
    skipped.push('todos los escenarios (el harness no ejecutó pruebas de resiliencia)');
    return { tagName: obs.tagName, pass: true, violations, warnings, checked, skipped };
  }

  for (const trial of obs.trials) {
    checked.push(trial.scenario);
    if (trial.survived) continue;
    const finding: ResilienceFinding = {
      scenario: trial.scenario,
      message: trial.error ?? `el componente se rompió en el escenario "${trial.scenario}"`,
    };
    if (optional.has(trial.scenario)) warnings.push(finding);
    else violations.push(finding);
  }

  return {
    tagName: obs.tagName,
    pass: violations.length === 0,
    violations,
    warnings,
    checked,
    skipped,
  };
}
