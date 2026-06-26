// Bitmap binario: matriz de celdas row-major. 1 = tinta (motivo), 0 = fondo.

export interface Bitmap {
  readonly width: number;
  readonly height: number;
  readonly data: Uint8Array;
}

export function makeBitmap(width: number, height: number): Bitmap {
  if (width <= 0 || height <= 0) {
    throw new Error('makeBitmap: width y height deben ser > 0');
  }
  return { width, height, data: new Uint8Array(width * height) };
}

export function getPixel(b: Bitmap, x: number, y: number): number {
  return b.data[y * b.width + x] ?? 0;
}

export function setPixel(b: Bitmap, x: number, y: number, value: number): void {
  b.data[y * b.width + x] = value ? 1 : 0;
}
