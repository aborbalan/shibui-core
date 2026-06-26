import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel } from './bitmap';
import { kasaneWeave, readBlock } from './weave';
import { compose } from './compose';
import { reconstructError } from './reconstruct';
import { seeded } from './rng';

describe('kasaneWeave + compose', () => {
  it('compose(weave(motif)) reproduce el motivo sin error', () => {
    const m = makeBitmap(4, 4);
    setPixel(m, 1, 1, 1);
    setPixel(m, 2, 1, 1);
    setPixel(m, 0, 3, 1);
    const [a, b] = kasaneWeave(m, { rng: seeded(42) });
    expect(a.width).toBe(8);
    expect(a.height).toBe(8);
    const overlay = compose([a, b]);
    expect(reconstructError(overlay, m)).toBe(0);
  });

  it('cada bloque de cada capa tiene exactamente 2 celdas de tinta', () => {
    const m = makeBitmap(3, 3);
    setPixel(m, 1, 1, 1);
    setPixel(m, 2, 0, 1);
    const [a, b] = kasaneWeave(m, { rng: seeded(7) });
    for (const layer of [a, b]) {
      for (let by = 0; by < 3; by++) {
        for (let bx = 0; bx < 3; bx++) {
          const block = readBlock(layer, bx, by);
          expect(block[0] + block[1] + block[2] + block[3]).toBe(2);
        }
      }
    }
  });

  it('es reproducible con la misma semilla', () => {
    const m = makeBitmap(5, 5);
    setPixel(m, 2, 2, 1);
    const [a1] = kasaneWeave(m, { rng: seeded(99) });
    const [a2] = kasaneWeave(m, { rng: seeded(99) });
    expect(Array.from(a1.data)).toEqual(Array.from(a2.data));
  });
});
