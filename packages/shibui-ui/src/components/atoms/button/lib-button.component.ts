import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import type { LibSize, UiClickEventDetail } from '../../../types';
import type { LibButtonVariant, LibButtonTone } from './lib-button.types';
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
 * @type {"solid" | "outlined" | "ghost"}
 */
  @property({ type: String, reflect: true })
  variant: LibButtonVariant = 'solid';

  /**
 * @type {"default" | "accent" | "error"}
 */
  @property({ type: String, reflect: true })
  tone: LibButtonTone = 'default';

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
 * @type {boolean}
 */
  @property({ type: Boolean, reflect: true })
  spotlight = false;

  private _onMouseMove = (e: MouseEvent): void => {
    if (!this.spotlight) return;
    const btn = this.shadowRoot?.querySelector('.btn');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.style.setProperty('--lib-spotlight-x', `${x}%`);
    this.style.setProperty('--lib-spotlight-y', `${y}%`);
  };

  private _onMouseLeave = (): void => {
    this.style.setProperty('--lib-spotlight-x', '50%');
    this.style.setProperty('--lib-spotlight-y', '50%');
  };

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mousemove', this._onMouseMove);
    this.addEventListener('mouseleave', this._onMouseLeave);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('mousemove', this._onMouseMove);
    this.removeEventListener('mouseleave', this._onMouseLeave);
  }

  /**
 * @type {'button' | 'submit' | 'reset'}
 */
  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button';

  /**
 * @type {string}
 */
  @property({ type: String, attribute: 'custom-padding' })
  customPadding = '';

  /**
 * @type {string}
 */
  @property({ type: String, attribute: 'aria-label' })
  override ariaLabel = '';

  /**
   * Implementación del renderizado siguiendo la regla de tipado explícito.
   */
  override render(): TemplateResult {
    return buttonTemplate({
      buttonId: this._buttonId,
      type: this.type,
      disabled: this.disabled,
      ariaLabel: this.ariaLabel || undefined,
      handleClick: this._handleClick.bind(this),
      variant: this.variant,
      size: this.size,
      glass: this.glass,
      spotlight: this.spotlight,
      customPadding: this.customPadding || undefined,
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
