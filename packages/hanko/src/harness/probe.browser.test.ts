import { describe, it, expect, beforeAll } from 'vitest';
import * as axe from 'axe-core';
import { observeRuntime, observeA11y, observeResilience, ADVERSE_SCENARIOS } from './probe';
import { contractCheck } from '../checks/contract';
import { a11yCheck } from '../checks/a11y';
import { resilienceCheck } from '../checks/resilience';
import type { ComponentContract } from '../core/contract';

/* Ejercita el harness contra un custom element REAL en un navegador REAL
   (Playwright vía @vitest/browser). Autocontenido: define su propio elemento,
   sin acoplar a shibui-ui. El dogfood sobre shibui real se documenta en
   docs/specs/harness.md (necesita el build de shibui + su CEM). */

class HankoProbeButton extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant', 'disabled'];
  }
  variant = 'solid';
  disabled = false;
  connectedCallback(): void {
    if (!this.shadowRoot) {
      const sr = this.attachShadow({ mode: 'open' });
      const btn = document.createElement('button');
      btn.textContent = this.getAttribute('aria-label') ?? 'ok';
      const icon = document.createElement('slot');
      icon.setAttribute('name', 'icon');
      btn.append(icon, document.createElement('slot')); // slot "icon" + slot por defecto
      sr.appendChild(btn);
    }
  }
  reset(): void {
    this.variant = 'solid';
  }
}

/**
 * Elemento Lit-LIKE: refleja prop→atributo de forma ASÍNCRONA (en el microtask
 * siguiente, vía un `updateComplete` igual que LitElement). Sirve para verificar
 * que el harness espera el ciclo de update antes de leer el atributo reflejado.
 */
class HankoAsyncReflect extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant'];
  }
  #variant = 'solid';
  #pending: Promise<boolean> | null = null;
  get variant(): string {
    return this.#variant;
  }
  set variant(v: string) {
    this.#variant = v;
    // Refleja en el siguiente microtask, NO en este tick (como Lit).
    this.#pending = Promise.resolve().then(() => {
      this.setAttribute('variant', v);
      return true;
    });
  }
  /** Promesa que resuelve cuando la reflexión pendiente se ha aplicado. */
  get updateComplete(): Promise<boolean> {
    return this.#pending ?? Promise.resolve(true);
  }
}

/**
 * Componente DATA-DRIVEN que PETA al montarse vacío: su render hace `items.map(...)`
 * de forma ASÍNCRONA (como Lit). Sin datos → `undefined.map` lanza en la microtask.
 * Sirve para probar (a) que el harness captura el throw async y (b) que sembrar
 * `items: []` lo deja renderizar.
 */
class HankoNeedsData extends HTMLElement {
  items: unknown;
  #pending: Promise<void> | null = null;
  connectedCallback(): void {
    this.#pending = Promise.resolve().then(() => {
      (this.items as unknown[]).map((x) => x); // lanza si items no es array
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'));
      }
    });
  }
  get updateComplete(): Promise<void> {
    return this.#pending ?? Promise.resolve();
  }
}

/**
 * Componente que PETA SOLO a nivel `window`: lanza desde un `setTimeout` en
 * `connectedCallback`, sin rechazar `updateComplete` (que resuelve limpio). El `await`
 * del harness no lo vería — como los crashes de render de Lit que afloran como `pageerror`,
 * no como rechazo de la promesa. Cubre el camino de captura por listener de ventana.
 */
class HankoWindowThrower extends HTMLElement {
  connectedCallback(): void {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'));
    }
    setTimeout(() => {
      throw new Error('hanko-window-boom');
    }, 0);
  }
  get updateComplete(): Promise<void> {
    return Promise.resolve();
  }
}

/**
 * Componente DATA-DRIVEN con una prop array REFLEJABLE (`rows` en
 * `observedAttributes`, inicializada a `[]`) cuyo render hace `rows.map(...)` de
 * forma ASÍNCRONA (como Lit). Si la sonda de reflexión le asignara el viejo
 * sentinel STRING, `'hanko-probe'.map` petaría a nivel `window` (el patrón de los
 * ~24 `pageerror`). Con el sentinel TIPADO recibe `[]` y renderiza limpio.
 */
