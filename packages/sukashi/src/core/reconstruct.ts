import { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';

// Reduce un overlay 2× a resolución de motivo: bloque de tinta plena (4/4) → tinta; 50% → fondo.
export function downsample(overlay: Bitmap): Bitmap {
  const width = Math.floor(overlay.width / 2);
  const height = Math.floor(overlay.height / 2);
  const out = makeBitmap(width, height);
  for (let by = 0; by < height; by++) {
    for (let bx = 0; bx < width; bx++) {
      const count =
        getPixel(overlay, bx * 2, by * 2) +
        getPixel(overlay, bx * 2 + 1, by * 2) +
        getPixel(overlay, bx * 2, by * 2 + 1) +
        getPixel(overlay, bx * 2 + 1, by * 2 + 1);
      setPixel(out, bx, by, count === 4 ? 1 : 0);
    }
  }
  return out;
}

// Fracción de píxeles del motivo que el overlay no reproduce (0 = perfecto).
export function reconstructError(overlay: Bitmap, motif: Bitmap): number {
  const recon = downsample(overlay);
  if (recon.width !== motif.width || recon.height !== motif.height) {
    throw new Error('reconstructError: dimensiones incompatibles');
  }
  if (motif.data.length === 0) return 0;
  let diff = 0;
  for (let i = 0; i < motif.data.length; i++) {
    if ((recon.data[i] ?? 0) !== (motif.data[i] ?? 0)) diff++;
  }
  return diff / motif.data.length;
}
