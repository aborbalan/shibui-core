import type { Bitmap } from '../core/bitmap';

export function sameSize(a: Bitmap, b: Bitmap): boolean {
  return a.width === b.width && a.height === b.height;
}

// El núcleo solo recibe pares alineados: rechaza dimensiones distintas en el borde.
export function alignPair(a: Bitmap, b: Bitmap): readonly [Bitmap, Bitmap] {
  if (!sameSize(a, b)) {
    throw new Error(
      `alignPair: dimensiones no alineadas (${a.width}×${a.height} vs ${b.width}×${b.height})`,
    );
  }
  return [a, b];
}
