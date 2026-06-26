import { makeBitmap, getPixel, setPixel, type Bitmap } from './bitmap';
import { PATTERNS, complement, type Block } from './patterns';
import { readBlock, type Layer } from './weave';
import { rngFrom, type Rng } from './rng';

// Un cover por capa (o el mismo para ambas). Cada cover es un bitmap a resolución de capa
// (2× el motivo): el halftone que esa capa debe parecer cuando se mira sola.
export interface CoverPair {
  readonly a: Bitmap;
  readonly b: Bitmap;
}

export interface CoverWeaveOptions {
  /** Halftone(s) que cada capa debe aparentar. Un único bitmap se aplica a ambas capas. */
  readonly cover: Bitmap | CoverPair;
  /** Desempate determinista entre teselas igual de buenas (sistema por defecto). */
  readonly rng?: Rng;
  /** Umbral de contraste de revelado (default 0.4). */
  readonly minContrast?: number;
  /** Umbral de fidelidad al cover (default 0.5). */
  readonly minFidelity?: number;
}

export interface CoverMetric {
  /** Contraste del motivo en la superposición: densidad(tinta) − densidad(fondo), en [0,1]. */
  readonly contrast: number;
  /** Fracción de subpíxeles de cada capa que coinciden con su cover, en [0,1]. */
  readonly fidelity: readonly [number, number];
  /** true si el contraste o alguna fidelidad cae por debajo de su umbral. */
  readonly belowThreshold: boolean;
  readonly warnings: readonly string[];
}

export interface CoverWeaveResult {
  readonly layers: readonly [Layer, Layer];
  readonly metric: CoverMetric;
}

function writeBlock(layer: Layer, bx: number, by: number, block: Block): void {
  setPixel(layer, bx * 2, by * 2, block[0]);
  setPixel(layer, bx * 2 + 1, by * 2, block[1]);
  setPixel(layer, bx * 2, by * 2 + 1, block[2]);
  setPixel(layer, bx * 2 + 1, by * 2 + 1, block[3]);
}

function hamming(a: Block, b: Block): number {
  let d = 0;
  for (let i = 0; i < 4; i++) if (a[i] !== b[i]) d++;
  return d;
}

function inkCount(block: Block): number {
  return block[0] + block[1] + block[2] + block[3];
}

// Teje un motivo en 2 capas guiadas por covers: cada capa, vista sola, aproxima su halftone
// decorativo (no ruido). El revelado se mantiene estructural — una celda de tinta usa siempre
// teselas complementarias (overlay 100%); una de fondo, la misma tesela (overlay 50%).
export function kasaneCoverWeave(motif: Bitmap, options: CoverWeaveOptions): CoverWeaveResult {
  const rng = options.rng ?? rngFrom();
  const { width, height } = motif;
  const lw = width * 2;
  const lh = height * 2;

  const coverA = 'a' in options.cover ? options.cover.a : options.cover;
  const coverB = 'a' in options.cover ? options.cover.b : options.cover;
  for (const c of [coverA, coverB]) {
    if (c.width !== lw || c.height !== lh) {
      throw new Error('kasaneCoverWeave: cada cover debe medir 2× el motivo');
    }
  }

  const a = makeBitmap(lw, lh);
  const b = makeBitmap(lw, lh);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ink = getPixel(motif, x, y);
      const targetA = readBlock(coverA, x, y);
      const targetB = readBlock(coverB, x, y);

      // Elegir la tesela base que mejor satisface AMBOS covers a la vez. La capa B queda
      // determinada (misma tesela en fondo, complemento en tinta), así que su error frente
      // a coverB también pesa en la decisión. Empates: preferir el mejor ajuste de la capa A
      // —así A sigue su cover incluso bajo el motivo y el sesgo de revelado se concentra en
      // B—; el resto se desempata con rng para no introducir sesgo posicional.
      let best = Infinity;
      let bestA = Infinity;
      const winners: number[] = [];
      for (let ti = 0; ti < PATTERNS.length; ti++) {
        const t = PATTERNS[ti];
        if (!t) continue;
        const tB = ink ? complement(t) : t;
        const score = hamming(t, targetA) + hamming(tB, targetB);
        const errA = hamming(t, targetA);
        if (score < best || (score === best && errA < bestA)) {
          best = score;
          bestA = errA;
          winners.length = 0;
          winners.push(ti);
        } else if (score === best && errA === bestA) {
          winners.push(ti);
        }
      }
      const choice = winners[rng.nextInt(winners.length)] ?? winners[0] ?? 0;
      const tile = PATTERNS[choice] ?? PATTERNS[0]!;
      writeBlock(a, x, y, tile);
      writeBlock(b, x, y, ink ? complement(tile) : tile);
    }
  }

  return { layers: [a, b], metric: measure(motif, a, b, coverA, coverB, options) };
}

function measure(
  motif: Bitmap,
  a: Layer,
  b: Layer,
  coverA: Bitmap,
  coverB: Bitmap,
  options: CoverWeaveOptions,
): CoverMetric {
  const { width, height } = motif;

  // Contraste de revelado: densidad media de la superposición en celdas de tinta vs de fondo.
  let inkSum = 0;
  let inkCells = 0;
  let bgSum = 0;
  let bgCells = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const ba = readBlock(a, x, y);
      const bb = readBlock(b, x, y);
      const overlay: Block = [
        ba[0] | bb[0],
        ba[1] | bb[1],
        ba[2] | bb[2],
        ba[3] | bb[3],
      ];
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
  const inkDensity = inkCells ? inkSum / inkCells : 1;
  const bgDensity = bgCells ? bgSum / bgCells : 0;
  const contrast = inkDensity - bgDensity;

  // Fidelidad: subpíxeles de cada capa que coinciden con su cover.
  const fidA = subpixelMatch(a, coverA);
  const fidB = subpixelMatch(b, coverB);

  const minContrast = options.minContrast ?? 0.4;
  const minFidelity = options.minFidelity ?? 0.5;
  const warnings: string[] = [];
  if (contrast < minContrast) {
    warnings.push(`contraste de revelado ${contrast.toFixed(2)} por debajo del umbral ${minContrast}`);
  }
  if (fidA < minFidelity) {
    warnings.push(`fidelidad de cover de la capa A ${fidA.toFixed(2)} por debajo del umbral ${minFidelity}`);
  }
  if (fidB < minFidelity) {
    warnings.push(`fidelidad de cover de la capa B ${fidB.toFixed(2)} por debajo del umbral ${minFidelity}`);
  }

  return {
    contrast,
    fidelity: [fidA, fidB],
    belowThreshold: warnings.length > 0,
    warnings,
  };
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
