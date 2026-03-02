import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import inputStyles from './lib-input.css?inline';
import { inputTemplate } from './lib-input.html';

export interface LibInputEventDetail {
  value: string;
}

/**
 * @element lib-input
 * @fires ui-lib-input - Evento disparado al cambiar el valor del input.
 * @slot prefix - Icono o elemento antes del input.
 * @slot suffix - Icono o elemento después del input.
 */
@customElement('lib-input')
export class LibInput extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(inputStyles)}`,
  ];

  @property({ type: String }) label = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) type: 'text' | 'email' | 'password' = 'text';
  @property({ type: Boolean, reflect: true }) required = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) error = false;
  @property({ type: String }) errorMessage = '';
  @property({ type: String }) value = '';

  @state() private _showPassword = false;

  private readonly _uuid = `lib-input-${Math.random().toString(36).slice(2, 9)}`;

  override render(): TemplateResult {
    return inputTemplate({
      uuid: this._uuid,
      type: this.type,
      label: this.label,
      placeholder: this.placeholder,
      required: this.required,
      disabled: this.disabled,
      error: this.error,
      errorMessage: this.errorMessage,
      value: this.value,
      showPassword: this._showPassword,
      handleInput: this._handleInput.bind(this),
      handleTogglePassword: this._handleTogglePassword.bind(this),
    });
  }

  private _handleInput(e: InputEvent): void {
    const target = e.target as HTMLInputElement;
    this.value = target.value;

    this.dispatchEvent(
      new CustomEvent<LibInputEventDetail>('ui-lib-input', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleTogglePassword(): void {
    this._showPassword = !this._showPassword;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-input': LibInput;
  }
}