class HankoReflectArray extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['rows'];
  }
  rows: unknown = [];
  #pending: Promise<void> | null = null;
  connectedCallback(): void {
    this.scheduleRender();
  }
  attributeChangedCallback(): void {
    this.scheduleRender();
  }
  scheduleRender(): void {
    this.#pending = Promise.resolve().then(() => {
      (this.rows as unknown[]).map((x) => x); // peta si rows no es array
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'));
      }
    });
  }
  get updateComplete(): Promise<void> {
    return this.#pending ?? Promise.resolve();
  }
}

/**
 * Booleano de reflexión ESTRICTA: refleja `active`⇄atributo SOLO si el valor es un
 * boolean real (converter estricto, como el de Lit). Con el viejo sentinel STRING
 * (`'hanko-probe'`) el setter ignora el cambio → la sonda daba FALSO «no refleja».
 * Con el sentinel TIPADO recibe el booleano invertido → refleja → se detecta.
 */
class HankoStrictBool extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['active'];
  }
  #active = false;
  #pending: Promise<void> | null = null;
  get active(): boolean {
    return this.#active;
  }
  set active(v: unknown) {
    this.#active = Boolean(v);
    this.#pending = Promise.resolve().then(() => {
      if (typeof v !== 'boolean') return; // converter estricto: un string no refleja
      if (v) this.setAttribute('active', '');
      else this.removeAttribute('active');
    });
  }
  get updateComplete(): Promise<boolean | void> {
    return this.#pending ?? Promise.resolve();
  }
}

/**
 * Componente con una prop ENUM que indexa un mapa y DESTRUCTURA el resultado en
 * el render async (`const { px } = MAP[mode]`), como `lib-progress-circle` con
 * `SIZE_MAP[size]`. Un valor fuera del enum → `MAP[v]` es `undefined` → la
 * destructuración PETA. Refleja `mode`⇄atributo sincrónicamente.
 *
 * Sirve para dos caminos: (a) con literales del CEM la sonda elige un enum VÁLIDO
 * → no peta y detecta reflexión; (b) sin literales cae al string → peta, pero el
 * error (artefacto del sondeo) lo absorbe `probeReflect` → `observeRuntime`
 * resuelve limpio.
 */
const ENUM_MAP: Record<string, { px: number }> = { alpha: { px: 10 }, beta: { px: 20 } };
class HankoEnumMap extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['mode'];
  }
  #mode = 'alpha';
  #pending: Promise<void> | null = null;
  get mode(): string {
    return this.#mode;
  }
  set mode(v: unknown) {
    this.#mode = String(v);
    this.setAttribute('mode', this.#mode); // refleja prop→attr
    // Render que resuelve `updateComplete` LIMPIO; el fallo aflora a `window` (vía
    // setTimeout), como un crash de render de Lit que no rechaza la promesa.
    this.#pending = Promise.resolve().then(() => {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' }).appendChild(document.createElement('slot'));
      }
    });
    setTimeout(() => {
      const { px } = ENUM_MAP[this.#mode]!; // peta a window si `mode` no es clave válida
      void px;
    }, 0);
  }
  get updateComplete(): Promise<void> {
    return this.#pending ?? Promise.resolve();
  }
}

beforeAll(() => {
  if (!customElements.get('hanko-probe-button')) {
    customElements.define('hanko-probe-button', HankoProbeButton);
  }
  if (!customElements.get('hanko-enum-map')) {
    customElements.define('hanko-enum-map', HankoEnumMap);
  }
  if (!customElements.get('hanko-async-reflect')) {
    customElements.define('hanko-async-reflect', HankoAsyncReflect);
  }
  if (!customElements.get('hanko-needs-data')) {
    customElements.define('hanko-needs-data', HankoNeedsData);
  }
  if (!customElements.get('hanko-window-thrower')) {
    customElements.define('hanko-window-thrower', HankoWindowThrower);
  }
  if (!customElements.get('hanko-reflect-array')) {
    customElements.define('hanko-reflect-array', HankoReflectArray);
  }
  if (!customElements.get('hanko-strict-bool')) {
    customElements.define('hanko-strict-bool', HankoStrictBool);
  }
});

