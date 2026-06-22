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
import type { TypeKind } from '../core/contract';
import type { A11yObservation, AxeImpact, AxeViolation } from '../checks/a11y';
import type { ResilienceObservation, ResilienceTrial } from '../checks/resilience';

/**
 * Pista de tipo DECLARADO que el runner puede pasar por prop para tipar el
 * sentinel de reflexión. Es un dato plano (no el `ComponentContract`): el harness
 * sigue sin conocer el modelo declarado, solo recibe candidatos. `undefined` →
 * inferencia por runtime (`typeof`/`Array.isArray`).
 */
export interface PropTypeHint {
  kind: TypeKind;
  /** Literales válidos si `kind === 'string-union'`. Permite elegir un enum válido. */
  literals?: string[];
}

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

/**
 * Cede al ciclo de actualización del elemento antes de leer estado reflejado.
 *
 * Los componentes basados en LitElement reflejan prop→atributo y renderizan su
 * shadow DOM de forma ASÍNCRONA (microtask siguiente, dentro de `performUpdate`).
 * Leer en el mismo tick que el set ve siempre el estado PREVIO → falso "no refleja"
 * y slots vacíos. Lit expone `el.updateComplete` (un `Promise`); lo esperamos.
 *
 * El harness es GENÉRICO (no todo custom element es Lit), así que detectamos la
 * promesa por DUCK-TYPING (`.then`), sin importar Lit — respeta `genericity.test.ts`.
 * Para un elemento no-Lit cedemos un frame por si refleja en rAF/microtask.
 */
async function elUpdateComplete(el: unknown): Promise<void> {
  const uc = (el as { updateComplete?: unknown }).updateComplete;
  if (uc && typeof (uc as Promise<unknown>).then === 'function') {
    await uc;
  } else {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
  }
}

const STRING_SENTINEL = 'hanko-probe';

/**
 * Elige un sentinel del MISMO tipo que el valor actual de la prop.
 *
 * Antes se asignaba el string `'hanko-probe'` a CUALQUIER prop reflejable. Para
 * una prop data-driven que el componente espera como array (`series`, `links`,
 * `files`… inicializadas a `[]`), eso la dejaba como string → el render hacía
 * `series.flatMap(...)` y PETABA de forma ASÍNCRONA (en `updateComplete`), fuera
 * del alcance del try/catch síncrono → el error afloraba a `window` como ruido
 * (los ~24 `pageerror` del Trust Report que NO eran señal de contrato).
 *
 * Sentinel por tipo: array→`[]` y objeto→`{}` NO rompen el render; booleano→
 * invertido y número→distinto fuerzan un cambio OBSERVABLE (un string podía no
 * producir un atributo «cambiado» → falso «no refleja»). El tipo se infiere por
 * RUNTIME (`typeof`/`Array.isArray` del valor inicial): genérico, sin acoplar el
 * harness al contrato declarado (respeta `genericity.test.ts`). Una prop sin
 * valor inicial (`undefined`) cae al string, como antes.
 */
function typedSentinel(current: unknown): unknown {
  switch (typeof current) {
    case 'boolean':
      return !current;
    case 'number':
      return Number.isFinite(current) ? current + 1 : 1;
    case 'string':
      return current === STRING_SENTINEL ? `${STRING_SENTINEL}-2` : STRING_SENTINEL;
    case 'object':
      if (current === null) return STRING_SENTINEL;
      return Array.isArray(current) ? [] : {};
    default:
      // undefined · bigint · function · symbol → no inferible: string como antes.
      return STRING_SENTINEL;
  }
}

/**
 * Sentinel preferentemente DECLARADO, con runtime como red de seguridad.
 *
 * El tipo declarado lidera en las categorías que infiere con precisión y que el
 * runtime no puede acertar: un **enum** (`string-union`) → el primer literal
 * VÁLIDO distinto del actual (un string arbitrario indexaría mal un mapa interno
 * y rompería el render); booleano/número sin valor inicial (que runtime vería
 * `undefined`). Para `string`/`object`/`unknown` cede al runtime, que distingue
 * array de objeto (`Array.isArray`) mejor que el `kind` del CEM.
 */
