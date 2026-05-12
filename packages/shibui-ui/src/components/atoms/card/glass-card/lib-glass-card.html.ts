import { html, TemplateResult } from 'lit';
import type { GlassCardTemplateProps } from './lib-glass-card.types';

/**
 * Template del glass card.
 *
 * Estructura de capas (de abajo a arriba):
 *   1. .glass-card       — backdrop-filter + background tintado
 *   2. ::before (CSS)    — reflexión de luz (--lib-glass-shine)
 *   3. .glass-card__slot — slot del contenido, z-index: 1
 */
export function glassCardTemplate(_props: GlassCardTemplateProps): TemplateResult {
  return html`
    <div class="glass-card">
      <div class="glass-card__slot">
        <slot></slot>
      </div>
    </div>
  `;
}