describe('harness · observeRuntime', () => {
  it('refleja la API pública del elemento vivo', async () => {
    const rt = await observeRuntime('hanko-probe-button');
    expect(rt.registered).toBe(true);
    expect(rt.properties).toEqual(expect.arrayContaining(['variant', 'disabled']));
    expect(rt.methods).toEqual(expect.arrayContaining(['reset']));
    expect(rt.observedAttributes).toEqual(['variant', 'disabled']);
  });

  it('observa los slots del shadow DOM (named + por defecto)', async () => {
    const rt = await observeRuntime('hanko-probe-button');
    expect(rt.slots).toEqual(expect.arrayContaining(['icon', '']));
  });

  it('detecta reflexión prop⇄attribute ASÍNCRONA esperando updateComplete', async () => {
    // El elemento refleja en el microtask siguiente (como Lit): si el harness
    // leyera el atributo en el mismo tick que el set, lo daría como "no refleja".
    const rt = await observeRuntime('hanko-async-reflect');
    expect(rt.reflectingProperties).toContain('variant');
  });

  it('sondea una prop array reflejable SIN romper el render (sentinel tipado)', async () => {
    // Con el viejo sentinel string, `'hanko-probe'.map` petaba a nivel window (los
    // ~24 `pageerror`). El sentinel tipado asigna `[]` → el render data-driven vive.
    const crashes: string[] = [];
    const onError = (e: ErrorEvent): void => {
      e.preventDefault();
      crashes.push(e.message || String(e.error));
    };
    window.addEventListener('error', onError);
    try {
      await observeRuntime('hanko-reflect-array');
      // Cede un macrotask por si un throw async aflorara a window.
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
    } finally {
      window.removeEventListener('error', onError);
    }
    expect(crashes.filter((m) => /is not a function/.test(m))).toHaveLength(0);
  });

  it('detecta reflexión de un booleano estricto invirtiendo el valor (no falso negativo)', async () => {
    // Converter estricto: solo refleja un boolean real. El viejo sentinel string lo
    // daba como «no refleja»; el sentinel tipado invierte el booleano → SÍ refleja.
    const rt = await observeRuntime('hanko-strict-bool');
    expect(rt.reflectingProperties).toContain('active');
  });

  it('usa los literales del CEM para elegir un enum VÁLIDO (no rompe el mapa interno)', async () => {
    // Con el tipo declarado (`string-union` + literales), la sonda asigna un enum
    // válido distinto del actual ('beta' ≠ 'alpha') → `ENUM_MAP['beta']` existe, no
    // peta, y detecta la reflexión. Sin esto, el string sentinel petaría el render.
    const rt = await observeRuntime('hanko-enum-map', {
      mode: { kind: 'string-union' as const, literals: ['alpha', 'beta'] },
    });
    expect(rt.registered).toBe(true);
    expect(rt.reflectingProperties).toContain('mode');
  });

  it('ABSORBE el crash que el propio sondeo provoca en un enum sin literales', async () => {
    // Sin tipo declarado (enum-alias del CEM, p.ej. `LibSize`), la sonda cae al
    // string → `ENUM_MAP['hanko-probe']` es undefined → la destructuración PETA de
    // forma async. Ese error es ARTEFACTO DEL SONDEO: `probeReflect` lo absorbe a
    // nivel window. Si NO lo hiciera, el throw async tumbaría este test.
    const rt = await observeRuntime('hanko-enum-map');
    expect(rt.registered).toBe(true);
    // La reflexión se detecta igual (el set sí escribió el atributo antes de petar).
    expect(rt.reflectingProperties).toContain('mode');
  });

  it('alimenta contractCheck sin violaciones para un contrato fiel', async () => {
    const declared: ComponentContract = {
      tagName: 'hanko-probe-button',
      modulePath: 'm',
      source: { kind: 'cem' },
      properties: [
        { property: 'variant', attribute: 'variant', reflects: false, type: { raw: 'string', kind: 'string' } },
        { property: 'disabled', attribute: 'disabled', reflects: false, type: { raw: 'boolean', kind: 'boolean' } },
      ],
      methods: [{ name: 'reset' }],
      slots: [{ name: 'icon' }, { name: '' }],
    };
    const r = contractCheck(declared, await observeRuntime('hanko-probe-button'));
    expect(r.violations).toHaveLength(0);
    expect(r.checked.slots).toBe(2);
  });

  it('no marca falso "no refleja" para una prop reflects:true async', async () => {
    const declared: ComponentContract = {
      tagName: 'hanko-async-reflect',
      modulePath: 'm',
      source: { kind: 'cem' },
      properties: [
        { property: 'variant', attribute: 'variant', reflects: true, type: { raw: 'string', kind: 'string' } },
      ],
    };
    const r = contractCheck(declared, await observeRuntime('hanko-async-reflect'));
    expect(r.violations.some((v) => v.facet === 'reflect')).toBe(false);
    expect(r.checked.reflect).toBe(1);
  });

  it('detecta un slot declarado que el elemento no expone', async () => {
    const declared: ComponentContract = {
      tagName: 'hanko-probe-button',
      modulePath: 'm',
      source: { kind: 'cem' },
      slots: [{ name: 'icon' }, { name: 'footer' }],
    };
    const r = contractCheck(declared, await observeRuntime('hanko-probe-button'));
    expect(r.violations.some((v) => v.facet === 'slot' && v.member === 'footer')).toBe(true);
    expect(r.violations.some((v) => v.facet === 'slot' && v.member === 'icon')).toBe(false);
  });

  it('detecta un método declarado que el elemento no tiene', async () => {
    const declared: ComponentContract = {
      tagName: 'hanko-probe-button',
      modulePath: 'm',
      source: { kind: 'cem' },
      methods: [{ name: 'fly' }],
    };
    const r = contractCheck(declared, await observeRuntime('hanko-probe-button'));
    expect(r.violations.some((v) => v.facet === 'method' && v.member === 'fly')).toBe(true);
  });
});

