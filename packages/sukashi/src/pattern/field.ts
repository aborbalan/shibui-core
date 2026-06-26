// Andamiaje común de los generadores de patrón decorativo.
// Un patrón se define como un *campo* continuo de densidad y se convierte a bitmap
// binario por trama ordenada (halftone) — determinista y teselable.

import { makeBitmap, setPixel, type Bitmap } from '../core/bitmap';

// Densidad de tinta deseada en una celda, en [0,1]. 1 = tinta plena, 0 = fondo.
export type PatternField = (x: number, y: number) => number;

export interface PatternOptions {
  readonly width: number;
  readonly height: number;
  /** Tamaño del módulo del patrón en celdas (mayor = motivo más grande). Default 12. */
  readonly scale?: number;
  /** Varía el patrón de forma determinista (fase/rotación). Default 0. */
  readonly seed?: number;
}

export type PatternGenerator = (options: PatternOptions) => Bitmap;

// Matriz Bayer 4×4 normalizada a (0,1): umbral ordenado, sin semilla, teselable.
const BAYER4: readonly number[] = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(
  (v) => (v + 0.5) / 16,
);

export function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Trama ordenada: la densidad local de tinta aproxima el campo → textura de semitono.
export function halftone(field: PatternField, width: number, height: number): Bitmap {
  const bmp = makeBitmap(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = clamp01(field(x, y));
      const t = BAYER4[(y & 3) * 4 + (x & 3)] ?? 0.5;
      setPixel(bmp, x, y, v > t ? 1 : 0);
    }
  }
  return bmp;
}
