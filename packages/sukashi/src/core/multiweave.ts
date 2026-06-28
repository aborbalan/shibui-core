import { makeBitmap, getPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement } from './patterns';
import { rngFrom, type Rng } from './rng';
import { writeBlock, type Layer } from './weave';

export interface MultiWeaveOptions {
  /** Generador de aleatoriedad (sistema por defecto). */
  rng?: Rng;
  /**
   * Comparte una única capa pivote entre todos los pétalos. Ahorra capas, pero **filtra**
   * `motivo_i XOR motivo_j` a quien posea dos pétalos (reutilización de one-time-pad): es
   * imposible evitarlo con pivote compartido. Default `false` → un pivote **independiente** por
   * secreto, sin fuga cruzada (reparto k-de-2 estricto por motivo).
   */
  sharedPivot?: boolean;
}

export interface MultiWeaveResult {
  /** Un pivote por motivo. En modo compartido todas las posiciones son la **misma** capa. */
  readonly pivots: readonly Layer[];
  /** Un pétalo por motivo: `compose([pivots[i], petals[i]])` revela `motifs[i]`. */
  readonly petals: readonly Layer[];
  /** Conveniencia: `pivots[0]` (en modo compartido, el pivote común). */
  readonly pivot: Layer;
  /** true si se compartió un único pivote (modo opt-in con fuga cruzada). */
  readonly sharedPivot: boolean;
}

function checkAligned(motifs: readonly Bitmap[]): { width: number; height: number } {
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
  return { width, height };
}

// Teje varios motivos en capas reveladas por superposición. Cada pétalo, emparejado con su pivote,
// revela su motivo. Vista sola, cada capa es ruido uniforme (independencia marginal: el conjunto
// base de patrones es cerrado bajo complemento).
//
// Por defecto cada secreto usa un **pivote independiente**, así que ni siquiera el conjunto de todos
// los pétalos filtra nada de ningún motivo. Con `sharedPivot: true` se reutiliza un pivote común
// (más compacto, pero dos pétalos revelan el XOR de sus motivos).
export function kasaneMultiWeave(
  motifs: readonly Bitmap[],
  options: MultiWeaveOptions = {},
): MultiWeaveResult {
  const { width, height } = checkAligned(motifs);
  const rng = options.rng ?? rngFrom();
  const shared = options.sharedPivot ?? false;
  const lw = width * 2;
  const lh = height * 2;
  const petals = motifs.map(() => makeBitmap(lw, lh));

  let pivots: Layer[];
  if (shared) {
    // Un pivote común: una base aleatoria por celda, reutilizada por todos los pétalos.
    const pivot = makeBitmap(lw, lh);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const base = PATTERNS[rng.nextInt(PATTERNS.length)] ?? PATTERNS[0]!;
        const comp = complement(base);
        writeBlock(pivot, x, y, base);
        for (let i = 0; i < motifs.length; i++) {
          writeBlock(petals[i]!, x, y, getPixel(motifs[i]!, x, y) ? comp : base);
        }
      }
    }
    pivots = motifs.map(() => pivot);
  } else {
    // Pivote independiente por secreto: cada par (pivots[i], petals[i]) es un reparto k-de-2 propio,
    // con su propia base aleatoria → los pétalos son conjuntamente independientes de los motivos.
    pivots = motifs.map(() => makeBitmap(lw, lh));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        for (let i = 0; i < motifs.length; i++) {
          const base = PATTERNS[rng.nextInt(PATTERNS.length)] ?? PATTERNS[0]!;
          writeBlock(pivots[i]!, x, y, base);
          writeBlock(petals[i]!, x, y, getPixel(motifs[i]!, x, y) ? complement(base) : base);
        }
      }
    }
  }

  return { pivots, petals, pivot: pivots[0]!, sharedPivot: shared };
}
