import { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';
import type { Layer } from './weave';

// Superposición de capas = OR por píxel (análogo a mix-blend-mode: multiply sobre tinta).
export function compose(layers: readonly Layer[]): Bitmap {
  const first = layers[0];
  if (!first) throw new Error('compose: se requiere al menos una capa');
  const { width, height } = first;
  for (const l of layers) {
    if (l.width !== width || l.height !== height) {
      throw new Error('compose: todas las capas deben compartir dimensiones');
    }
  }
  const out = makeBitmap(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let on = 0;
      for (const l of layers) {
        if (getPixel(l, x, y)) {
          on = 1;
          break;
        }
      }
      setPixel(out, x, y, on);
    }
  }
  return out;
}