function chooseSentinel(current: unknown, hint: PropTypeHint | undefined): unknown {
  switch (hint?.kind) {
    case 'string-union': {
      const pick = hint.literals?.find((l) => l !== current);
      if (pick !== undefined) return pick;
      break; // alias sin literales (p.ej. `LibSize`) → runtime/string fallback
    }
    case 'boolean':
      return typeof current === 'boolean' ? !current : true;
    case 'number':
      return typeof current === 'number' && Number.isFinite(current) ? current + 1 : 1;
    // 'string' | 'object' | 'unknown' | undefined → el runtime infiere mejor.
  }
  return typedSentinel(current);
}

/**
 * Sonda heurística de reflexión prop⇄attribute (sentinel tipado). v0.
 *
 * El sondeo asigna valores SENTINEL deliberadamente adversos. Si uno rompe el
 * render (un enum-alias sin literales conocidos cae al string `'hanko-probe'`,
 * que un mapa interno indexa a `undefined` → `SIZE_MAP[size].px` peta), ese error
 * es ARTEFACTO DEL SONDEO, no un fallo de contrato del componente —de su
 * fragilidad ante basura ya se ocupa la capa de resiliencia (`junk-attrs`). El
 * crash de Lit aflora DIFERIDO a `window` (re-render en cascada, no rechazo de
 * `updateComplete`), así que su absorción la hace el llamador (`observeRuntime`)
 * envolviendo TODA la fase montada, no este bucle.
 */
/** Resultado del sondeo de reflexión: lo que refleja y lo que no se pudo concluir. */
interface ReflectProbe {
  /** Props que reflejan prop→attr (cambio observable del atributo). */
  reflecting: string[];
  /** Props cuyo sondeo NO concluyó porque su propio sentinel rompió el render. */
  inconclusive: string[];
}

async function probeReflect(
  el: HTMLElement,
  properties: string[],
  observed: string[] | undefined,
  types?: Record<string, PropTypeHint>,
): Promise<ReflectProbe | undefined> {
  if (!observed || observed.length === 0) return undefined;
  const reflecting: string[] = [];
  const inconclusive: string[] = [];
  for (const prop of properties) {
    const attr = dasherize(prop);
    if (!observed.includes(attr)) continue;
    const before = el.getAttribute(attr);
    const record = el as unknown as Record<string, unknown>;
    const prev = record[prop];

    // ¿El sondeo de ESTA prop rompió el render ANTES de poder reflejar? La señal es
    // ACOTADA A LA PROP: un throw del setter, o un rechazo de `updateComplete` (el ciclo
    // de update —render incl.— petó al recibir el sentinel). NO escuchamos `window`: un
    // crash que aflora a la ventana DESPUÉS de un `updateComplete` limpio significa que
    // el ciclo de reflexión ya tuvo su oportunidad (si no reflejó, es «no refleja»
    // genuino), y atribuir errores de ventana por timing contaminaría props vecinas.
    // Los crashes a `window` ya los absorbe el `swallow` de `observeRuntime`.
    let crashed = false;
    try {
      record[prop] = chooseSentinel(record[prop], types?.[prop]);
    } catch {
      crashed = true; // el setter rechaza el sentinel → no se pudo sondear
    }
    if (!crashed) {
      // Lit refleja prop→attr DENTRO de `update()`; un hook POSTERIOR (`updated()`,
      // p.ej. una reconstrucción de canvas) puede petar y rechazar `updateComplete`,
      // pero la reflexión YA ocurrió → leemos el atributo igualmente.
      try {
        await elUpdateComplete(el);
      } catch {
        crashed = true; // el render/`updated()` petó al recibir el sentinel
      }
    }

    const after = el.getAttribute(attr);
    if (after !== before) {
      // La reflexión ocurrió (aunque un hook posterior petara). `after !== before`
      // capta también el booleano que refleja QUITANDO el atributo (presente→ausente,
      // `''`→`null`): un default `true` que pasa a `false` reflejaba de verdad y el
      // viejo guard `after !== null` lo descartaba (falso «no refleja»).
      reflecting.push(prop);
    } else if (crashed) {
      // El sentinel adverso rompió el render ANTES de reflejar (p.ej. un enum-alias
      // sin literales en el CEM cuyo string indexa mal un mapa). No se puede verificar
      // → INCONCLUSO: la regla de oro manda OMITIR, no contarlo como «no refleja».
      inconclusive.push(prop);
    }
    // else: settle limpio y atributo sin cambiar → genuinamente no refleja.

    // Restaura el valor previo para sondear cada prop AISLADA: si no, dejar la prop en
    // un sentinel inválido rompería el render de las props siguientes y las marcaría
    // inconclusas en cascada (enmascarando un «no refleja» genuino). Mejor esfuerzo.
    try {
      record[prop] = prev;
      await elUpdateComplete(el);
    } catch {
      /* el componente ya quedó roto por el sentinel; restaurar no siempre lo recupera */
    }
  }
  return { reflecting, inconclusive };
}

