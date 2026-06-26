import { describe, it, expect } from 'vitest';
import { rasterize, coverageFromRGBA, type GraySource } from './rasterize';
import { getPixel } from '../core/bitmap';
import { kasaneWeave } from '../core/weave';
import { compose } from '../core/compose';
import { reconstructError } from '../core/reconstruct';
import { seeded } from '../core/rng';

function gray(width: number, height: number, values: readonly number[]): GraySource {
  return { width, height, data: Uint8Array.from(values) };
}

describe('rasterize', () => {
  it('binariza por umbral (>= threshold → tinta)', () => {
    const bmp = rasterize(gray(2, 2, [0, 200, 130, 50]), { threshold: 128 });
    expect(getPixel(bmp, 0, 0)).toBe(0);
    expect(getPixel(bmp, 1, 0)).toBe(1);
    expect(getPixel(bmp, 0, 1)).toBe(1);
    expect(getPixel(bmp, 1, 1)).toBe(0);
  });

  it('invert voltea el criterio', () => {
    const bmp = rasterize(gray(1, 2, [200, 50]), { threshold: 128, invert: true });
    expect(getPixel(bmp, 0, 0)).toBe(0);
    expect(getPixel(bmp, 0, 1)).toBe(1);
  });

  it('rechaza fuente vacía o con data inconsistente', () => {
    expect(() => rasterize({ width: 0, height: 2, data: new Uint8Array(0) })).toThrow();
    expect(() => rasterize({ width: 2, height: 2, data: new Uint8Array(3) })).toThrow();
  });

  it('un motivo rasterizado se compone y reconstruye sin error', () => {
    // glifo sintético 4×4 (cobertura 0/255)
    const px = [
      0, 255, 255, 0,
      255, 0, 0, 255,
      255, 255, 255, 255,
      255, 0, 0, 255,
    ];
    const motif = rasterize(gray(4, 4, px), { threshold: 128 });
    const [a, b] = kasaneWeave(motif, { rng: seeded(3) });
    expect(reconstructError(compose([a, b]), motif)).toBe(0);
  });

  it('floyd-steinberg binariza preservando la densidad media (~50% en gris medio)', () => {
    const n = 16;
    const src = gray(n, n, new Array<number>(n * n).fill(128));
    const bmp = rasterize(src, { threshold: 128, dither: 'floyd-steinberg' });
    let ink = 0;
    for (let i = 0; i < bmp.data.length; i++) ink += bmp.data[i] ?? 0;
    const ratio = ink / (n * n);
    expect(ratio).toBeGreaterThan(0.3);
    expect(ratio).toBeLessThan(0.7);
  });
});

describe('coverageFromRGBA', () => {
  it('canal alpha → cobertura por opacidad', () => {
    const rgba = Uint8Array.from([0, 0, 0, 255, 0, 0, 0, 0]); // opaco, transparente
    const cov = coverageFromRGBA({ width: 2, height: 1, data: rgba }, 'alpha');
    expect(Array.from(cov.data)).toEqual([255, 0]);
  });

  it('canal luma → oscuro = más cobertura', () => {
    const rgba = Uint8Array.from([0, 0, 0, 255, 255, 255, 255, 255]); // negro, blanco
    const cov = coverageFromRGBA({ width: 2, height: 1, data: rgba }, 'luma');
    expect(cov.data[0]).toBe(255);
    expect(cov.data[1]).toBe(0);
  });

  it('rechaza data RGBA inconsistente', () => {
    expect(() => coverageFromRGBA({ width: 2, height: 1, data: new Uint8Array(7) })).toThrow();
  });
});
