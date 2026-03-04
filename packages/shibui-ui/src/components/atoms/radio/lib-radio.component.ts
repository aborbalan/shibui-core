import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import type { LibRadioSize, LibRadioVariant } from './lib-radio.html';
import { radioTemplate } from './lib-radio.html';
import radioCss from './lib-radio.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export interface RadioChangeDetail {
  checked: boolean;
  value: string;
}

/**
 * @element lib-radio
 *
 * Control de seleccion unica. Debe usarse dentro de un grupo
 * con el mismo atributo `name` para que el navegador gestione
 * la exclusividad de forma nativa.
 *
 * @slot - Contenido de label alternativo (cuando no se usan props label/sublabel)
 *
 * @fires change - Emitido al seleccionar el radio.
 *   detail: { checked: boolean, value: string }
 *
 * @example
 * <lib-radio name="plan" value="starter" label="Starter"></lib-radio>
 * <lib-radio name="plan" value="pro"     label="Pro" checked></lib-radio>
 * <lib-radio name="plan" value="ent"     label="Enterprise" disabled></lib-radio>
 */
@customElement('lib-radio')
export class LibRadio extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(radioCss)}`,
  ];

  private _radioId: string;

  constructor() {
    super();
    this._radioId = generateUniqueId('lib-radio-');
  }

  /** Estado seleccionado */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Estado deshabilitado */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Nombre del grupo. Radios con el mismo name forman un grupo
   * de seleccion unica gestionado por el navegador.
   */
  @property({ type: String })
  name = '';

  /** Valor enviado en el evento change */
  @property({ type: String })
  value = '';

  /** Texto principal del label */
  @property({ type: String })
  label = '';

  /** Texto secundario bajo el label */
  @property({ type: String })
  sublabel = '';

  /** Tamano del radio */
  @property({ type: String, reflect: true })
  size: LibRadioSize = 'md';

  /** Variante de color */
  @property({ type: String, reflect: true })
  variant: LibRadioVariant = 'default';

  private _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;

    this.dispatchEvent(
      new CustomEvent<RadioChangeDetail>('change', {
        detail: { checked: this.checked, value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render(): TemplateResult {
    return radioTemplate({
      radioId: this._radioId,
      name: this.name,
      value: this.value,
      checked: this.checked,
      disabled: this.disabled,
      label: this.label,
      sublabel: this.sublabel,
      size: this.size,
      variant: this.variant,
      onChange: this._handleChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-radio': LibRadio;
  }
}