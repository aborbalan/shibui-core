import { describe, it, expect } from 'vitest';
import { makeBitmap, getPixel, setPixel } from './bitmap';

describe('bitmap', () => {
  it('crea un bitmap de ceros y permite set/get', () => {
    const b = makeBitmap(3, 2);
    expect(b.width).toBe(3);
    expect(b.height).toBe(2);
    expect(b.data.length).toBe(6);
    setPixel(b, 1, 1, 1);
    expect(getPixel(b, 1, 1)).toBe(1);
    expect(getPixel(b, 0, 0)).toBe(0);
  });

  it('normaliza cualquier valor truthy a 1 y falsy a 0', () => {
    const b = makeBitmap(2, 2);
    setPixel(b, 0, 0, 5);
    setPixel(b, 1, 1, 0);
    expect(getPixel(b, 0, 0)).toBe(1);
    expect(getPixel(b, 1, 1)).toBe(0);
  });

  it('rechaza dimensiones no positivas', () => {
    expect(() => makeBitmap(0, 4)).toThrow();
    expect(() => makeBitmap(4, -1)).toThrow();
  });
});
