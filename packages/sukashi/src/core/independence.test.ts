import { describe, it, expect } from 'vitest';
import { makeBitmap } from './bitmap';
import { kasaneWeave, readBlock } from './weave';
import { patternIndex } from './patterns';
import { seeded } from './rng';

// χ² contra la distribución uniforme (6 categorías, 5 grados de libertad).
function chiSquareUniform(counts: readonly number[]): number {
  const total = counts.reduce((acc, c) => acc + c, 0);
  if (total === 0) return 0;
  const expected = total / counts.length;
  let chi = 0;
  for (const c of counts) chi += (c - expected) ** 2 / expected;
  return chi;
}

describe('independencia de una sola capa', () => {
  // Una capa aislada no debe correlacionar con el motivo: la distribución de sus patrones
  // debe ser uniforme tanto donde el motivo es fondo como donde es tinta.
  it('la distribución de patrones de una capa no depende del motivo (χ² bajo)', () => {
    const size = 64;
    const m = makeBitmap(size, size);
    const motifRng = seeded(12345);
    for (let i = 0; i < m.data.length; i++) m.data[i] = motifRng.nextInt(2);

    const [, b] = kasaneWeave(m, { rng: seeded(999) });

    const byFondo = new Array<number>(6).fill(0);
    const byTinta = new Array<number>(6).fill(0);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = patternIndex(readBlock(b, x, y));
        if (idx < 0) continue;
        const row = (m.data[y * size + x] ?? 0) ? byTinta : byFondo;
        row[idx] = (row[idx] ?? 0) + 1;
      }
    }

    // Crítico χ²(5 gl, p=0.001) ≈ 20.5; margen holgado en 30 (semilla fija → determinista).
    expect(chiSquareUniform(byFondo)).toBeLessThan(30);
    expect(chiSquareUniform(byTinta)).toBeLessThan(30);
  });
});
