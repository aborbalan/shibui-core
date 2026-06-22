import { describe, it, expect } from 'vitest';
import { resilienceCheck } from './resilience';
import type { ResilienceObservation } from './resilience';

const obs = (over: Partial<ResilienceObservation> = {}): ResilienceObservation => ({
  tagName: 'lib-button',
  ...over,
});

describe('resilienceCheck', () => {
  it('pasa cuando todos los escenarios sobreviven', () => {
    const r = resilienceCheck(
      obs({
        trials: [
          { scenario: 'empty', survived: true },
          { scenario: 'junk-attrs', survived: true },
          { scenario: 'rtl', survived: true },
        ],
      }),
    );
    expect(r.pass).toBe(true);
    expect(r.checked).toEqual(['empty', 'junk-attrs', 'rtl']);
    expect(r.violations).toHaveLength(0);
  });

  it('viola por cada escenario obligatorio que se rompe', () => {
    const r = resilienceCheck(
      obs({
        trials: [
          { scenario: 'empty', survived: true },
          { scenario: 'junk-attrs', survived: false, error: 'TypeError: cannot read x' },
        ],
      }),
    );
    expect(r.pass).toBe(false);
    const v = r.violations.find((x) => x.scenario === 'junk-attrs')!;
    expect(v.message).toContain('TypeError');
  });

  it('degrada a warning (no fallo) los escenarios opcionales que se rompen', () => {
    const r = resilienceCheck(
      obs({ trials: [{ scenario: 'ssr', survived: false }] }),
      { optional: ['ssr'] },
    );
    expect(r.pass).toBe(true);
    expect(r.warnings.some((w) => w.scenario === 'ssr')).toBe(true);
    expect(r.violations).toHaveLength(0);
  });

  it('omite (no falla) cuando el harness no probó resiliencia', () => {
    const r = resilienceCheck(obs({}));
    expect(r.pass).toBe(true);
    expect(r.checked).toHaveLength(0);
    expect(r.skipped.join(' ')).toContain('no ejecutó');
  });

  it('omite cuando la lista de intentos está vacía', () => {
    const r = resilienceCheck(obs({ trials: [] }));
    expect(r.pass).toBe(true);
    expect(r.skipped).toHaveLength(1);
  });

  it('usa un mensaje por defecto cuando el intento no trae error', () => {
    const r = resilienceCheck(obs({ trials: [{ scenario: 'remount', survived: false }] }));
    const v = r.violations.find((x) => x.scenario === 'remount')!;
    expect(v.message).toContain('remount');
  });

  it('política del runner (5.1): `remount` viola aunque empty/junk/rtl sean tolerables', () => {
    // Espejo del cableado de run.ts: optional = data-dependent; `remount` queda fuera
    // → su fallo descalifica el sello mientras el crash de `empty` solo avisa.
    const r = resilienceCheck(
      obs({
        trials: [
          { scenario: 'empty', survived: false, error: 'sin datos' },
          { scenario: 'remount', survived: false, error: 'estado no reinicializado' },
        ],
      }),
      { optional: ['empty', 'junk-attrs', 'rtl'] },
    );
    expect(r.pass).toBe(false);
    expect(r.violations.some((v) => v.scenario === 'remount')).toBe(true);
    expect(r.warnings.some((w) => w.scenario === 'empty')).toBe(true);
  });
});
