import { getPixel, type Bitmap } from '../core/bitmap';

export type Rgba = readonly [number, number, number, number];

export interface RasterOptions {
  /** Tamaño de celda en px (default 1). */
  cell?: number;
  /** Color de tinta RGBA (default negro opaco). */
  ink?: Rgba;
  /** Color de fondo RGBA (default transparente). */
  background?: Rgba;
}

// Capa → buffer RGBA (base de la exportación a PNG/Canvas). Puro, testeable en Node.
export function toRGBA(layer: Bitmap, options: RasterOptions = {}): Uint8ClampedArray {
  const cell = options.cell ?? 1;
  const ink: Rgba = options.ink ?? [0, 0, 0, 255];
  const background: Rgba = options.background ?? [0, 0, 0, 0];
  const w = layer.width * cell;
  const h = layer.height * cell;
  const out = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const on = getPixel(layer, Math.floor(x / cell), Math.floor(y / cell));
      const px = on ? ink : background;
      const o = (y * w + x) * 4;
      out[o] = px[0];
      out[o + 1] = px[1];
      out[o + 2] = px[2];
      out[o + 3] = px[3];
    }
  }
  return out;
}

// Pinta una capa sobre un contexto 2D (navegador). Envoltorio fino sobre toRGBA.
export function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Bitmap,
  options: RasterOptions = {},
): void {
  const cell = options.cell ?? 1;
  const rgba = toRGBA(layer, options);
  const image = new ImageData(layer.width * cell, layer.height * cell);
  image.data.set(rgba);
  ctx.putImageData(image, 0, 0);
}
