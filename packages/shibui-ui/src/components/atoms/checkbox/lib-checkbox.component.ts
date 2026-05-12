import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LibCheckboxSize, LibCheckboxVariant } from './lib-checkbox.html';
import { checkboxTemplate } from './lib-checkbox.html';
import checkboxCss from './lib-checkbox.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export interface CheckboxChangeDetail {
  checked: boolean;
  value: string;
}

/**
 * @element lib-checkbox
 *
 * Control de seleccion multiple con soporte para indeterminate.
 *
 * @slot - Contenido de label alternativo (cuando no se usa prop label)
 *
 * @fires change - Emitido al cambiar el estado.
 *   detail: { checked: boolean, value: string }
 *
 * @example
 * <lib-checkbox label="Aceptar terminos" value="terms"></lib-checkbox>
 * <lib-checkbox label="Seleccion parcial" indeterminate></lib-checkbox>
 * <lib-checkbox label="Acento kaki" variant="kaki" checked></lib-checkbox>
 */
@customElement('lib-checkbox')
export class LibCheckbox extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(checkboxCss)}`,
  ];

  /** Estado marcado */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Estado deshabilitado */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Estado indeterminate — seleccion parcial de grupo.
   * Muestra un dash en lugar del check.
   */
  @property({ type: Boolean, reflect: true })
  indeterminate = false;

  /** Texto principal del label */
  @property({ type: String })
  label = '';

  /** Texto secundario bajo el label */
  @property({ type: String })
  sublabel = '';

  /** Valor enviado en el evento change */
  @property({ type: String })
  value = '';

  /** Tamano del checkbox */
  @property({ type: String, reflect: true })
  size: LibCheckboxSize = 'md';

  /** Variante de color */
  @property({ type: String, reflect: true })
  variant: LibCheckboxVariant = 'default';

  private _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;
    this.indeterminate = false; // el click resuelve el estado indeterminate

    this.dispatchEvent(
      new CustomEvent<CheckboxChangeDetail>('change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render(): TemplateResult {
    return checkboxTemplate({
      checked: this.checked,
      disabled: this.disabled,
      indeterminate: this.indeterminate,
      label: this.label,
      sublabel: this.sublabel,
      value: this.value,
      size: this.size,
      variant: this.variant,
      onChange: this._handleChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-checkbox': LibCheckbox;
  }
}