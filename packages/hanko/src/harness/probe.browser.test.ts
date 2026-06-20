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

beforeAll(() => {
  if (!customElements.get('hanko-probe-button')) {
    customElements.define('hanko-probe-button', HankoProbeButton);
  }
  if (!customElements.get('hanko-async-reflect')) {
    customElements.define('hanko-async-reflect', HankoAsyncReflect);
  }
  if (!customElements.get('hanko-needs-data')) {
    customElements.define('hanko-needs-data', HankoNeedsData);
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
});
