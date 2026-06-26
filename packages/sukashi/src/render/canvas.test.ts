import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel } from '../core/bitmap';
import { toRGBA } from './canvas';

describe('toRGBA', () => {
  it('tinta opaca en celdas con valor 1, fondo transparente en 0', () => {
    const layer = makeBitmap(2, 1);
    setPixel(layer, 0, 0, 1);
    const rgba = toRGBA(layer);
    expect([rgba[0], rgba[1], rgba[2], rgba[3]]).toEqual([0, 0, 0, 255]);
    expect(rgba[7]).toBe(0); // alpha del segundo píxel (fondo)
  });

  it('respeta el tamaño de celda', () => {
    const layer = makeBitmap(1, 1);
    setPixel(layer, 0, 0, 1);
    const rgba = toRGBA(layer, { cell: 3 });
    expect(rgba.length).toBe(3 * 3 * 4);
  });
});
