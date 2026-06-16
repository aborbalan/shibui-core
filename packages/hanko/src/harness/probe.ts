/* ============================================================
   hanko · Harness de runtime (F3/F4/F5 · incremento 2)

   El MÚSCULO que rellena las observaciones que los checks puros
   (contract / a11y / resilience) consumen. Convierte un custom
   element VIVO en `ComponentRuntime`, `A11yObservation` y
   `ResilienceObservation`.

   Es GENÉRICO: opera sobre cualquier custom element registrado en
   el documento actual; NO importa shibui. axe se INYECTA (no se
   importa aquí) para mantener el harness desacoplado del runner.

   Reparto puro / navegador:
     · `publicApiOf` es PURO (reflexión de prototipos) → se testea en
       Node con clases falsas (probe.test.ts).
     · `observeRuntime` / `observeA11y` / `observeResilience` usan el
       DOM real → se ejercitan en el nivel browser (*.browser.test.ts).

   ⚠️ Las heurísticas de a11y/resiliencia son v0: a calibrar contra
   shibui-ui real (generalizar desde el uso). Ver docs/specs/harness.md.
   ============================================================ */
import type { ComponentRuntime } from '../core/runtime';
import type { A11yObservation, AxeImpact, AxeViolation } from '../checks/a11y';
import type { ResilienceObservation, ResilienceTrial } from '../checks/resilience';

/* ───────────────────────── puro (node-testable) ───────────────────────── */

/**
 * Recolecta la API pública alcanzable de un objeto recorriendo su cadena de
 * prototipos hasta `stopProto` (exclusive). Accessors y campos → `properties`;
 * funciones → `methods`. Excluye `constructor` y nombres `_`/privados.
 *
 * En el navegador, `stopProto = HTMLElement.prototype` para no recoger la API
 * heredada del DOM. En Node se testea con una clase base cualquiera.
 */
export function publicApiOf(
  instance: object,
  stopProto: object = Object.prototype,
): { properties: string[]; methods: string[] } {
  const properties = new Set<string>();
  const methods = new Set<string>();

  let proto: object | null = Object.getPrototypeOf(instance);
  while (proto && proto !== stopProto && proto !== Object.prototype) {
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (name === 'constructor' || name.startsWith('_')) continue;
      const desc = Object.getOwnPropertyDescriptor(proto, name);
      if (!desc) continue;
      if (typeof desc.value === 'function') methods.add(name);
      else properties.add(name); // accessor (get/set) o dato
    }
    proto = Object.getPrototypeOf(proto);
  }

  // Campos propios de instancia (class fields del vanilla).
  for (const name of Object.getOwnPropertyNames(instance)) {
    if (!name.startsWith('_')) properties.add(name);
  }

  return { properties: [...properties], methods: [...methods] };
}

