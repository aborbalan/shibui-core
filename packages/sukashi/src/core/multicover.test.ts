import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel, type Bitmap } from './bitmap';
import { kasaneMultiCoverWeave } from './multicover';
import { compose } from './compose';
import { reconstructError } from './reconstruct';
import { seeded } from './rng';
import { seigaiha } from '../pattern/seigaiha';
import { asanoha } from '../pattern/asanoha';

// Motivo de ejemplo: un rombo centrado sobre lienzo cuadrado.
function diamond(n: number, t = 0.35): Bitmap {
  const m = makeBitmap(n, n);
  const c = (n - 1) / 2;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (Math.abs(x - c) + Math.abs(y - c) < n * t) setPixel(m, x, y, 1);
    }
  }
  return m;
}

function fidelityVs(layer: Bitmap, cover: Bitmap): number {
  let match = 0;
  for (let i = 0; i < layer.data.length; i++) if (layer.data[i] === cover.data[i]) match++;
  return match / layer.data.length;
}

describe('kasaneMultiCoverWeave — multi-motivo con cover (F6)', () => {
  const N = 24;
  const m1 = diamond(N, 0.3);
  const m2 = diamond(N, 0.5);
  const cover = seigaiha({ width: N * 2, height: N * 2, scale: 10 });

  it('cada emparejamiento (pivote + pétalo) revela su motivo sin error', () => {
    const { pivot, petals } = kasaneMultiCoverWeave([m1, m2], { cover, rng: seeded(7) });
    expect(petals).toHaveLength(2);
    expect(reconstructError(compose([pivot, petals[0]!]), m1)).toBe(0);
    expect(reconstructError(compose([pivot, petals[1]!]), m2)).toBe(0);
  });

  it('el contraste de revelado es estructural (≈ 0.5) en cada par', () => {
    const { metric } = kasaneMultiCoverWeave([m1, m2], { cover, rng: seeded(7) });
    expect(metric.contrast).toHaveLength(2);
    for (const c of metric.contrast) expect(c).toBeCloseTo(0.5, 5);
  });

  it('cada capa se parece a su cover (fidelidad expuesta y coherente)', () => {
    const a = seigaiha({ width: N * 2, height: N * 2, scale: 10, seed: 0 });
    const b = asanoha({ width: N * 2, height: N * 2, scale: 12, seed: 1 });
    const c = seigaiha({ width: N * 2, height: N * 2, scale: 14, seed: 2 });
    const { pivot, petals, metric } = kasaneMultiCoverWeave([m1, m2], {
      cover: { pivot: a, petals: [b, c] },
      rng: seeded(3),
    });
    expect(metric.fidelity).toHaveLength(3);
    expect(metric.fidelity[0]).toBeGreaterThan(0.6);
    expect(fidelityVs(pivot, a)).toBeCloseTo(metric.fidelity[0]!, 5);
    expect(fidelityVs(petals[0]!, b)).toBeCloseTo(metric.fidelity[1]!, 5);
    expect(fidelityVs(petals[1]!, c)).toBeCloseTo(metric.fidelity[2]!, 5);
  });

  it('en buena cobertura no marca aviso ni cae a ruido', () => {
    const { metric, fellBack } = kasaneMultiCoverWeave([m1, m2], { cover, rng: seeded(7) });
    expect(metric.belowThreshold).toBe(false);
    expect(metric.warnings).toHaveLength(0);
    expect(fellBack).toBe(false);
  });

  it('fallback: bajo umbral inalcanzable devuelve capas ruido con aviso y reveal intacto', () => {
    const { pivot, petals, metric, fellBack } = kasaneMultiCoverWeave([m1, m2], {
      cover,
      rng: seeded(7),
      minFidelity: 0.99, // inalcanzable → fuerza fallback
      fallback: true,
    });
    expect(fellBack).toBe(true);
    expect(metric.warnings.some((w) => /fallback/.test(w))).toBe(true);
    // El fallback conserva el revelado exacto de ambos motivos.
    expect(reconstructError(compose([pivot, petals[0]!]), m1)).toBe(0);
    expect(reconstructError(compose([pivot, petals[1]!]), m2)).toBe(0);
  });

  it('sin fallback solo avisa (no cambia las capas) cuando cae bajo umbral', () => {
    const { metric, fellBack } = kasaneMultiCoverWeave([m1, m2], {
      cover,
      rng: seeded(7),
      minFidelity: 0.99,
    });
    expect(fellBack).toBe(false);
    expect(metric.belowThreshold).toBe(true);
    expect(metric.warnings.length).toBeGreaterThan(0);
  });

  it('rechaza covers mal dimensionados, conteo erróneo y lista vacía', () => {
    const bad = seigaiha({ width: N, height: N });
    expect(() => kasaneMultiCoverWeave([m1, m2], { cover: bad })).toThrow(/2×/);
    const ok2 = seigaiha({ width: N * 2, height: N * 2 });
    expect(() =>
      kasaneMultiCoverWeave([m1, m2], { cover: { pivot: ok2, petals: [ok2] } }),
    ).toThrow(/un cover por motivo/);
    expect(() => kasaneMultiCoverWeave([], { cover })).toThrow(/al menos un motivo/);
  });
});
