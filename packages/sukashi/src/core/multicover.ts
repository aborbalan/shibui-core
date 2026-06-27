import { makeBitmap, getPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement, type Block } from './patterns';
import { writeBlock, readBlock, type Layer } from './weave';
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
}

export interface MultiCoverMetric {
  /** Contraste de revelado por emparejamiento (pivote + pétalo i): densidad tinta − fondo. */
  readonly contrast: readonly number[];
  /** Fidelidad de cada capa frente a su cover, en orden [pivote, ...pétalos]. */
  readonly fidelity: readonly number[];
  /** true si algún contraste o fidelidad cae por debajo de su umbral. */
  readonly belowThreshold: boolean;
  readonly warnings: readonly string[];
}

export interface MultiCoverWeaveResult {
  /** Capa pivote, compartida por todos los emparejamientos. */
  readonly pivot: Layer;
  /** Un pétalo por motivo: `compose([pivot, petals[i]])` revela `motifs[i]`. */
  readonly petals: readonly Layer[];
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

// Generaliza `kasaneCoverWeave` (F4) al reparto multi-motivo de `kasaneMultiWeave` (F5): un
// pivote compartido + un pétalo por motivo, cada capa guiada por su cover decorativo. El revelado
// sigue siendo estructural por emparejamiento (fondo → misma tesela, tinta → complemento), así que
// `compose([pivot, petals[i]])` reproduce `motifs[i]` exactamente; lo que varía con los covers es la
// fidelidad de la textura. Bajo umbral con `fallback` → capas ruido (reveal garantizado).
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
  const single = !('pivot' in options.cover);
  const pivotCover = single ? (options.cover as Bitmap) : options.cover.pivot;
  const petalCovers = single
    ? motifs.map(() => options.cover as Bitmap)
    : options.cover.petals;
  if (!single && petalCovers.length !== motifs.length) {
    throw new Error('kasaneMultiCoverWeave: se requiere un cover por motivo');
  }
  for (const c of [pivotCover, ...petalCovers]) {
    if (c.width !== lw || c.height !== lh) {
      throw new Error('kasaneMultiCoverWeave: cada cover debe medir 2× el motivo');
    }
  }

  const rng = options.rng ?? rngFrom();
  const pivot = makeBitmap(lw, lh);
  const petals = motifs.map(() => makeBitmap(lw, lh));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const targetPivot = readBlock(pivotCover, x, y);
      const inks = motifs.map((m) => getPixel(m, x, y));
      const targetPetals = petalCovers.map((c) => readBlock(c, x, y));

      // Elegir la tesela del pivote que mejor satisface su cover y el de todos los pétalos a la
      // vez (cada pétalo queda fijado por el motivo: misma tesela en fondo, complemento en tinta).
      // Empates: preferir el ajuste del pivote; el resto se desempata con rng (sin sesgo posicional).
      let best = Infinity;
      let bestPivot = Infinity;
      const winners: number[] = [];
      for (let ti = 0; ti < PATTERNS.length; ti++) {
        const t = PATTERNS[ti];
        if (!t) continue;
        const errPivot = hamming(t, targetPivot);
        let score = errPivot;
        for (let i = 0; i < motifs.length; i++) {
          const eff = inks[i] ? complement(t) : t;
          score += hamming(eff, targetPetals[i]!);
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

  const metric = measure(motifs, pivot, petals, pivotCover, petalCovers, options);

  if (metric.belowThreshold && options.fallback) {
    const noise = kasaneMultiWeave(motifs, { rng });
    const fbMetric = measure(motifs, noise.pivot, noise.petals, pivotCover, petalCovers, options);
    return {
      pivot: noise.pivot,
      petals: noise.petals,
      metric: {
        ...fbMetric,
        warnings: [...fbMetric.warnings, 'fallback a capas ruido: el cover no alcanzaba el umbral'],
      },
      fellBack: true,
    };
  }

  return { pivot, petals, metric, fellBack: false };
}

function measure(
  motifs: readonly Bitmap[],
  pivot: Layer,
  petals: readonly Layer[],
  pivotCover: Bitmap,
  petalCovers: readonly Bitmap[],
  options: MultiCoverWeaveOptions,
): MultiCoverMetric {
  const { width, height } = motifs[0]!;
  const minContrast = options.minContrast ?? 0.4;
  const minFidelity = options.minFidelity ?? 0.5;
  const warnings: string[] = [];

  // Contraste de revelado por emparejamiento: densidad media de la superposición (pivote+pétalo i)
  // en celdas de tinta vs de fondo del motivo i.
  const contrast = motifs.map((motif, i) => {
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

  const fidelity = [pivot, ...petals].map((layer, j) => {
    const cover = j === 0 ? pivotCover : petalCovers[j - 1]!;
    const f = subpixelMatch(layer, cover);
    if (f < minFidelity) {
      const who = j === 0 ? 'pivote' : `pétalo ${j - 1}`;
      warnings.push(`fidelidad de cover del ${who} ${f.toFixed(2)} bajo el umbral ${minFidelity}`);
    }
    return f;
  });

  return { contrast, fidelity, belowThreshold: warnings.length > 0, warnings };
}