describe('harness · observeA11y', () => {
  it('construye una A11yObservation con axe y la evalúa', async () => {
    const obs = await observeA11y('hanko-probe-button', (el) => axe.run(el));
    const r = a11yCheck(obs);
    expect(r.tagName).toBe('hanko-probe-button');
    expect(r.checked).toContain('axe');
  });
});

describe('harness · observeResilience', () => {
  it('sobrevive a los escenarios adversos', async () => {
    const r = resilienceCheck(await observeResilience('hanko-probe-button'));
    expect(r.pass).toBe(true);
    expect(r.checked.length).toBeGreaterThan(0);
  });

  it('CAPTURA el throw ASÍNCRONO al montar un componente data-driven vacío', async () => {
    // items=undefined → el render async (como Lit) lanza en la microtask siguiente.
    // El harness espera `updateComplete`, así que el throw aflora DENTRO del trial
    // (un try/catch síncrono lo habría perdido → falso «sobrevivió»).
    const obs = await observeResilience('hanko-needs-data');
    const empty = obs.trials?.find((t) => t.scenario === 'empty');
    expect(empty?.survived).toBe(false);

    // Política del runner: los escenarios adversos (sin datos) son tolerables →
    // el crash es un WARNING, no descalifica el sello.
    const r = resilienceCheck(obs, { optional: [...ADVERSE_SCENARIOS] });
    expect(r.pass).toBe(true);
    expect(r.warnings.some((w) => w.scenario === 'empty')).toBe(true);
  });

  it('CAPTURA un crash que SOLO aflora a nivel window (no rechaza updateComplete)', async () => {
    // El throw va en un setTimeout y updateComplete resuelve limpio: el `await` del
    // harness no lo ve. Solo el listener de `window.error` por trial lo capta.
    const obs = await observeResilience('hanko-window-thrower');
    const empty = obs.trials?.find((t) => t.scenario === 'empty');
    expect(empty?.survived).toBe(false);
    expect(empty?.error).toContain('hanko-window-boom');

    // Escenario adverso (sin datos) → tolerable: warning, no descalifica el sello.
    const r = resilienceCheck(obs, { optional: [...ADVERSE_SCENARIOS] });
    expect(r.pass).toBe(true);
    expect(r.warnings.some((w) => w.scenario === 'empty')).toBe(true);
  });
});