/** Nombres de slot del shadow DOM (`''` = slot por defecto). `undefined` sin shadow root. */
function readSlots(el: HTMLElement): string[] | undefined {
  const sr = el.shadowRoot;
  if (!sr) return undefined;
  return [...sr.querySelectorAll('slot')].map((s) => s.name);
}

/**
 * Observa el runtime de un custom element registrado.
 *
 * `propTypes` (opcional) es el tipo DECLARADO por prop (del CEM, vía el runner):
 * tipa el sentinel de la sonda de reflexión para enums/booleanos. Ausente → el
 * harness infiere el tipo por runtime (sigue siendo genérico).
 */
export async function observeRuntime(
  tagName: string,
  propTypes?: Record<string, PropTypeHint>,
): Promise<ComponentRuntime> {
  const ctor = customElements.get(tagName);
  if (!ctor) return { tagName, registered: false };

  const el = document.createElement(tagName);
  const { properties, methods } = publicApiOf(el, HTMLElement.prototype);
  const observedAttributes = readObservedAttributes(ctor);

  // Montar: `connectedCallback` construye el shadow DOM (necesario para los slots)
  // y deja la instancia en su estado real antes de sondear la reflexión. Se retira
  // siempre. Si el componente no monta limpio, slots/reflect quedan sin observar
  // (se omiten en el check, no son fallo de contrato).
  //
  // Lit renderiza el shadow DOM y refleja prop→attr de forma ASÍNCRONA: esperamos
  // su `updateComplete` tras montar antes de leer slots, y dentro de `probeReflect`
  // tras cada set. Sin esto, slots/reflect salían sistemáticamente vacíos (falso
  // positivo en toda la librería). Ver `elUpdateComplete`.
  // El sondeo de reflexión asigna sentinels adversos que pueden romper el render
  // de un componente data-driven o enum (artefacto del sondeo, no fallo de
  // contrato — de eso se ocupa la resiliencia). Lit emite esos crashes DIFERIDOS a
  // `window` (re-render en cascada / update pendiente al desmontar), no rechazando
  // `updateComplete`. Absorbemos esos errores a nivel `window` (`preventDefault`)
  // durante toda la fase montada —montaje, sondeo, settle y desmontaje— para que
  // no rebote como `pageerror` ni descalifique nada. Genérico: `window`/`setTimeout`
  // son globals del DOM, no acoplan a Lit/shibui (respeta `genericity.test.ts`).
  let slots: string[] | undefined;
  let reflect: ReflectProbe | undefined;
  const swallow = (e: Event): void => e.preventDefault();
  window.addEventListener('error', swallow);
  window.addEventListener('unhandledrejection', swallow);
  try {
    document.body.appendChild(el);
    await elUpdateComplete(el);
    slots = readSlots(el);
    reflect = await probeReflect(el, properties, observedAttributes, propTypes);
  } catch {
    /* observación parcial: lo no observado se omite por la regla de oro */
  } finally {
    el.remove();
    // Cede dos macrotasks para que los crashes async que provocó el sondeo (y los
    // que dispare el desmontaje) afloren y se absorban antes de retirar los listeners.
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    window.removeEventListener('error', swallow);
    window.removeEventListener('unhandledrejection', swallow);
  }

  const runtime: ComponentRuntime = { tagName, registered: true, properties, methods };
  if (observedAttributes !== undefined) runtime.observedAttributes = observedAttributes;
  if (reflect !== undefined) {
    runtime.reflectingProperties = reflect.reflecting;
    if (reflect.inconclusive.length > 0) runtime.reflectInconclusiveProperties = reflect.inconclusive;
  }
  if (slots !== undefined) runtime.slots = slots;
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

/** Roles ARIA de región (landmarks): demarcan zonas, NO son controles. */
const LANDMARK_ROLES: ReadonlySet<string> = new Set([
  'banner', 'contentinfo', 'navigation', 'main', 'complementary', 'region', 'search', 'form',
]);
/** Elementos HTML cuyo rol de landmark es implícito (no necesitan `role`). */
const LANDMARK_ELEMENTS: ReadonlySet<string> = new Set([
  'header', 'footer', 'nav', 'main', 'aside',
]);

/**
 * ¿El componente es una REGIÓN (landmark), no un control? (calibración F4-cierre).
 *
 * Una región contiene controles pero no es ella misma operable, así que NO se le
 * exige teclado/foco/nombre como a un control. Señal genérica de región: el host
 * expone un rol de landmark, o el elemento más externo del shadow es un landmark
 * nativo (`<header>`/`<footer>`/`<nav>`/`<main>`/`<aside>`) — shibui usa elementos
 * nativos en vez de `role`, de ahí la segunda vía. Es deliberadamente estrecha (el
 * landmark ha de ser el WRAPPER, no estar anidado) para no perder controles que
 * delegan en un hijo del shadow.
 */
function isLandmarkRegion(el: HTMLElement): boolean {
  const role = el.getAttribute('role');
  if (role !== null && LANDMARK_ROLES.has(role)) return true;
  const root = el.shadowRoot?.firstElementChild;
  return root != null && LANDMARK_ELEMENTS.has(root.localName);
}

/**
 * Selector de elementos GENUINAMENTE alcanzables por tab: excluye `[tabindex="-1"]`
 * (enfocable por script pero NO por tab), los nativos deshabilitados y los
 * `input[type="hidden"]` (presentes pero no enfocables).
 */
const TABBABLE_SELECTOR =
  'button:not([disabled]),a[href],input:not([disabled]):not([type="hidden"]),' +
  'select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
/** ¿Hay un tabbable real dentro del shadow? (no basta con que exista el shadow). */
function hasTabbableInShadow(el: HTMLElement): boolean {
  return el.shadowRoot?.querySelector(TABBABLE_SELECTOR) != null;
}

/**
 * Heurística de interactividad. v0: tabindex propio, rol interactivo, o un tabbable
 * GENUINO en el shadow.
 *
 * El barrido del shadow usa `hasTabbableInShadow` (el mismo selector que la señal de
 * teclado), que EXCLUYE `[tabindex="-1"]`: un `-1` es foco programático, no un control
 * (un `<span role="note" tabindex="-1">` presentacional o un `[role=dialog tabindex=-1]`
 * contenedor no son operables). Antes el selector laxo los marcaba interactivos → como
 * nunca son tab-reachable, fabricaban un falso fallo de `keyboard`. Alineados, la regla
 * `keyboard` solo falla en su caso real: declara rol interactivo pero es inalcanzable.
 */
function isInteractive(el: HTMLElement): boolean {
  if (el.tabIndex >= 0) return true;
  // Una región (landmark) contiene controles pero no es un control: se descarta
  // ANTES del barrido del shadow para no marcarla interactiva por su contenido.
  if (isLandmarkRegion(el)) return false;
  const role = el.getAttribute('role');
  if (role !== null && INTERACTIVE_ROLES.has(role)) return true;
  return hasTabbableInShadow(el);
}

/** ¿Tiene nombre accesible? Heurística v0 (aria-label/labelledby/texto). */
function hasAccessibleName(el: HTMLElement): boolean {
  const label = el.getAttribute('aria-label');
  if (label !== null && label.trim() !== '') return true;
  if (el.getAttribute('aria-labelledby') !== null) return true;
  return (el.textContent ?? '').trim() !== '';
}

/**
 * Props cuyo nombre indica que aportan el nombre accesible del componente. v0.
 * Alta precisión a propósito (calibración C): incluir aquí una prop que NO nombra
 * = falso negativo (omite una violación real). Por eso se excluyen `name` (atributo
 * de formulario, no nombre a11y) y `placeholder` (no es nombre accesible fiable).
 */
const NAMEISH_PROP = /^(?:aria-?label|label|text|heading|caption|title|alt)$/i;

/**
 * ¿Puede el consumidor aportar el nombre accesible? (calibración C). Tres vías:
 *   1. el contrato DECLARA un slot por defecto (`''`) → capacidad de nombre aunque
 *      el montaje vacío no lo renderice (un slot condicional al contenido);
 *   2. el shadow vivo expone un slot por defecto (cubre CEM incompletos);
 *   3. el componente declara una prop de etiqueta (`label`/`ariaLabel`/…).
 * `declaredProps`/`declaredSlots` son nombres del CEM (el harness no ve el
 * `ComponentContract`: recibe listas planas, igual que `propTypes`). Genérico.
 * Es una pregunta de CAPACIDAD: la responde el contrato, no el render vacío.
 */
function isNameSupplyable(
  el: HTMLElement,
  declaredProps: readonly string[],
  declaredSlots: readonly string[],
): boolean {
  if (declaredSlots.includes('')) return true;
  const runtimeSlots = readSlots(el);
  if (runtimeSlots && runtimeSlots.includes('')) return true;
  return declaredProps.some((p) => NAMEISH_PROP.test(p));
}

/**
 * Observa la accesibilidad de un custom element renderizado. axe inyectado.
 *
 * `declaredProps`/`declaredSlots` (opcionales, nombres del CEM vía el runner)
 * alimentan la señal `nameSupplyable`: con el montaje VACÍO un componente bien
 * diseñado aparece sin nombre; saber si el nombre es aportable (slot por defecto /
 * prop de etiqueta) deja que la política omita ese ruido sin perder la señal real.
 * Ausentes → solo cuenta el slot por defecto del shadow vivo; sigue siendo genérico.
 */
export async function observeA11y(
  tagName: string,
  runAxe: AxeRunner,
  declaredProps: readonly string[] = [],
  declaredSlots: readonly string[] = [],
): Promise<A11yObservation> {
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
      // Señal real de teclado (calibración F4-cierre): el host es tabbable, o el
      // shadow contiene un tabbable GENUINO. Antes era `tabIndex>=0 || shadowRoot
      // !== null` → verde para TODO LitElement (shadow siempre existe): laxitud que
      // fingía cobertura. Ahora la regla `keyboard` puede fallar de verdad cuando un
      // componente se declara interactivo (rol/contenido) pero nada es alcanzable.
      obs.keyboardReachable = el.tabIndex >= 0 || hasTabbableInShadow(el);
      obs.hasAccessibleName = hasAccessibleName(el);
      obs.nameSupplyable = isNameSupplyable(el, declaredProps, declaredSlots);
      // focusVisible: DIFERIDO formalmente (F4-cierre, decisión 1.3). Verificar el
      // anillo de foco exige foco real + leer `:focus-visible`/outline: caro y frágil
      // en headless, con la peor relación señal/coste de la capa. Se deja sin observar
      // → la regla `focus` se OMITE (regla de oro), no se finge. Ver docs/specs/checks-a11y.md.
    }
    return obs;
  } finally {
    el.remove();
  }
}

