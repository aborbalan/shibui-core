/* ============================================================
   CHARTS · interaction — utilidades de hover/tooltip
   ============================================================ */

/**
 * Calcula el ancla de un tooltip (centro superior del elemento objetivo)
 * en coordenadas relativas al wrapper de la gráfica.
 * Devuelve `null` si el wrapper aún no tiene layout.
 */
export function tooltipAnchor(
  wrapper: HTMLElement | null,
  target:  Element,
): { x: number; y: number } | null {
  const wrapRect = wrapper?.getBoundingClientRect();
  if (!wrapRect) return null;

  const rect = target.getBoundingClientRect();
  return {
    x: rect.left - wrapRect.left + rect.width / 2,
    y: rect.top  - wrapRect.top,
  };
}
