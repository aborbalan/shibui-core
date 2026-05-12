import { html, TemplateResult } from 'lit';
import type { SpotlightCardTemplateProps } from './lib-spotlight-card.types';

/**
 * Template del spotlight card.
 *
 * Arquitectura de capas (de abajo a arriba):
 *   1. .spotlight__layer  — gradiente radial reactivo al cursor (z-index 1)
 *   2. ::after (CSS)      — hilo kintsugi en el borde, solo si [kintsugi] (z-index 2)
 *   3. .spotlight__slot   — contenido slotado (z-index 3)
 *
 * El gradiente del spotlight se actualiza vía CSS custom properties
 * --lib-spotlight-x / --lib-spotlight-y actualizadas en el mousemove handler.
 */
export function spotlightCardTemplate(props: SpotlightCardTemplateProps): TemplateResult {
  return html`
    <div
      class="spotlight"
      @mousemove=${props.onMouseMove}
      @mouseleave=${props.onMouseLeave}
    >
      <div class="spotlight__layer"></div>
      <div class="spotlight__slot">
        <slot></slot>
      </div>
    </div>
  `;
}