/**
 * Monta el elemento, le aplica un setup y lo retira. Espera `updateComplete`
 * para que los throws ASÍNCRONOS de Lit afloren DENTRO del trial (si no, el
 * try/catch síncrono los perdía → resiliencia optimista en falso). Relanza.
 */
async function mountThenRemove(tagName: string, setup: (el: HTMLElement) => void): Promise<void> {
  const el = document.createElement(tagName);
  setup(el);
  document.body.appendChild(el);
  try {
    await elUpdateComplete(el);
  } finally {
    el.remove();
  }
}

/**
 * Escenarios adversos que se montan SIN datos (`empty`/`junk-attrs`/`rtl`): un
 * componente data-driven puede petar en ellos por falta de datos, no por fragilidad
 * real. Por eso el runner los pasa como `optional` → su fallo es un WARNING, no
 * descalifica el sello (`src/report/run.ts`). (Distinguir «frágil» de «necesita datos»
 * exigiría sembrar datos mínimos por tipo — `valid-min`, diferido a vNext; ver
 * docs/specs/checks-resilience.md.)
 *
 * El otro escenario que ejecuta `observeResilience`, `remount`, NO está aquí: NO es
 * data-dependent (re-montar la MISMA instancia vacía no depende de datos), así que un
 * crash ahí es fragilidad de ciclo de vida GENUINA → es OBLIGATORIO (descalifica el
 * sello). Ver `observeRemount`, que lo aísla del montaje vacío para no doble-contar
 * el escenario `empty` (evita el falso positivo #549).
 */
