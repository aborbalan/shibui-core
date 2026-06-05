/* ============================================================
   CHARTS · stacking — máximos agrupados / apilados por categoría
   Compartido por bar-chart (stacked) y line-chart (stacked-area).
   ============================================================ */

import type { ChartSeries } from '../../../models/ui/charts';

/** Mayor valor individual entre todas las series (modo agrupado / líneas sueltas). */
export function groupedMax(series: ChartSeries[]): number {
  return Math.max(0, ...series.flatMap(s => s.values));
}

/** Mayor suma de valores por categoría (modo apilado). */
export function stackedMax(series: ChartSeries[], numCategories: number): number {
  let max = 0;
  for (let ci = 0; ci < numCategories; ci++) {
    const sum = series.reduce((acc, s) => acc + (s.values[ci] ?? 0), 0);
    if (sum > max) max = sum;
  }
  return max;
}
