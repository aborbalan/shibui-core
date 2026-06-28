import { describe, it, expect } from 'vitest';
import { framesFrozen, entropyEstimate, healthCheck } from './health';

// Genera un fotograma seudoaleatorio determinista (sin tocar la entropía del sistema).
function noisyFrame(seed: number, n = 256): Uint8Array {
  const out = new Uint8Array(n);
  let a = seed >>> 0;
  for (let i = 0; i < n; i++) {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    out[i] = (t ^ (t >>> 14)) & 0xff;
  }
  return out;
}

describe('framesFrozen', () => {
  it('fotogramas idénticos consecutivos → congelado', () => {
    const f = noisyFrame(1);
    expect(framesFrozen([f, new Uint8Array(f)])).toBe(true);
  });

  it('fotogramas distintos → no congelado', () => {
    expect(framesFrozen([noisyFrame(1), noisyFrame(2), noisyFrame(3)])).toBe(false);
  });

  it('menos de 2 fotogramas → congelado (sin movimiento que medir)', () => {
    expect(framesFrozen([noisyFrame(1)])).toBe(true);
    expect(framesFrozen([])).toBe(true);
  });
});

describe('entropyEstimate', () => {
  it('constante → 0 bits/byte', () => {
    expect(entropyEstimate(new Uint8Array(256).fill(7))).toBe(0);
  });

  it('ruido → alta (> 7 bits/byte)', () => {
    expect(entropyEstimate(noisyFrame(42, 4096))).toBeGreaterThan(7);
  });

  it('buffer vacío → 0', () => {
    expect(entropyEstimate(new Uint8Array(0))).toBe(0);
  });
});

describe('healthCheck', () => {
  it('cielo vivo y rico → ok', () => {
    const r = healthCheck([noisyFrame(1), noisyFrame(2), noisyFrame(3)]);
    expect(r.ok).toBe(true);
    expect(r.entropy).toBeGreaterThan(4);
  });

  it('imagen congelada → falla', () => {
    const f = noisyFrame(5);
    const r = healthCheck([f, new Uint8Array(f)]);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe('imagen congelada');
  });

  it('entropía baja (cielo plano) → falla', () => {
    // fotogramas distintos (no congelados) pero casi planos
    const a = new Uint8Array(256).fill(10);
    a[0] = 11;
    const b = new Uint8Array(256).fill(10);
    b[1] = 12;
    const r = healthCheck([a, b]);
    expect(r.ok).toBe(false);
    expect(r.reason).toContain('entropía baja');
  });

  it('sin fotogramas → falla', () => {
    expect(healthCheck([]).ok).toBe(false);
  });
});
