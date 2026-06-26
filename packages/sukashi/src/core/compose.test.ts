import { describe, it, expect } from 'vitest';
import { makeBitmap, getPixel, setPixel } from './bitmap';
import { compose } from './compose';

describe('compose', () => {
  it('superpone capas con OR por píxel', () => {
    const a = makeBitmap(2, 2);
    const b = makeBitmap(2, 2);
    setPixel(a, 0, 0, 1);
    setPixel(b, 0, 0, 1);
    setPixel(b, 1, 1, 1);
    const out = compose([a, b]);
    expect(getPixel(out, 0, 0)).toBe(1);
    expect(getPixel(out, 1, 1)).toBe(1);
    expect(getPixel(out, 1, 0)).toBe(0);
  });

  it('lanza si las capas difieren en dimensiones', () => {
    expect(() => compose([makeBitmap(2, 2), makeBitmap(3, 2)])).toThrow();
  });

  it('lanza si no se pasa ninguna capa', () => {
    expect(() => compose([])).toThrow();
  });
});
