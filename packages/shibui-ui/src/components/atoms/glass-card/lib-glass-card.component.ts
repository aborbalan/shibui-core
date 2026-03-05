import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibGlassVariant, LibGlassIntensity } from './lib-glass-card.html';
import { glassCardTemplate } from './lib-glass-card.html';
import glassCss from './lib-glass-card.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-glass-card
 *
 * Contenedor con efecto glassmorphism (Efecto Agua).
 * Requiere un fondo oscuro en el elemento padre para que
 * el backdrop-filter sea visible.
 *
 * @slot - Contenido de la card (eyebrow, título, body, footer...).
 *
 * @example — uso básico
 * <lib-glass-card>
 *   <h3>Paper Glass</h3>
 *   <p>Variante neutra sobre fondo oscuro.</p>
 * </lib-glass-card>
 *
 * @example — variante water con intensidad alta
 * <lib-glass-card variant="water" intensity="high">...</lib-glass-card>
 *
 * @example — variante kaki
 * <lib-glass-card variant="kaki">...</lib-glass-card>
 */
@customElement('lib-glass-card')
export class LibGlassCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(glassCss)}`,
  ];

  /**
   * Tinte de color del cristal.
   * - paper : neutro paper al 15% (default)
   * - water : azul sereno oklch(55% 0.06 210)
   * - kaki  : orgánico cálido oklch(45% 0.05 45)
   */
  @property({ type: String, reflect: true })
  variant: LibGlassVariant = 'paper';

  /**
   * Intensidad del efecto (blur + opacidad).
   * - low  : blur 4px  · opacity 0.10 — sutil
   * - md   : blur 12px · opacity 0.15 — default
   * - high : blur 25px · opacity 0.25 — máximo
   */
  @property({ type: String, reflect: true })
  intensity: LibGlassIntensity = 'md';

  override render(): TemplateResult {
    return glassCardTemplate({
      variant:   this.variant,
      intensity: this.intensity,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-glass-card': LibGlassCard;
  }
}