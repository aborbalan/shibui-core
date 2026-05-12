import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import type { LibSize, LibVariant, UiClickEventDetail } from '../../../types';
import buttonCss from './lib-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { buttonTemplate } from './lib-button.html';

/**
 * @tag lib-button
 * @element lib-button
 * @fires ui-lib-click - Evento personalizado disparado al hacer clic.
 * @event lib-click
 * @csspart button - El elemento <button> nativo.
 */
@customElement('lib-button')
export class LibButton extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(buttonCss)}
    `
  ];

  private _buttonId: string;

  constructor() {
    super();
    this._buttonId = generateUniqueId('lib-button-');
  }

  /**
 * @type {"default" | "primary" | "secondary" | "success" | "warning" | "danger" | "accent"}
 */
  @property({ type: String, reflect: true })
  variant: LibVariant = 'primary';

  /**
 * @type {"sm" | "md" | "lg" | "xl"}
 */
  @property({ type: String, reflect: true })
  size: LibSize = 'md';

  /**
 * @type {boolean}
 */
  @property({ type: Boolean, reflect: true })
  disabled = false;

/**
 * @type {boolean}
 */
  @property({ type: Boolean, reflect: true })
  glass = false;

  /**
 * @type {'button' | 'submit' | 'reset'}
 */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
 * @type {string | null}
 */
  @property({ type: String, attribute: 'custom-padding' })
  customPadding: string | null = null;

  /**
 * @type {string | null}
 */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel: string | null = null;

  /**
   * Implementación del renderizado siguiendo la regla de tipado explícito.
   */
  override render(): TemplateResult {
    return buttonTemplate({
      buttonId: this._buttonId,
      type: this.type,
      disabled: this.disabled,
      ariaLabel: this.ariaLabel ?? undefined,
      handleClick: this._handleClick.bind(this),
      variant: this.variant,
      size: this.size,
      glass:this.glass,
      customPadding: this.customPadding ?? undefined,
    });
  }

  private _handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    this.dispatchEvent(
      new CustomEvent<UiClickEventDetail>('ui-lib-click', {
        detail: { originalEvent: event, timestamp: Date.now() },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-button': LibButton;
  }
}
