import { describe, it, expect, beforeAll } from 'vitest';
import * as axe from 'axe-core';
import { observeRuntime, observeA11y, observeResilience } from './probe';
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

beforeAll(() => {
  if (!customElements.get('hanko-probe-button')) {
    customElements.define('hanko-probe-button', HankoProbeButton);
  }
});

describe('harness · observeRuntime', () => {
  it('refleja la API pública del elemento vivo', () => {
    const rt = observeRuntime('hanko-probe-button');
    expect(rt.registered).toBe(true);
    expect(rt.properties).toEqual(expect.arrayContaining(['variant', 'disabled']));
    expect(rt.methods).toEqual(expect.arrayContaining(['reset']));
    expect(rt.observedAttributes).toEqual(['variant', 'disabled']);
  });

  it('observa los slots del shadow DOM (named + por defecto)', () => {
    const rt = observeRuntime('hanko-probe-button');
    expect(rt.slots).toEqual(expect.arrayContaining(['icon', '']));
  });

  it('alimenta contractCheck sin violaciones para un contrato fiel', () => {
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
    const r = contractCheck(declared, observeRuntime('hanko-probe-button'));
    expect(r.violations).toHaveLength(0);
    expect(r.checked.slots).toBe(2);
  });

  it('detecta un slot declarado que el elemento no expone', () => {
    const declared: ComponentContract = {
      tagName: 'hanko-probe-button',
      modulePath: 'm',
      source: { kind: 'cem' },
      slots: [{ name: 'icon' }, { name: 'footer' }],
    };
    const r = contractCheck(declared, observeRuntime('hanko-probe-button'));
    expect(r.violations.some((v) => v.facet === 'slot' && v.member === 'footer')).toBe(true);
    expect(r.violations.some((v) => v.facet === 'slot' && v.member === 'icon')).toBe(false);
  });

  it('detecta un método declarado que el elemento no tiene', () => {
    const declared: ComponentContract = {
      tagName: 'hanko-probe-button',
      modulePath: 'm',
      source: { kind: 'cem' },
      methods: [{ name: 'fly' }],
    };
    const r = contractCheck(declared, observeRuntime('hanko-probe-button'));
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
  it('sobrevive a los escenarios adversos', () => {
    const r = resilienceCheck(observeResilience('hanko-probe-button'));
    expect(r.pass).toBe(true);
    expect(r.checked.length).toBeGreaterThan(0);
  });
});
