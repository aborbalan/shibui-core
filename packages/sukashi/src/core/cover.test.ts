import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel, type Bitmap } from './bitmap';
import { kasaneCoverWeave } from './cover';
import { kasaneWeave } from './weave';
import { compose } from './compose';
import { reconstructError } from './reconstruct';
import { seeded } from './rng';
import { seigaiha } from '../pattern/seigaiha';

// Motivo de ejemplo: un rombo centrado (~25% tinta) sobre lienzo cuadrado.
function diamond(n: number): Bitmap {
  const m = makeBitmap(n, n);
  const c = (n - 1) / 2;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (Math.abs(x - c) + Math.abs(y - c) < n * 0.35) setPixel(m, x, y, 1);
    }
  }
  return m;
}

function fidelityVs(layer: Bitmap, cover: Bitmap): number {
  let match = 0;
  for (let i = 0; i < layer.data.length; i++) if (layer.data[i] === cover.data[i]) match++;
  return match / layer.data.length;
}

describe('kasaneCoverWeave — capas con cover', () => {
  const N = 24;
  const motif = diamond(N);
  const cover = seigaiha({ width: N * 2, height: N * 2, scale: 10 });

  it('la superposición sigue revelando el motivo exactamente', () => {
    const { layers } = kasaneCoverWeave(motif, { cover, rng: seeded(7) });
    expect(reconstructError(compose(layers), motif)).toBe(0);
  });

  it('el contraste de revelado es estructural (≈ 0.5)', () => {
    const { metric } = kasaneCoverWeave(motif, { cover, rng: seeded(7) });
    expect(metric.contrast).toBeCloseTo(0.5, 5);
  });

  it('la capa A se parece al cover mucho más que un weave aleatorio', () => {
    const { layers, metric } = kasaneCoverWeave(motif, { cover, rng: seeded(7) });
    const [randomA] = kasaneWeave(motif, { rng: seeded(7) });
    const randomFid = fidelityVs(randomA, cover);
    expect(metric.fidelity[0]).toBeGreaterThan(0.65);
    expect(metric.fidelity[0]).toBeGreaterThan(randomFid + 0.1);
    expect(fidelityVs(layers[0], cover)).toBeCloseTo(metric.fidelity[0], 5);
  });

  it('en una buena cobertura no marca aviso de umbral', () => {
    const { metric } = kasaneCoverWeave(motif, { cover, rng: seeded(7) });
    expect(metric.belowThreshold).toBe(false);
    expect(metric.warnings).toHaveLength(0);
  });

  it('marca aviso cuando el umbral de contraste es inalcanzable', () => {
    const { metric } = kasaneCoverWeave(motif, { cover, rng: seeded(7), minContrast: 0.9 });
    expect(metric.belowThreshold).toBe(true);
    expect(metric.warnings.length).toBeGreaterThan(0);
  });

  it('acepta covers distintos por capa', () => {
    const a = seigaiha({ width: N * 2, height: N * 2, scale: 10, seed: 0 });
    const b = seigaiha({ width: N * 2, height: N * 2, scale: 14, seed: 2 });
    const { layers } = kasaneCoverWeave(motif, { cover: { a, b }, rng: seeded(1) });
    expect(reconstructError(compose(layers), motif)).toBe(0);
  });

  it('rechaza un cover que no mide 2× el motivo', () => {
    const bad = seigaiha({ width: N, height: N });
    expect(() => kasaneCoverWeave(motif, { cover: bad })).toThrow(/2×/);
  });
});
