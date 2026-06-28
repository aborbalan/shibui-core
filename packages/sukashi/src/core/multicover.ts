import { makeBitmap, getPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement, type Block } from './patterns';
import { writeBlock, readBlock, type Layer } from './weave';
import { kasaneCoverWeave } from './cover';
import { kasaneMultiWeave } from './multiweave';
import { rngFrom, type Rng } from './rng';

// Un cover por capa: el halftone que el pivote y cada pétalo deben aparentar vistos solos.
// Cada cover mide 2× el motivo (resolución de capa).
export interface MultiCover {
  readonly pivot: Bitmap;
  readonly petals: readonly Bitmap[];
}

export interface MultiCoverWeaveOptions {
  /** Cover del pivote + un cover por motivo. Un único Bitmap se aplica a todas las capas. */
  readonly cover: Bitmap | MultiCover;
  /** Desempate determinista entre teselas igual de buenas (sistema por defecto). */
  readonly rng?: Rng;
  /** Umbral de contraste de revelado por emparejamiento (default 0.4). */
  readonly minContrast?: number;
  /** Umbral de fidelidad al cover por capa (default 0.5). */
  readonly minFidelity?: number;
  /** Si bajo umbral, cae a capas ruido (reveal garantizado, sin cover). Default false. */
  readonly fallback?: boolean;
  /**
   * Comparte un único pivote entre pétalos (hereda la fuga `motivo_i XOR motivo_j` de F5).
   * Default `false` → un pivote independiente por secreto, guiado igualmente por su cover.
   */
  readonly sharedPivot?: boolean;
}

export interface MultiCoverMetric {
  /** Contraste de revelado por emparejamiento (pivote_i + pétalo_i): densidad tinta − fondo. */
  readonly contrast: readonly number[];
  /** Fidelidad de los pivotes frente al cover de pivote (1 valor si compartido, N si independiente). */
  readonly pivotFidelity: readonly number[];
  /** Fidelidad de cada pétalo frente a su cover. */
  readonly petalFidelity: readonly number[];
  /** true si algún contraste o fidelidad cae por debajo de su umbral. */
  readonly belowThreshold: boolean;
  readonly warnings: readonly string[];
}

export interface MultiCoverWeaveResult {
  /** Un pivote por motivo. En modo compartido todas las posiciones son la misma capa. */
  readonly pivots: readonly Layer[];
  /** Un pétalo por motivo: `compose([pivots[i], petals[i]])` revela `motifs[i]`. */
  readonly petals: readonly Layer[];
  /** Conveniencia: `pivots[0]`. */
  readonly pivot: Layer;
  /** true si se compartió un único pivote (modo opt-in con fuga cruzada). */
  readonly sharedPivot: boolean;
  readonly metric: MultiCoverMetric;
  /** true si se devolvieron capas ruido por caer bajo umbral (`fallback`). */
  readonly fellBack: boolean;
}

function hamming(a: Block, b: Block): number {
  let d = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) d++;
  return d;
}

function inkCount(block: Block): number {
  return block[0] + block[1] + block[2] + block[3];
}

function subpixelMatch(layer: Layer, cover: Bitmap): number {
  const total = layer.data.length;
  if (total === 0) return 1;
  let match = 0;
  for (let i = 0; i < total; i++) {
    if ((layer.data[i] ?? 0) === (cover.data[i] ?? 0)) match++;
  }
  return match / total;
}

function resolveCovers(
  motifs: readonly Bitmap[],
  cover: Bitmap | MultiCover,
  lw: number,
  lh: number,
): { pivotCover: Bitmap; petalCovers: readonly Bitmap[] } {
  const single = !('pivot' in cover);
  const pivotCover = single ? (cover as Bitmap) : cover.pivot;
  const petalCovers = single ? motifs.map(() => cover as Bitmap) : cover.petals;
  if (!single && petalCovers.length !== motifs.length) {
    throw new Error('kasaneMultiCoverWeave: se requiere un cover por motivo');
  }
  for (const c of [pivotCover, ...petalCovers]) {
    if (c.width !== lw || c.height !== lh) {
      throw new Error('kasaneMultiCoverWeave: cada cover debe medir 2× el motivo');
    }
  }
  return { pivotCover, petalCovers };
}

