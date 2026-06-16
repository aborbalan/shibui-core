/* ============================================================
   hanko · Check de Accesibilidad (F4)

   A diferencia del contrato (F3), la a11y es UNIVERSAL: no depende
   de lo que el manifest declare. Se aplica a cualquier componente
   renderizado, declare lo que declare. Por eso `a11yCheck` NO
   recibe el `ComponentContract` — solo la observación a11y del
   elemento vivo.

   Separación política / mecanismo (igual que F3):
     · MECANISMO (incremento 2): un harness renderiza el elemento,
       corre axe y sondea teclado/foco/nombre → rellena `A11yObservation`.
     · POLÍTICA (este fichero, incremento 1): decide qué convierte ese
       snapshot en un sello a11y — qué severidad falla, qué se exige a
       los elementos interactivos. Motor PURO, node-testable, sin axe.

   Regla de oro (simétrica, como en F3): faceta no observada → se OMITE
   (no es fallo), y queda en `skipped`. `checked` declara qué se evaluó.

   Spec: docs/specs/checks-a11y.md
   ============================================================ */

/** Severidad de una violación, tal y como la clasifica axe. */
export type AxeImpact = 'minor' | 'moderate' | 'serious' | 'critical';

/** Una violación de axe ya ejecutada (mecanismo), lista para que la política la juzgue. */
export interface AxeViolation {
  /** Regla de axe, p.ej. `'color-contrast'`. */
  id: string;
  impact: AxeImpact;
  /** Texto de ayuda de axe, si lo trae. */
  help?: string;
  /** Cuántos nodos del subárbol incumplen la regla. */
  nodes?: number;
}

/** Instantánea de accesibilidad de un elemento renderizado. La produce el harness. */
export interface A11yObservation {
  tagName: string;
  /** Violaciones de axe sobre el elemento. `undefined` = axe no corrió → se omite. */
  axeViolations?: AxeViolation[];
  /**
   * ¿Es un elemento interactivo (botón, input, link…)? Condiciona si
   * teclado/foco/nombre son exigibles. `undefined` = interactividad no observada.
   */
  interactive?: boolean;
  /** ¿Alcanzable por teclado (tab)? `undefined` = no probado. */
  keyboardReachable?: boolean;
  /** ¿El foco es visible al navegar por teclado? `undefined` = no probado. */
  focusVisible?: boolean;
  /** ¿Tiene nombre accesible (aria-label/labelledby/texto)? `undefined` = no observado. */
  hasAccessibleName?: boolean;
}

export interface A11yFinding {
  /** Regla de axe (`id`) o check de hanko: `'keyboard'` | `'focus'` | `'name'`. */
  rule: string;
  impact: AxeImpact;
  message: string;
}

export interface A11yResult {
  tagName: string;
  pass: boolean;
  /** Hallazgos por encima del umbral → hacen fallar el sello. */
  violations: A11yFinding[];
  /** Hallazgos por debajo del umbral → informan, no fallan. */
  warnings: A11yFinding[];
  /** Qué se evaluó de verdad (transparencia de cobertura). */
  checked: string[];
  /** Qué se omitió y por qué. */
  skipped: string[];
}

export interface A11yOptions {
  /** Severidad mínima que hace fallar el sello. Por defecto `'serious'`. */
  failOn?: AxeImpact;
}

const IMPACT_ORDER: Record<AxeImpact, number> = {
  minor: 0,
  moderate: 1,
  serious: 2,
  critical: 3,
};

/** Evalúa la observación a11y de un elemento contra la política de sello de hanko. */
export function a11yCheck(obs: A11yObservation, options: A11yOptions = {}): A11yResult {
  const failOn: AxeImpact = options.failOn ?? 'serious';
  const threshold = IMPACT_ORDER[failOn];
  const violations: A11yFinding[] = [];
  const warnings: A11yFinding[] = [];
  const checked: string[] = [];
  const skipped: string[] = [];

  // 1 · axe — el grueso de la verificación universal.
  if (obs.axeViolations === undefined) {
    skipped.push('axe (no se ejecutó sobre el elemento)');
  } else {
    checked.push('axe');
    for (const v of obs.axeViolations) {
      const finding: A11yFinding = {
        rule: v.id,
        impact: v.impact,
        message: v.help ?? `regla axe "${v.id}" incumplida`,
      };
      if (IMPACT_ORDER[v.impact] >= threshold) violations.push(finding);
      else warnings.push(finding);
    }
  }

  // 2 · teclado / foco / nombre — exigibles SOLO a elementos interactivos.
  if (obs.interactive === true) {
    const interactiveChecks: ReadonlyArray<[string, boolean | undefined, string]> = [
      ['keyboard', obs.keyboardReachable, 'el elemento interactivo no es alcanzable por teclado'],
      ['focus', obs.focusVisible, 'el foco no es visible al navegar por teclado'],
      ['name', obs.hasAccessibleName, 'el elemento interactivo carece de nombre accesible'],
    ];
    for (const [rule, observed, failMessage] of interactiveChecks) {
      if (observed === undefined) {
        skipped.push(`${rule} (no probado)`);
        continue;
      }
      checked.push(rule);
      if (!observed) violations.push({ rule, impact: 'serious', message: failMessage });
    }
  } else if (obs.interactive === false) {
    skipped.push('keyboard · focus · name (elemento no interactivo)');
  } else {
    skipped.push('keyboard · focus · name (interactividad no observada)');
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
