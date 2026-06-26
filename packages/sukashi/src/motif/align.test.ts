import { describe, it, expect } from 'vitest';
import { makeBitmap } from '../core/bitmap';
import { alignPair, sameSize } from './align';

describe('alignPair', () => {
  it('devuelve el par cuando las dimensiones coinciden', () => {
    const a = makeBitmap(3, 3);
    const b = makeBitmap(3, 3);
    expect(alignPair(a, b)).toEqual([a, b]);
    expect(sameSize(a, b)).toBe(true);
  });

  it('lanza cuando las dimensiones difieren', () => {
    expect(() => alignPair(makeBitmap(3, 3), makeBitmap(3, 4))).toThrow();
    expect(sameSize(makeBitmap(2, 2), makeBitmap(2, 3))).toBe(false);
  });
});
