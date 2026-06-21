import { describe, it, expect } from 'vitest';
import { a11yCheck } from './a11y';
import type { A11yObservation } from './a11y';

const obs = (over: Partial<A11yObservation> = {}): A11yObservation => ({
  tagName: 'lib-button',
  ...over,
});

describe('a11yCheck · axe', () => {
  it('falla por una violación serious con el umbral por defecto', () => {
    const r = a11yCheck(obs({ axeViolations: [{ id: 'color-contrast', impact: 'serious' }] }));
    expect(r.pass).toBe(false);
    expect(r.violations.some((v) => v.rule === 'color-contrast')).toBe(true);
    expect(r.checked).toContain('axe');
  });

  it('clasifica como warning (no fallo) lo que está bajo el umbral', () => {
    const r = a11yCheck(obs({ axeViolations: [{ id: 'landmark', impact: 'minor' }] }));
    expect(r.pass).toBe(true);
    expect(r.warnings).toHaveLength(1);
    expect(r.violations).toHaveLength(0);
  });

  it('failOn más estricto convierte moderate en violación', () => {
    const r = a11yCheck(obs({ axeViolations: [{ id: 'region', impact: 'moderate' }] }), {
      failOn: 'moderate',
    });
    expect(r.pass).toBe(false);
  });

  it('omite axe (sin fallar) si no se ejecutó sobre el elemento', () => {
    const r = a11yCheck(obs({ interactive: false }));
    expect(r.pass).toBe(true);
    expect(r.checked).not.toContain('axe');
    expect(r.skipped.some((s) => s.startsWith('axe'))).toBe(true);
  });
});

describe('a11yCheck · teclado / foco / nombre (solo interactivos)', () => {
  it('pasa un elemento interactivo accesible', () => {
    const r = a11yCheck(
      obs({
        axeViolations: [],
        interactive: true,
        keyboardReachable: true,
        focusVisible: true,
        hasAccessibleName: true,
      }),
    );
    expect(r.pass).toBe(true);
    expect(r.checked).toEqual(expect.arrayContaining(['axe', 'keyboard', 'focus', 'name']));
  });

  it('viola si un interactivo no es alcanzable por teclado', () => {
    const r = a11yCheck(
      obs({ interactive: true, keyboardReachable: false, focusVisible: true, hasAccessibleName: true }),
    );
    expect(r.pass).toBe(false);
    expect(r.violations.some((v) => v.rule === 'keyboard')).toBe(true);
  });

  it('viola si un interactivo carece de nombre accesible (sin señal de aportabilidad)', () => {
    const r = a11yCheck(
      obs({ interactive: true, keyboardReachable: true, focusVisible: true, hasAccessibleName: false }),
    );
    expect(r.violations.some((v) => v.rule === 'name')).toBe(true);
  });

  it('omite name (no viola) si el nombre es aportable por el consumidor', () => {
    // calibración C: montado vacío no tiene nombre, pero el consumidor puede
    // aportarlo (slot por defecto / prop de etiqueta) → no es defecto, se omite.
    const r = a11yCheck(
      obs({
        interactive: true,
        keyboardReachable: true,
        hasAccessibleName: false,
        nameSupplyable: true,
      }),
    );
    expect(r.pass).toBe(true);
    expect(r.violations.some((v) => v.rule === 'name')).toBe(false);
    expect(r.checked).not.toContain('name');
    expect(r.skipped.some((s) => s.startsWith('name') && s.includes('aportable'))).toBe(true);
  });

  it('SÍ viola si no hay nombre y NO es aportable (señal real)', () => {
    const r = a11yCheck(
      obs({
        interactive: true,
        keyboardReachable: true,
        hasAccessibleName: false,
        nameSupplyable: false,
      }),
    );
    expect(r.pass).toBe(false);
    expect(r.violations.some((v) => v.rule === 'name')).toBe(true);
    expect(r.checked).toContain('name');
  });

  it('omite teclado/foco/nombre en elementos no interactivos', () => {
    const r = a11yCheck(obs({ axeViolations: [], interactive: false }));
    expect(r.pass).toBe(true);
    expect(r.skipped.join(' ')).toContain('no interactivo');
  });

  it('omite si la interactividad no se observó', () => {
    const r = a11yCheck(obs({ axeViolations: [] }));
    expect(r.skipped.join(' ')).toContain('interactividad no observada');
  });

  it('omite, sin fallar, los checks interactivos no probados', () => {
    const r = a11yCheck(obs({ axeViolations: [], interactive: true }));
    expect(r.pass).toBe(true);
    expect(r.skipped.some((s) => s.startsWith('keyboard'))).toBe(true);
    expect(r.skipped.some((s) => s.startsWith('focus'))).toBe(true);
    expect(r.skipped.some((s) => s.startsWith('name'))).toBe(true);
  });
});
