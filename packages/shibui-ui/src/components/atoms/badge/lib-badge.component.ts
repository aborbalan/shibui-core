import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibBadgeTone, LibBadgeSize } from './lib-badge.html';
import { badgeTemplate } from './lib-badge.html';
import badgeCss from './lib-badge.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-badge
 *
 * Indicador visual compacto para estado, notificaciones o etiquetas.
 *
 * @slot - Contenido del badge (texto o icono)
 * @csspart badge - El elemento <span> raíz del badge
 *
 * @example
 * <lib-badge tone="success" dot>Activo</lib-badge>
 * <lib-badge tone="error">Error</lib-badge>
 * <lib-badge tone="accent" pill>Nuevo</lib-badge>
 */
@customElement('lib-badge')
export class LibBadge extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(badgeCss)}
    `,
  ];

  /** Tono semántico del badge */
  @property({ type: String, reflect: true })
  tone: LibBadgeTone = 'default';

  /** Tamaño del badge */
  @property({ type: String, reflect: true })
  size: LibBadgeSize = 'md';

  /** Muestra un punto indicador de color a la izquierda del texto */
  @property({ type: Boolean, reflect: true })
  dot = false;

  /** Aplica border-radius completo (estilo píldora) */
  @property({ type: Boolean, reflect: true })
  pill = false;

  override render(): TemplateResult {
    return badgeTemplate({
      tone: this.tone,
      size: this.size,
      dot: this.dot,
      pill: this.pill,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-badge': LibBadge;
  }
}