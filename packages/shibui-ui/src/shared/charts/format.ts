/* ============================================================
   CHARTS · format — formateo de etiquetas de eje
   ============================================================ */

/** Formatea un valor numérico de tick de forma compacta (1.2k, 3.4M…). */
export function formatTick(v: number): string {
  if (Math.abs(v) >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (Math.abs(v) >= 1_000)     return `${(v / 1_000).toFixed(1)}k`;
  return Number.isInteger(v) ? String(v) : v.toPrecision(3);
}

/** Trunca una etiqueta de categoría demasiado larga para el eje X. */
export function truncate(label: string, max = 10): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
