import { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement, type Block } from './patterns';
import { rngFrom, type Rng } from './rng';

// Una capa es un bitmap expandido 2× respecto al motivo.
export type Layer = Bitmap;

export interface WeaveOptions {
  /** Generador de aleatoriedad (sistema por defecto). */
  rng?: Rng;
}

function writeBlock(layer: Layer, bx: number, by: number, block: Block): void {
  setPixel(layer, bx * 2, by * 2, block[0]); // TL
  setPixel(layer, bx * 2 + 1, by * 2, block[1]); // TR
  setPixel(layer, bx * 2, by * 2 + 1, block[2]); // BL
  setPixel(layer, bx * 2 + 1, by * 2 + 1, block[3]); // BR
}

// Lee el bloque 2×2 que ocupa la posición (bx, by) en una capa.
export function readBlock(layer: Layer, bx: number, by: number): Block {
  return [
    getPixel(layer, bx * 2, by * 2),
    getPixel(layer, bx * 2 + 1, by * 2),
    getPixel(layer, bx * 2, by * 2 + 1),
    getPixel(layer, bx * 2 + 1, by * 2 + 1),
  ];
}

// Teje un motivo en 2 capas. Superpuestas reproducen el motivo; por separado, ruido uniforme.
// Píxel de fondo → ambas capas el mismo patrón (overlay 50%). Píxel de tinta → patrones
// complementarios (overlay 100%).
export function kasaneWeave(motif: Bitmap, options: WeaveOptions = {}): readonly [Layer, Layer] {
  const rng = options.rng ?? rngFrom();
  const { width, height } = motif;
  const a = makeBitmap(width * 2, height * 2);
  const b = makeBitmap(width * 2, height * 2);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const base = PATTERNS[rng.nextInt(PATTERNS.length)] ?? PATTERNS[0]!;
      writeBlock(a, x, y, base);
      writeBlock(b, x, y, getPixel(motif, x, y) ? complement(base) : base);
    }
  }
  return [a, b];
}
