import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibSpotlightVariant } from './lib-spotlight-card.component.html';
import { spotlightCardTemplate } from './lib-spotlight-card.component.html';
import spotlightCss from './lib-spotlight-card.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-spotlight-card
 *
 * Contenedor con foco de luz reactivo al cursor (Kintsugi Digital).
 * El gradiente radial sigue al puntero actualizando
 * `--lib-spotlight-x` y `--lib-spotlight-y` en :host.
 *
 * Con `kintsugi` activo añade el hilo de oro en el borde
 * y cambia el fondo a un tono cálido oscuro.
 *
 * @slot - Contenido de la card.
 *
 * @example — spotlight kaki
 * <lib-spotlight-card>...</lib-spotlight-card>
 *
 * @example — spotlight water
 * <lib-spotlight-card spotlight="water">...</lib-spotlight-card>
 *
 * @example — kintsugi border + spotlight kaki
 * <lib-spotlight-card kintsugi>...</lib-spotlight-card>
 */
@customElement('lib-spotlight-card')
export class LibSpotlightCard extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(spotlightCss)}`,
  ];

  /**
   * Color del foco de luz.
   * - kaki  : orgánico cálido — oklch(45% 0.05 45)  [default]
   * - water : azul sereno    — oklch(55% 0.06 210)
   * - white : neutro         — oklch(100% 0 0)
   *
   * Nota: cuando `kintsugi` está activo el spotlight es siempre kaki.
   */
  @property({ type: String, reflect: true })
  spotlight: LibSpotlightVariant = 'kaki';

  /**
   * Activa el hilo de oro en el borde (--lib-kintsugi-border)
   * y cambia el fondo del contenedor a un tono cálido oscuro.
   */
  @property({ type: Boolean, reflect: true })
  kintsugi = false;

  override render(): TemplateResult {
    return spotlightCardTemplate({
      spotlight:    this.spotlight,
      kintsugi:     this.kintsugi,
      onMouseMove:  this._handleMouseMove.bind(this),
      onMouseLeave: this._handleMouseLeave.bind(this),
    });
  }

  private _handleMouseMove(e: MouseEvent): void {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;

    // Actualiza las custom properties en :host
    // El radial-gradient del CSS las consume automáticamente
    this.style.setProperty('--lib-spotlight-x', `${x}%`);
    this.style.setProperty('--lib-spotlight-y', `${y}%`);
  }

  private _handleMouseLeave(): void {
    // Resetea al centro — la layer se oculta vía CSS opacity: 0
    this.style.setProperty('--lib-spotlight-x', '50%');
    this.style.setProperty('--lib-spotlight-y', '50%');
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-spotlight-card': LibSpotlightCard;
  }
}