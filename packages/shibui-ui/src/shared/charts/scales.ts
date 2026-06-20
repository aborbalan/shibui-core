/* ============================================================
   CHARTS · scales — ejes "redondos" y escalas de coordenadas
   Unifica la lógica de nice-axis y escalado que bar-chart y
   scatter-chart duplicaban.
   ============================================================ */

import type { AxisInfo } from '../../../models/ui/charts';

export interface NiceAxisOptions {
  /** Número objetivo de divisiones (default 5). */
  tickCount?:    number;
  /** Ancla el dominio en 0 → [0, max] (barras). Si no, usa [min, max] con padding. */
  zeroAnchored?: boolean;
  /** Padding fraccional aplicado a los extremos cuando `zeroAnchored` es false (default 0.05). */
  pad?:          number;
}

/**
 * Calcula un dominio y un conjunto de ticks "redondos" para un eje.
 *
 * - `zeroAnchored: true`  → dominio [0, niceMax], como las barras.
 * - `zeroAnchored: false` → dominio [niceMin, niceMax] con padding, como el scatter.
 */
export function niceAxis(min: number, max: number, opts: NiceAxisOptions = {}): AxisInfo {
  const { tickCount = 5, zeroAnchored = false, pad = 0.05 } = opts;

  if (zeroAnchored) {
    const hiData = Math.max(0, max);
    if (hiData <= 0) return { domain: [0, 10], ticks: [0, 2, 4, 6, 8, 10] };
    const step = niceStep(hiData / tickCount);
    const hi   = Math.ceil(hiData / step) * step;
    return { domain: [0, hi], ticks: rangeTicks(0, hi, step) };
  }

  const range = max - min;
  if (range === 0) {
    return { domain: [min - 1, min + 1], ticks: [min - 1, min, min + 1] };
  }

  const p    = range * pad;
  const lo0  = min - p;
  const hi0  = max + p;
  const step = niceStep((hi0 - lo0) / tickCount);
  const lo   = Math.floor(lo0 / step) * step;
  const hi   = Math.ceil(hi0  / step) * step;
  return { domain: [lo, hi], ticks: rangeTicks(lo, hi, step) };
}

/** Redondea un paso bruto al "número bonito" más cercano (1·2·5·10 × 10ⁿ). */
function niceStep(raw: number): number {
  const mag  = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const nice = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return nice * mag;
}

/** Genera los ticks de `lo` a `hi` con paso `step`, evitando ruido de coma flotante. */
function rangeTicks(lo: number, hi: number, step: number): number[] {
  const ticks: number[] = [];
  for (let t = lo; t <= hi + step * 0.001; t += step) {
    ticks.push(parseFloat(t.toPrecision(10)));
  }
  return ticks;
}

/**
 * Escala lineal genérica: mapea un valor del `domain` al `range` (px).
 * Para el eje Y se invierte el range, p.ej. `[top + innerH, top]`.
 */
export function linearScale(
  [d0, d1]: [number, number],
  [r0, r1]: [number, number],
): (v: number) => number {
  const span = (d1 - d0) || 1;
  return (v: number): number => r0 + ((v - d0) / span) * (r1 - r0);
}

/**
 * Escala de banda para ejes categóricos. Divide `[r0, r1]` en `count` bandas
 * iguales y expone el ancho de banda y el centro de cada índice.
 */
export interface BandScale {
  /** Ancho de cada banda. */
  bandWidth: number;
  /** Coordenada inicial (izquierda) de la banda `i`. */
  start:  (i: number) => number;
  /** Coordenada central de la banda `i`. */
  center: (i: number) => number;
}

export function bandScale(count: number, [r0, r1]: [number, number]): BandScale {
  const n         = Math.max(count, 1);
  const bandWidth = (r1 - r0) / n;
  return {
    bandWidth,
    start:  (i: number): number => r0 + i * bandWidth,
    center: (i: number): number => r0 + i * bandWidth + bandWidth / 2,
  };
}
