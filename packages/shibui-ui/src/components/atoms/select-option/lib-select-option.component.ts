import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { selectOptionTemplate } from './lib-select-option.html';
import optionCss from './lib-select-option.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-select-option
 *
 * Opción individual para usar dentro de lib-select.
 * Emite `option-selected` con { value, label } al hacer clic,
 * que lib-select captura desde el light DOM.
 *
 * @fires option-selected — { value: string, label: string }
 * @slot — Texto visible de la opción
 */
@customElement('lib-select-option')
export class LibSelectOption extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(optionCss)}`,
  ];

  /** Valor interno que se comunica al select padre. */
  @property({ type: String, reflect: true }) value = '';

  /** Estado de selección — controlado por lib-select. */
  @property({ type: Boolean, reflect: true }) selected = false;

  /** Deshabilita la opción. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  override render(): TemplateResult {
    return selectOptionTemplate({
      value:       this.value,
      selected:    this.selected,
      disabled:    this.disabled,
      handleClick: this._handleClick.bind(this),
    });
  }

  private _handleClick(e: Event): void {
    e.stopPropagation();
    if (this.disabled) return;

    this.dispatchEvent(
      new CustomEvent<{ value: string; label: string }>('option-selected', {
        detail: {
          value: this.value,
          label: this.textContent?.trim() ?? '',
        },
        bubbles:  true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-select-option': LibSelectOption;
  }
}