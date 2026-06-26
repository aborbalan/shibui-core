import { makeBitmap, setPixel, type Bitmap } from '../core/bitmap';

// Fuente en escala de gris: un byte de cobertura por celda (0..255), mayor = más tinta.
export interface GraySource {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array; // row-major, longitud width*height
}

// Buffer RGBA (p. ej. getImageData del navegador o la salida de toRGBA).
export interface RgbaSource {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8ClampedArray | Uint8Array; // RGBA, longitud width*height*4
}

export type CoverageChannel = 'alpha' | 'luma';

export interface RasterizeOptions {
  /** Umbral de binarización 0..255 (default 128): cobertura >= umbral → tinta. */
  threshold?: number;
  /** Invierte el criterio (tinta donde cobertura < umbral). */
  invert?: boolean;
  /** Difuminado de error para fuentes no binarias (default 'none'). */
  dither?: 'none' | 'floyd-steinberg';
}

function assertGraySource(src: GraySource): void {
  if (src.width <= 0 || src.height <= 0) {
    throw new Error('rasterize: las dimensiones deben ser > 0');
  }
  if (src.data.length !== src.width * src.height) {
    throw new Error('rasterize: data no coincide con width*height');
  }
}

// Fuente en escala de gris → Bitmap binario, por umbral simple o difuminado de error.
export function rasterize(source: GraySource, options: RasterizeOptions = {}): Bitmap {
  assertGraySource(source);
  const threshold = options.threshold ?? 128;
  const invert = options.invert ?? false;
  const dither = options.dither ?? 'none';
  if (dither === 'floyd-steinberg') {
    return ditherFloydSteinberg(source, threshold, invert);
  }
  const { width, height } = source;
  const out = makeBitmap(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = source.data[y * width + x] ?? 0;
      const ink = invert ? v < threshold : v >= threshold;
      setPixel(out, x, y, ink ? 1 : 0);
    }
  }
  return out;
}

// Difuminado Floyd–Steinberg: binariza preservando el tono medio (entrada no binaria).
function ditherFloydSteinberg(source: GraySource, threshold: number, invert: boolean): Bitmap {
  const { width, height } = source;
  const out = makeBitmap(width, height);
  const buf = new Float32Array(width * height);
  for (let i = 0; i < buf.length; i++) buf[i] = source.data[i] ?? 0;
  const spread = (x: number, y: number, err: number, weight: number): void => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const i = y * width + x;
    buf[i] = (buf[i] ?? 0) + err * weight;
  };
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const old = buf[y * width + x] ?? 0;
      const on = old >= threshold;
      const err = old - (on ? 255 : 0);
      setPixel(out, x, y, (invert ? !on : on) ? 1 : 0);
      spread(x + 1, y, err, 7 / 16);
      spread(x - 1, y + 1, err, 3 / 16);
      spread(x, y + 1, err, 5 / 16);
      spread(x + 1, y + 1, err, 1 / 16);
    }
  }
  return out;
}

// Puente puro: RGBA → GraySource de cobertura. 'alpha' usa la opacidad; 'luma' usa la
// luminosidad invertida (oscuro = más tinta). Testeable en Node, sin DOM.
export function coverageFromRGBA(src: RgbaSource, channel: CoverageChannel = 'alpha'): GraySource {
  if (src.width <= 0 || src.height <= 0) {
    throw new Error('coverageFromRGBA: las dimensiones deben ser > 0');
  }
  if (src.data.length !== src.width * src.height * 4) {
    throw new Error('coverageFromRGBA: data no coincide con width*height*4');
  }
  const data = new Uint8Array(src.width * src.height);
  for (let i = 0; i < data.length; i++) {
    const o = i * 4;
    if (channel === 'alpha') {
      data[i] = src.data[o + 3] ?? 0;
    } else {
      const r = src.data[o] ?? 0;
      const g = src.data[o + 1] ?? 0;
      const b = src.data[o + 2] ?? 0;
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = 255 - Math.round(luma);
    }
  }
  return { width: src.width, height: src.height, data };
}