export const DATA_DEPENDENT_SCENARIOS: readonly string[] = ['empty', 'junk-attrs', 'rtl'];

/**
 * Corre un trial capturando TODO lo que pueda romperlo: el throw síncrono/rechazo de
 * `run()` Y los errores que el componente emite a nivel `window` (`error` /
 * `unhandledrejection`). Lit reporta la mayoría de fallos de render a la ventana, no
 * rechazando `updateComplete`, así que sin esto el `await` los perdía → falso «sobrevivió».
 *
 * Los listeners llaman `preventDefault()` para adueñarse del error: lo marca «manejado»
 * (no rebota como uncaught en el runner de tests) y evita el `pageerror` redundante, ahora
 * que vive estructurado en el trial. Cede un macrotask para que los throws diferidos
 * (`setTimeout`) afloren antes de quitar los listeners. Devuelve los mensajes deduplicados.
 *
 * Genérico: `window`/`ErrorEvent`/`PromiseRejectionEvent`/`setTimeout` son globals del DOM,
 * no acoplan a Lit/shibui (respeta `genericity.test.ts`).
 */
async function runCapturingWindowErrors(run: () => Promise<void>): Promise<string[]> {
  const captured: string[] = [];
  const onError = (e: ErrorEvent): void => {
    e.preventDefault();
    captured.push(e.message || String(e.error));
  };
  const onRejection = (e: PromiseRejectionEvent): void => {
    e.preventDefault();
    captured.push(String(e.reason));
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);

  let thrown: string | undefined;
  try {
    await run();
  } catch (err) {
    thrown = String(err);
  }
  // Cede un macrotask: los throws async a nivel window (p.ej. setTimeout en render) afloran aquí.
  await new Promise<void>((resolve) => setTimeout(resolve, 0));

  window.removeEventListener('error', onError);
  window.removeEventListener('unhandledrejection', onRejection);

  const all = thrown !== undefined ? [thrown, ...captured] : captured;
  return [...new Set(all)];
}

