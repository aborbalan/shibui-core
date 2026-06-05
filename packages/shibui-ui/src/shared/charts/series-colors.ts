/* ============================================================
   CHARTS · series-colors — paleta compartida de series
   Misma secuencia para todas las gráficas → coherencia visual
   y leyendas consistentes entre tipos de chart.
   ============================================================ */

/** Paleta de colores por serie — visualmente distintos en claro y oscuro. */
export const SERIES_COLORS: readonly string[] = [
  'oklch(45.54% 0.059 173.23deg)',  /* celadon-500 */
  'oklch(51.65% 0.134  46.13deg)',  /* kaki-500    */
  'oklch(65%    0.15  300deg)',
  'oklch(55%    0.18  240deg)',
  'oklch(65%    0.12   60deg)',
  'oklch(60%    0.14    0deg)',
];

/** Devuelve el color de la serie `i`, ciclando la paleta si hace falta. */
export function seriesColor(i: number): string {
  return SERIES_COLORS[i % SERIES_COLORS.length] ?? SERIES_COLORS[0]!;
}
