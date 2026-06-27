import { makeBitmap, getPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement } from './patterns';
import { rngFrom, type Rng } from './rng';
import { writeBlock, type Layer } from './weave';

export interface MultiWeaveOptions {
  /** Generador de aleatoriedad (sistema por defecto). */
  rng?: Rng;
}

export interface MultiWeaveResult {
  /** Capa pivote, compartida por todos los emparejamientos. */
  readonly pivot: Layer;
  /** Una capa-pétalo por motivo: `compose([pivot, petals[i]])` revela `motifs[i]`. */
  readonly petals: readonly Layer[];
}

// Teje varios motivos contra una sola capa pivote. Cada pétalo, emparejado con el pivote,
// revela su motivo; otros emparejamientos no. Vista sola, cada capa es ruido uniforme
// (independencia: el bloque del pivote es base aleatoria; cada pétalo es base o su
// complemento según su motivo, y el conjunto base es cerrado bajo complemento → uniforme).
//
// Es la generalización de `kasaneWeave`: un pivote + N pétalos en lugar de 2 capas con 1 motivo.
export function kasaneMultiWeave(
  motifs: readonly Bitmap[],
  options: MultiWeaveOptions = {},
): MultiWeaveResult {
  const first = motifs[0];
  if (!first) throw new Error('kasaneMultiWeave: se requiere al menos un motivo');
  const { width, height } = first;
  for (const m of motifs) {
    if (m.width !== width || m.height !== height) {
      throw new Error(
        `kasaneMultiWeave: motivos no alineados (${m.width}×${m.height} vs ${width}×${height})`,
      );
    }
  }

  const rng = options.rng ?? rngFrom();
  const pivot = makeBitmap(width * 2, height * 2);
  const petals = motifs.map(() => makeBitmap(width * 2, height * 2));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const base = PATTERNS[rng.nextInt(PATTERNS.length)] ?? PATTERNS[0]!;
      const comp = complement(base);
      writeBlock(pivot, x, y, base);
      for (let i = 0; i < motifs.length; i++) {
        const motif = motifs[i]!;
        writeBlock(petals[i]!, x, y, getPixel(motif, x, y) ? comp : base);
      }
    }
  }

  return { pivot, petals };
}
