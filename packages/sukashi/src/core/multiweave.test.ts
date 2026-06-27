import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel } from './bitmap';
import { kasaneMultiWeave } from './multiweave';
import { readBlock } from './weave';
import { patternIndex } from './patterns';
import { compose } from './compose';
import { reconstructError } from './reconstruct';
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

describe('kasaneMultiWeave — weaves multi-motivo', () => {
  it('cada emparejamiento (pivote + pétalo) reproduce su motivo sin error', () => {
    const m1 = makeBitmap(4, 4);
    setPixel(m1, 1, 1, 1);
    setPixel(m1, 2, 1, 1);
    setPixel(m1, 0, 3, 1);

    const m2 = makeBitmap(4, 4);
    setPixel(m2, 0, 0, 1);
    setPixel(m2, 3, 3, 1);
    setPixel(m2, 2, 2, 1);

    const { pivot, petals } = kasaneMultiWeave([m1, m2], { rng: seeded(42) });

    expect(pivot.width).toBe(8);
    expect(pivot.height).toBe(8);
    expect(petals).toHaveLength(2);
    expect(reconstructError(compose([pivot, petals[0]!]), m1)).toBe(0);
    expect(reconstructError(compose([pivot, petals[1]!]), m2)).toBe(0);
  });

  it('un emparejamiento no revela el motivo del otro (motivos distintos)', () => {
    const m1 = makeBitmap(4, 4);
    setPixel(m1, 1, 1, 1);
    const m2 = makeBitmap(4, 4);
    setPixel(m2, 3, 0, 1);

    const { pivot, petals } = kasaneMultiWeave([m1, m2], { rng: seeded(7) });

    // pivote + pétalo cruzado no debe reconstruir el motivo del otro pétalo.
    expect(reconstructError(compose([pivot, petals[1]!]), m1)).toBeGreaterThan(0);
    expect(reconstructError(compose([pivot, petals[0]!]), m2)).toBeGreaterThan(0);
  });

  it('cada bloque de pivote y pétalos tiene exactamente 2 celdas de tinta', () => {
    const m1 = makeBitmap(3, 3);
    setPixel(m1, 1, 1, 1);
    const m2 = makeBitmap(3, 3);
    setPixel(m2, 2, 0, 1);

    const { pivot, petals } = kasaneMultiWeave([m1, m2], { rng: seeded(99) });

    for (const layer of [pivot, ...petals]) {
      for (let by = 0; by < 3; by++) {
        for (let bx = 0; bx < 3; bx++) {
          const block = readBlock(layer, bx, by);
          expect(block[0] + block[1] + block[2] + block[3]).toBe(2);
        }
      }
    }
  });

  it('es reproducible con la misma semilla', () => {
    const m1 = makeBitmap(5, 5);
    setPixel(m1, 2, 2, 1);
    const m2 = makeBitmap(5, 5);
    setPixel(m2, 0, 4, 1);

    const a = kasaneMultiWeave([m1, m2], { rng: seeded(123) });
    const b = kasaneMultiWeave([m1, m2], { rng: seeded(123) });

    expect(Array.from(a.pivot.data)).toEqual(Array.from(b.pivot.data));
    expect(Array.from(a.petals[0]!.data)).toEqual(Array.from(b.petals[0]!.data));
    expect(Array.from(a.petals[1]!.data)).toEqual(Array.from(b.petals[1]!.data));
  });

  it('rechaza motivos no alineados y la lista vacía', () => {
    const m1 = makeBitmap(4, 4);
    const m2 = makeBitmap(5, 4);
    expect(() => kasaneMultiWeave([m1, m2])).toThrow(/no alineados/);
    expect(() => kasaneMultiWeave([])).toThrow(/al menos un motivo/);
  });

  it('independencia: las tres capas son uniformes con independencia del motivo (χ² bajo)', () => {
    const size = 64;
    const m1 = makeBitmap(size, size);
    const m2 = makeBitmap(size, size);
    const motifRng = seeded(2024);
    for (let i = 0; i < m1.data.length; i++) m1.data[i] = motifRng.nextInt(2);
    for (let i = 0; i < m2.data.length; i++) m2.data[i] = motifRng.nextInt(2);

    const { pivot, petals } = kasaneMultiWeave([m1, m2], { rng: seeded(555) });

    // Para cada capa, la distribución de patrones debe ser uniforme tanto donde su
    // motivo de referencia es fondo como donde es tinta. El pivote se contrasta contra m1.
    const checks: ReadonlyArray<readonly [typeof pivot, typeof m1]> = [
      [pivot, m1],
      [petals[0]!, m1],
      [petals[1]!, m2],
    ];

    for (const [layer, motif] of checks) {
      const byFondo = new Array<number>(6).fill(0);
      const byTinta = new Array<number>(6).fill(0);
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const idx = patternIndex(readBlock(layer, x, y));
          if (idx < 0) continue;
          const row = (motif.data[y * size + x] ?? 0) ? byTinta : byFondo;
          row[idx] = (row[idx] ?? 0) + 1;
        }
      }
      // Crítico χ²(5 gl, p=0.001) ≈ 20.5; margen holgado en 30 (semilla fija → determinista).
      expect(chiSquareUniform(byFondo)).toBeLessThan(30);
      expect(chiSquareUniform(byTinta)).toBeLessThan(30);
    }
  });
});