/**
 * Monta una instancia YA creada, espera su `updateComplete` y la retira, capturando
 * lo que la rompa (throw del trial + errores a `window`). Reutilizable para el ciclo
 * de re-montaje, que necesita conservar la MISMA instancia entre montajes.
 */
function mountInstanceCapturing(el: HTMLElement): Promise<string[]> {
  return runCapturingWindowErrors(async () => {
    document.body.appendChild(el);
    try {
      await elUpdateComplete(el);
    } finally {
      el.remove();
    }
  });
}

/**
 * Escenario `remount` (OBLIGATORIO): un componente sano sobrevive a montarse,
 * desmontarse y volver a montarse vacío. Mide fragilidad de ciclo de vida, no de datos.
 *
 * Para NO reintroducir el falso positivo data-driven (#549), solo cuenta el fallo del
 * SEGUNDO montaje: si el PRIMER montaje vacío ya peta, eso es asunto del escenario
 * `empty` (data-dependent, tolerable) — `remount` lo omite (devuelve sin errores) en
 * vez de doble-contar el mismo crash. Conserva la MISMA instancia entre montajes para
 * exponer el estado no reinicializado / los listeners filtrados al re-conectar.
 */
async function observeRemount(tagName: string): Promise<string[]> {
  const el = document.createElement(tagName);
  const first = await mountInstanceCapturing(el);
  if (first.length > 0) return []; // primer montaje falló → lo capta `empty`, no es fragilidad de remount
  return mountInstanceCapturing(el); // re-monta la MISMA instancia: aquí sí mide la fragilidad de remount
}

/** Observa la resiliencia montando el componente bajo escenarios adversos. */
export async function observeResilience(tagName: string): Promise<ResilienceObservation> {
  if (!customElements.get(tagName)) return { tagName };

  const scenarios: ReadonlyArray<[string, () => Promise<string[]>]> = [
    ['empty', () => runCapturingWindowErrors(() => mountThenRemove(tagName, () => undefined))],
    [
      'junk-attrs',
      () =>
        runCapturingWindowErrors(() =>
          mountThenRemove(tagName, (el) => {
            el.setAttribute('variant', 'zzz-invalid');
            el.setAttribute('size', '-999');
            el.setAttribute('disabled', 'not-a-bool');
          }),
        ),
    ],
    [
      'rtl',
      () => runCapturingWindowErrors(() => mountThenRemove(tagName, (el) => el.setAttribute('dir', 'rtl'))),
    ],
    ['remount', () => observeRemount(tagName)],
  ];

  const trials: ResilienceTrial[] = [];
  for (const [scenario, evaluate] of scenarios) {
    const errors = await evaluate();
    trials.push(
      errors.length === 0
        ? { scenario, survived: true }
        : { scenario, survived: false, error: errors.join(' | ') },
    );
  }

  return { tagName, trials };
}