// Generaliza `kasaneCoverWeave` (F4) al reparto multi-motivo de F5: cada capa va guiada por su cover
// decorativo. El revelado sigue siendo estructural por emparejamiento (fondo → misma tesela, tinta →
// complemento), así que `compose([pivots[i], petals[i]])` reproduce `motifs[i]` exactamente; lo que
// varía con los covers es la fidelidad de la textura.
//
// Por defecto cada secreto usa un pivote independiente (sin fuga cruzada). Con `sharedPivot: true`
// se reutiliza un pivote común, más compacto pero con la fuga `motivo_i XOR motivo_j`. Bajo umbral
// con `fallback` → capas ruido (reveal garantizado).
export function kasaneMultiCoverWeave(
  motifs: readonly Bitmap[],
  options: MultiCoverWeaveOptions,
): MultiCoverWeaveResult {
  const first = motifs[0];
  if (!first) throw new Error('kasaneMultiCoverWeave: se requiere al menos un motivo');
  const { width, height } = first;
  for (const m of motifs) {
    if (m.width !== width || m.height !== height) {
      throw new Error(
        `kasaneMultiCoverWeave: motivos no alineados (${m.width}×${m.height} vs ${width}×${height})`,
      );
    }
  }

  const lw = width * 2;
  const lh = height * 2;
  const { pivotCover, petalCovers } = resolveCovers(motifs, options.cover, lw, lh);
  const rng = options.rng ?? rngFrom();
  const shared = options.sharedPivot ?? false;

  let pivots: Layer[];
  const petals = motifs.map(() => makeBitmap(lw, lh));

  if (shared) {
    const pivot = makeBitmap(lw, lh);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const targetPivot = readBlock(pivotCover, x, y);
        const inks = motifs.map((m) => getPixel(m, x, y));
        const targetPetals = petalCovers.map((c) => readBlock(c, x, y));

        // Tesela del pivote que mejor satisface su cover y el de todos los pétalos a la vez.
        let best = Infinity;
        let bestPivot = Infinity;
        const winners: number[] = [];
        for (let ti = 0; ti < PATTERNS.length; ti++) {
          const t = PATTERNS[ti];
          if (!t) continue;
          const errPivot = hamming(t, targetPivot);
          let score = errPivot;
          for (let i = 0; i < motifs.length; i++) {
            score += hamming(inks[i] ? complement(t) : t, targetPetals[i]!);
          }
          if (score < best || (score === best && errPivot < bestPivot)) {
            best = score;
            bestPivot = errPivot;
            winners.length = 0;
            winners.push(ti);
          } else if (score === best && errPivot === bestPivot) {
            winners.push(ti);
          }
        }
        const choice = winners[rng.nextInt(winners.length)] ?? winners[0] ?? 0;
        const tile = PATTERNS[choice] ?? PATTERNS[0]!;
        writeBlock(pivot, x, y, tile);
        for (let i = 0; i < motifs.length; i++) {
          writeBlock(petals[i]!, x, y, inks[i] ? complement(tile) : tile);
        }
      }
    }
    pivots = motifs.map(() => pivot);
  } else {
    // Pivote independiente por secreto: cada par es un cover-weave de F4 propio (pivote guiado por
    // el cover de pivote, pétalo por el suyo), así que ningún subconjunto de capas filtra el XOR.
    pivots = [];
    for (let i = 0; i < motifs.length; i++) {
      const { layers } = kasaneCoverWeave(motifs[i]!, {
        cover: { a: pivotCover, b: petalCovers[i]! },
        rng,
        ...(options.minContrast !== undefined ? { minContrast: options.minContrast } : {}),
        ...(options.minFidelity !== undefined ? { minFidelity: options.minFidelity } : {}),
      });
      pivots.push(layers[0]);
      petals[i]!.data.set(layers[1].data);
    }
  }

  const metric = measure(motifs, pivots, petals, pivotCover, petalCovers, shared, options);

  if (metric.belowThreshold && options.fallback) {
    const noise = kasaneMultiWeave(motifs, { rng, sharedPivot: shared });
    const fbMetric = measure(
      motifs,
      noise.pivots,
      noise.petals,
      pivotCover,
      petalCovers,
      shared,
      options,
    );
    return {
      pivots: noise.pivots,
      petals: noise.petals,
      pivot: noise.pivots[0]!,
      sharedPivot: shared,
      metric: {
        ...fbMetric,
        warnings: [...fbMetric.warnings, 'fallback a capas ruido: el cover no alcanzaba el umbral'],
      },
      fellBack: true,
    };
  }

  return { pivots, petals, pivot: pivots[0]!, sharedPivot: shared, metric, fellBack: false };
}

function measure(
  motifs: readonly Bitmap[],
  pivots: readonly Layer[],
  petals: readonly Layer[],
  pivotCover: Bitmap,
  petalCovers: readonly Bitmap[],
  shared: boolean,
  options: MultiCoverWeaveOptions,
): MultiCoverMetric {
  const { width, height } = motifs[0]!;
  const minContrast = options.minContrast ?? 0.4;
  const minFidelity = options.minFidelity ?? 0.5;
  const warnings: string[] = [];

  // Contraste de revelado por emparejamiento: densidad media de la superposición (pivote_i+pétalo_i)
  // en celdas de tinta vs de fondo del motivo i.
  const contrast = motifs.map((motif, i) => {
    const pivot = pivots[i]!;
    const petal = petals[i]!;
    let inkSum = 0;
    let inkCells = 0;
    let bgSum = 0;
    let bgCells = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const bp = readBlock(pivot, x, y);
        const bl = readBlock(petal, x, y);
        const overlay: Block = [bp[0] | bl[0], bp[1] | bl[1], bp[2] | bl[2], bp[3] | bl[3]];
        const d = inkCount(overlay) / 4;
        if (getPixel(motif, x, y)) {
          inkSum += d;
          inkCells++;
        } else {
          bgSum += d;
          bgCells++;
        }
      }
    }
    const c = (inkCells ? inkSum / inkCells : 1) - (bgCells ? bgSum / bgCells : 0);
    if (c < minContrast) {
      warnings.push(`contraste del emparejamiento ${i} ${c.toFixed(2)} bajo el umbral ${minContrast}`);
    }
    return c;
  });

  // En modo compartido hay un único pivote; en independiente, uno por secreto.
  const uniquePivots = shared ? [pivots[0]!] : pivots;
  const pivotFidelity = uniquePivots.map((pivot, i) => {
    const f = subpixelMatch(pivot, pivotCover);
    if (f < minFidelity) {
      const who = shared ? 'pivote' : `pivote ${i}`;
      warnings.push(`fidelidad de cover del ${who} ${f.toFixed(2)} bajo el umbral ${minFidelity}`);
    }
    return f;
  });

  const petalFidelity = petals.map((petal, i) => {
    const f = subpixelMatch(petal, petalCovers[i]!);
    if (f < minFidelity) {
      warnings.push(`fidelidad de cover del pétalo ${i} ${f.toFixed(2)} bajo el umbral ${minFidelity}`);
    }
    return f;
  });

  return {
    contrast,
    pivotFidelity,
    petalFidelity,
    belowThreshold: warnings.length > 0,
    warnings,
  };
}