/** camelCase → kebab-case (mapeo prop → atributo por convención). */
export function dasherize(name: string): string {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/* ───────────────────────── navegador (browser-only) ───────────────────────── */

/** Lee `static observedAttributes` de un constructor de custom element. */
function readObservedAttributes(ctor: CustomElementConstructor): string[] | undefined {
  const oa = (ctor as unknown as { observedAttributes?: unknown }).observedAttributes;
  return Array.isArray(oa) ? oa.map(String) : undefined;
}

/** Sonda heurística de reflexión prop⇄attribute (string sentinel). v0. */
function probeReflect(
  el: HTMLElement,
  properties: string[],
  observed: string[] | undefined,
): string[] | undefined {
  if (!observed || observed.length === 0) return undefined;
  const reflecting: string[] = [];
  for (const prop of properties) {
    const attr = dasherize(prop);
    if (!observed.includes(attr)) continue;
    try {
      const before = el.getAttribute(attr);
      (el as unknown as Record<string, unknown>)[prop] = 'hanko-probe';
      const after = el.getAttribute(attr);
      if (after !== null && after !== before) reflecting.push(prop);
    } catch {
      // props que no aceptan el sentinel string → no concluyente, se ignora
    }
  }
  return reflecting;
}

/** Observa el runtime de un custom element registrado. */
export function observeRuntime(tagName: string): ComponentRuntime {
  const ctor = customElements.get(tagName);
  if (!ctor) return { tagName, registered: false };

  const el = document.createElement(tagName);
  const { properties, methods } = publicApiOf(el, HTMLElement.prototype);
  const observedAttributes = readObservedAttributes(ctor);
  const reflectingProperties = probeReflect(el, properties, observedAttributes);

  const runtime: ComponentRuntime = { tagName, registered: true, properties, methods };
  if (observedAttributes !== undefined) runtime.observedAttributes = observedAttributes;
  if (reflectingProperties !== undefined) runtime.reflectingProperties = reflectingProperties;
  return runtime;
}

/** Forma mínima del resultado de axe que el harness consume (inyectado). */
export interface AxeResultLike {
  violations: Array<{ id: string; impact?: string | null; help?: string; nodes?: unknown[] }>;
}
export type AxeRunner = (target: Element) => Promise<AxeResultLike>;

const VALID_IMPACTS: ReadonlySet<string> = new Set(['minor', 'moderate', 'serious', 'critical']);
function normalizeImpact(impact: string | null | undefined): AxeImpact {
  return impact !== null && impact !== undefined && VALID_IMPACTS.has(impact)
    ? (impact as AxeImpact)
    : 'moderate';
}

const INTERACTIVE_ROLES: ReadonlySet<string> = new Set([
  'button', 'link', 'checkbox', 'radio', 'switch', 'tab', 'menuitem', 'textbox', 'slider', 'option',
]);
/** Heurística de interactividad. v0: tabindex, role o tabbable nativo en shadow. */
function isInteractive(el: HTMLElement): boolean {
  if (el.tabIndex >= 0) return true;
  const role = el.getAttribute('role');
  if (role !== null && INTERACTIVE_ROLES.has(role)) return true;
  const sr = el.shadowRoot;
  return sr !== null && sr.querySelector('button,a[href],input,select,textarea,[tabindex]') !== null;
}

/** ¿Tiene nombre accesible? Heurística v0 (aria-label/labelledby/texto). */
function hasAccessibleName(el: HTMLElement): boolean {
  const label = el.getAttribute('aria-label');
  if (label !== null && label.trim() !== '') return true;
  if (el.getAttribute('aria-labelledby') !== null) return true;
  return (el.textContent ?? '').trim() !== '';
}

/** Observa la accesibilidad de un custom element renderizado. axe inyectado. */
export async function observeA11y(tagName: string, runAxe: AxeRunner): Promise<A11yObservation> {
  const ctor = customElements.get(tagName);
  if (!ctor) return { tagName };

  const el = document.createElement(tagName);
  document.body.appendChild(el);
  try {
    const result = await runAxe(el);
    const axeViolations: AxeViolation[] = result.violations.map((v) => {
      const out: AxeViolation = { id: v.id, impact: normalizeImpact(v.impact) };
      if (v.help !== undefined) out.help = v.help;
      if (Array.isArray(v.nodes)) out.nodes = v.nodes.length;
      return out;
    });

    const interactive = isInteractive(el);
    const obs: A11yObservation = { tagName, axeViolations, interactive };
    if (interactive) {
      obs.keyboardReachable = el.tabIndex >= 0 || el.shadowRoot !== null;
      obs.hasAccessibleName = hasAccessibleName(el);
      // focusVisible exige render/foco real: se deja sin observar (no se omite el resto).
    }
    return obs;
  } finally {
    el.remove();
  }
}

/** Monta el elemento, le aplica un setup y lo retira; relanza si algo explota. */
function mountThenRemove(tagName: string, setup: (el: HTMLElement) => void): void {
  const el = document.createElement(tagName);
  setup(el);
  document.body.appendChild(el);
  el.remove();
}

/** Observa la resiliencia montando el componente bajo escenarios adversos. */
export function observeResilience(tagName: string): ResilienceObservation {
  if (!customElements.get(tagName)) return { tagName };

  const scenarios: ReadonlyArray<[string, () => void]> = [
    ['empty', () => mountThenRemove(tagName, () => undefined)],
    [
      'junk-attrs',
      () =>
        mountThenRemove(tagName, (el) => {
          el.setAttribute('variant', 'zzz-invalid');
          el.setAttribute('size', '-999');
          el.setAttribute('disabled', 'not-a-bool');
        }),
    ],
    ['rtl', () => mountThenRemove(tagName, (el) => el.setAttribute('dir', 'rtl'))],
    [
      'remount',
      () => {
        const el = document.createElement(tagName);
        document.body.appendChild(el);
        el.remove();
        document.body.appendChild(el);
        el.remove();
      },
    ],
  ];

  const trials: ResilienceTrial[] = scenarios.map(([scenario, run]) => {
    try {
      run();
      return { scenario, survived: true };
    } catch (err) {
      return { scenario, survived: false, error: String(err) };
    }
  });

  return { tagName, trials };
}
