import { describe, it, expect } from 'vitest';
import { mixSeed, openSky, type SkyCapture } from './sky';
import type { SeedSource } from '../core/seed';
import { rngFrom } from '../core/rng';
import { makeBitmap } from '../core/bitmap';
import { kasaneWeave } from '../core/weave';
import { compose } from '../core/compose';
import { reconstructError } from '../core/reconstruct';
import { seeded } from '../core/rng';

// SeedSource determinista (no toca la entropía del sistema): cicla un patrón fijo.
function fixedSeed(pattern: readonly number[]): SeedSource {
  let cursor = 0;
  return {
    bytes(n: number): Uint8Array {
      const out = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        out[i] = pattern[cursor % pattern.length] ?? 0;
        cursor = (cursor + 1) % pattern.length;
      }
      return out;
    },
  };
}

// Fotograma seudoaleatorio determinista (cielo "rico" para tests).
function noisyFrame(seed: number, n = 512): Uint8Array {
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

function captureOf(frames: readonly Uint8Array[]): SkyCapture {
  return { frames: () => Promise.resolve(frames) };
}

describe('mixSeed', () => {
  it('XOR del pool sobre la salida del sistema (mezcla, no reemplaza)', () => {
    const system = fixedSeed([0xaa]);
    const pool = new Uint8Array([0x0f, 0xf0]);
    const out = mixSeed(system, pool).bytes(4);
    // 0xaa ^ 0x0f = 0xa5 ; 0xaa ^ 0xf0 = 0x5a ; cicla
    expect([...out]).toEqual([0xa5, 0x5a, 0xa5, 0x5a]);
  });

  it('pool vacío → devuelve el sistema intacto (nunca degrada)', () => {
    const system = fixedSeed([1, 2, 3]);
    const mixed = mixSeed(system, new Uint8Array(0));
    expect(mixed).toBe(system);
  });

  it('pool de ceros → salida idéntica al sistema (XOR 0 = identidad, no degrada)', () => {
    const a = fixedSeed([5, 6, 7, 8]).bytes(8);
    const b = mixSeed(fixedSeed([5, 6, 7, 8]), new Uint8Array(8)).bytes(8);
    expect([...a]).toEqual([...b]);
  });

  it('entrega exactamente n bytes aunque el pool sea más corto', () => {
    const out = mixSeed(fixedSeed([0]), new Uint8Array([1, 2])).bytes(10);
    expect(out.length).toBe(10);
  });
});

describe('openSky', () => {
  it('cielo vivo y rico → usa el cielo y mezcla', async () => {
    const r = await openSky(captureOf([noisyFrame(1), noisyFrame(2), noisyFrame(3)]), {
      system: fixedSeed([0]),
    });
    expect(r.usedSky).toBe(true);
    expect(r.entropy).toBeGreaterThan(4);
    // con system=0x00, la salida mezclada es el propio pool (≠ todo ceros)
    const out = r.source.bytes(16);
    expect([...out].some((b) => b !== 0)).toBe(true);
  });

  it('cámara falla → fallback a la semilla del sistema', async () => {
    const system = fixedSeed([3, 1, 4]);
    const capture: SkyCapture = { frames: () => Promise.reject(new Error('sin cámara')) };
    const r = await openSky(capture, { system });
    expect(r.usedSky).toBe(false);
    expect(r.reason).toContain('captura falló');
    expect(r.source).toBe(system); // misma fuente, sin tocar
  });

  it('imagen congelada → fallback', async () => {
    const f = noisyFrame(9);
    const r = await openSky(captureOf([f, new Uint8Array(f)]), { system: fixedSeed([0]) });
    expect(r.usedSky).toBe(false);
    expect(r.reason).toBe('imagen congelada');
  });

  it('entropía baja → fallback', async () => {
    const a = new Uint8Array(256).fill(10);
    a[0] = 11;
    const b = new Uint8Array(256).fill(10);
    b[1] = 12;
    const r = await openSky(captureOf([a, b]), { system: fixedSeed([0]) });
    expect(r.usedSky).toBe(false);
    expect(r.reason).toContain('entropía baja');
  });
});

describe('weave funciona idéntico con cualquiera de las dos semillas', () => {
  it('el reveal sigue siendo exacto (error 0) sembrando del cielo', async () => {
    const size = 24;
    const motif = makeBitmap(size, size);
    const mr = seeded(7);
    for (let i = 0; i < motif.data.length; i++) motif.data[i] = mr.nextInt(2);

    const sky = await openSky(captureOf([noisyFrame(11), noisyFrame(22), noisyFrame(33)]));
    expect(sky.usedSky).toBe(true);

    const layers = kasaneWeave(motif, { rng: rngFrom(sky.source) });
    expect(reconstructError(compose(layers), motif)).toBe(0);
  });
});
