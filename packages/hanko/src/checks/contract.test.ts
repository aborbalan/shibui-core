import { describe, it, expect } from 'vitest';
import { contractCheck } from './contract';
import type { ComponentContract } from '../core/contract';
import type { ComponentRuntime } from '../core/runtime';

const declared = (over: Partial<ComponentContract> = {}): ComponentContract => ({
  tagName: 'lib-button',
  modulePath: 'm.ts',
  source: { kind: 'cem' },
  ...over,
});

const observed = (over: Partial<ComponentRuntime> = {}): ComponentRuntime => ({
  tagName: 'lib-button',
  registered: true,
  ...over,
});

describe('contractCheck · registrabilidad (Floor runtime)', () => {
  it('falla si el elemento no está registrado y omite el resto', () => {
    const r = contractCheck(declared(), observed({ registered: false }));
    expect(r.pass).toBe(false);
    expect(r.violations).toHaveLength(1);
    expect(r.violations[0]!.facet).toBe('registration');
    expect(r.checked.registration).toBe(true);
  });

  it('falla si la observación corresponde a otro tagName', () => {
    const r = contractCheck(declared(), observed({ tagName: 'lib-card' }));
    expect(r.pass).toBe(false);
    expect(r.violations[0]!.facet).toBe('registration');
  });
});

describe('contractCheck · propiedades declaradas ↔ runtime', () => {
  const comp = declared({
    properties: [
      { property: 'variant', reflects: false, type: { raw: 'string', kind: 'string' } },
      { property: 'disabled', reflects: false, type: { raw: 'boolean', kind: 'boolean' } },
    ],
  });

  it('pasa cuando todas las props declaradas existen en el elemento', () => {
    const r = contractCheck(comp, observed({ properties: ['variant', 'disabled'] }));
    expect(r.pass).toBe(true);
    expect(r.checked.properties).toBe(2);
  });

  it('viola por cada prop declarada ausente en el elemento', () => {
    const r = contractCheck(comp, observed({ properties: ['variant'] }));
    expect(r.pass).toBe(false);
    const v = r.violations.find((x) => x.facet === 'property')!;
    expect(v.member).toBe('disabled');
  });

  it('omite (no falla) cuando el runtime no observó propiedades', () => {
    const r = contractCheck(comp, observed({}));
    expect(r.pass).toBe(true);
    expect(r.skipped.some((s) => s.startsWith('properties'))).toBe(true);
  });
});

describe('contractCheck · regla de oro (ausencia ≠ incumplimiento)', () => {
  it('no verifica facetas que el manifest no declara', () => {
    const r = contractCheck(declared(), observed({ properties: ['x'], methods: ['y'] }));
    expect(r.pass).toBe(true);
    expect(r.checked.properties).toBe(0);
    expect(r.checked.methods).toBe(0);
    expect(r.skipped.join(' ')).toContain('no declara propiedades');
  });
});

describe('contractCheck · atributos y reflect', () => {
  const comp = declared({
    properties: [
      {
        property: 'variant',
        attribute: 'variant',
        reflects: true,
        type: { raw: 'string', kind: 'string' },
      },
    ],
  });

  it('viola si el atributo declarado no está en observedAttributes', () => {
    const r = contractCheck(comp, observed({ properties: ['variant'], observedAttributes: [] }));
    expect(r.violations.some((v) => v.facet === 'attribute')).toBe(true);
  });

  it('viola si reflects:true no se cumple en runtime', () => {
    const r = contractCheck(
      comp,
      observed({
        properties: ['variant'],
        observedAttributes: ['variant'],
        reflectingProperties: [],
      }),
    );
    expect(r.violations.some((v) => v.facet === 'reflect')).toBe(true);
  });

  it('omite reflect si el harness no lo probó', () => {
    const r = contractCheck(
      comp,
      observed({ properties: ['variant'], observedAttributes: ['variant'] }),
    );
    expect(r.violations.some((v) => v.facet === 'reflect')).toBe(false);
    expect(r.skipped.some((s) => s.startsWith('reflect'))).toBe(true);
  });
});

describe('contractCheck · métodos', () => {
  const comp = declared({ methods: [{ name: 'focus' }, { name: 'reset' }] });

  it('pasa cuando los métodos declarados existen', () => {
    const r = contractCheck(comp, observed({ methods: ['focus', 'reset'] }));
    expect(r.pass).toBe(true);
    expect(r.checked.methods).toBe(2);
  });

  it('viola por método declarado ausente en el elemento', () => {
    const r = contractCheck(comp, observed({ methods: ['focus'] }));
    const v = r.violations.find((x) => x.facet === 'method')!;
    expect(v.member).toBe('reset');
  });
});

describe('contractCheck · nivel strict (completitud)', () => {
  const comp = declared({
    properties: [{ property: 'variant', reflects: false, type: { raw: 'string', kind: 'string' } }],
  });

  it('conformance ignora props de runtime no declaradas', () => {
    const r = contractCheck(comp, observed({ properties: ['variant', 'secreto'] }));
    expect(r.pass).toBe(true);
  });

  it('strict marca como violación la API pública no declarada', () => {
    const r = contractCheck(comp, observed({ properties: ['variant', 'secreto'] }), {
      level: 'strict',
    });
    expect(r.pass).toBe(false);
    expect(r.level).toBe('strict');
    const v = r.violations.find((x) => x.member === 'secreto')!;
    expect(v.facet).toBe('property');
  });
});
