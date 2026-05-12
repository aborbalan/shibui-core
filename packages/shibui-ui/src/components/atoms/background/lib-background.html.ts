import { html, nothing, TemplateResult } from 'lit';
import type { BackgroundTemplateProps } from './lib-background.types';

/**
 * Template principal de lib-background.
 *
 * Estructura de capas:
 *  .bg-base    → recibe background CSS (color/patrón/gradiente)
 *  .bg-overlay → grain, shimmer, scan line, ink-drop...
 *  .bg-orb-a/b → orbes animados (solo aurora-drift)
 *  .bg-canvas  → canvas 2D generativo (solo variantes canvas)
 *  .bg-content → contenido sloteado — z-index 2
 */
export function backgroundTemplate(props: BackgroundTemplateProps): TemplateResult {
  const { variant, isCanvas } = props;
  const isAuroraDrift = variant === 'aurora-drift';

  return html`
    ${isCanvas
      ? html`<canvas class="bg-canvas"></canvas>`
      : html`
          <div class="bg-base"></div>
          <div class="bg-overlay"></div>
          ${isAuroraDrift
            ? html`<div class="bg-orb-a"></div><div class="bg-orb-b"></div>`
            : nothing}
        `
    }
    <div class="bg-content">
      <slot></slot>
    </div>
  `;
}