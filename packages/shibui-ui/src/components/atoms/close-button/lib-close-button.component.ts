import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import type { LibCloseVariant, LibCloseSize, LibCloseIcon } from './lib-close-button.html';
import { closeButtonTemplate } from './lib-close-button.html';
import closeButtonCss from './lib-close-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-close-button
 *
 * Boton de cierre reutilizable. Emite `lib-close` al hacer click.
 * Usado en chips, toasts, modales, alert banners y superficies oscuras.
 *
 * @fires lib-close - Emitido al hacer click. Sin detail.
 *
 * @example
 * <lib-close-button variant="ghost" size="md"></lib-close-button>
 * <lib-close-button variant="subtle" size="lg"></lib-close-button>
 * <lib-close-button variant="on-dark" size="md"></lib-close-button>
 */
@customElement('lib-close-button')
export class LibCloseButton extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(closeButtonCss)}`,
  ];

  /** Variante visual */
  @property({ type: String, reflect: true })
  variant: LibCloseVariant = 'ghost';

  /** Tamaño: sm (24px) · md (32px) · lg (40px) · xl (48px) */
  @property({ type: String, reflect: true })
  size: LibCloseSize = 'md';

  /**
   * Icono Phosphor a mostrar.
   * x → simple · x-circle → con circulo · x-square → con cuadrado
   */
  @property({ type: String })
  icon: LibCloseIcon = 'x';

  /** Estado deshabilitado */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Texto accesible del boton */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = 'Cerrar';

  private _handleClick(e: Event): void {
    if (this.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent('lib-close', {
        bubbles: true,
        composed: true,
      })
    );
  }

  override render(): TemplateResult {
    return closeButtonTemplate({
      variant: this.variant,
      size: this.size,
      icon: this.icon,
      disabled: this.disabled,
      ariaLabel: this.ariaLabel ?? 'Cerrar',
      onClick: this._handleClick.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-close-button': LibCloseButton;
  }
}