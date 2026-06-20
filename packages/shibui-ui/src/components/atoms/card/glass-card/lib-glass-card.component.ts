import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibGlassTint, LibGlassIntensity } from './lib-glass-card.types';
import { glassCardTemplate } from './lib-glass-card.html';
import glassCss from './lib-glass-card.css?inline';
import sharedTokens from '../../../../styles/shared/tokens.css?inline';

/**
 * @element lib-glass-card
 *
 * Contenedor con efecto glassmorphism (Efecto Agua).
 * Requiere un fondo oscuro en el elemento padre para que
 * el backdrop-filter sea visible.
 *
 * @slot - Contenido de la card (eyebrow, título, body, footer...).
 *
 * @example — uso básico (neutro, sin tinte)
 * <lib-glass-card>
 *   <h3>Neutral Glass</h3>
 *   <p>Variante neutra sobre fondo oscuro.</p>
 * </lib-glass-card>
 *
 * @example — tinte frío con intensidad alta
 * <lib-glass-card tint="cool" intensity="high">...</lib-glass-card>
 *
 * @example — tinte cálido
 * <lib-glass-card tint="warm">...</lib-glass-card>
 *
 * @example — dentro de un contexto katachi (el tinte lo decide el katachi)
 * <div data-katachi="wabi">
 *   <lib-glass-card>...</lib-glass-card>
 * </div>
 */
@customElement('lib-glass-card')
export class LibGlassCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(glassCss)}`,
  ];

  /**
   * Tinte estructural del cristal.
   * - neutral : neutro paper (default)
   * - cool    : tinte azul sereno — oklch(55% 0.06 210)
   * - warm    : tinte cálido orgánico — oklch(45% 0.05 45)
   * Dentro de un katachi el tinte es sobreescrito por el contexto.
   */
  @property({ type: String, reflect: true })
  tint: LibGlassTint = 'neutral';

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
      tint:      this.tint,
      intensity: this.intensity,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-glass-card': LibGlassCard;
  }
}