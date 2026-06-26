import { describe, it, expect } from 'vitest';
import { makeBitmap, setPixel } from '../core/bitmap';
import { toSVG } from './svg';

describe('toSVG', () => {
  it('emite un <rect> por celda de tinta y nada para el fondo', () => {
    const layer = makeBitmap(2, 2);
    setPixel(layer, 0, 0, 1);
    setPixel(layer, 1, 1, 1);
    const svg = toSVG(layer, { cell: 10 });
    expect(svg.startsWith('<svg')).toBe(true);
    expect((svg.match(/<rect/g) ?? []).length).toBe(2);
    expect(svg).toContain('width="20"');
  });

  it('incluye marcas de registro cuando se piden', () => {
    const layer = makeBitmap(4, 4);
    expect(toSVG(layer)).not.toContain('<path');
    expect(toSVG(layer, { registration: true })).toContain('<path');
  });
});
