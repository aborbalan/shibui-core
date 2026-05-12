import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { generateUniqueId } from '../../../core/a11y';
import type { LibSwitchVariant, LibSwitchSize } from './lib-switch.html';
import { switchTemplate } from './lib-switch.html';
import switchCss from './lib-switch.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

export type { LibSwitchVariant, LibSwitchSize };

/**
 * @element lib-switch
 *
 * Toggle switch con variante kintsugi de acabado premium.
 *
 * @fires ui-lib-change — Emitido al cambiar estado con `{ checked: boolean }`
 *
 * @example — default
 * <lib-switch label="Notificaciones"></lib-switch>
 *
 * @example — con subtítulo
 * <lib-switch label="Acceso premium" sub="Funciones exclusivas" checked></lib-switch>
 *
 * @example — kintsugi (superficie oscura)
 * <lib-switch variant="kintsugi" label="Modo ceremonial" sub="Activa el tema kintsugi"></lib-switch>
 *
 * @example — tamaños
 * <lib-switch size="sm"></lib-switch>
 * <lib-switch size="lg" label="Sincronización"></lib-switch>
 */
@customElement('lib-switch')
export class LibSwitch extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(switchCss)}`,
  ];

  private _switchId: string;

  constructor() {
    super();
    this._switchId = generateUniqueId('lib-switch-');
  }

  /** Estado activo del switch. */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Deshabilita la interacción. */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Variante visual.
   * - default   : track washi, thumb blanco
   * - kintsugi  : cerámica oscura, venas doradas, thumb de oro al activar
   */
  @property({ type: String, reflect: true })
  variant: LibSwitchVariant = 'default';

  /**
   * Tamaño del switch.
   * - sm : 30×18px · md : 40×24px (default) · lg : 52×30px
   */
  @property({ type: String, reflect: true })
  size: LibSwitchSize = 'md';

  /** Texto principal de la etiqueta. */
  @property({ type: String })
  label = '';

  /** Texto secundario debajo del label. */
  @property({ type: String })
  sub = '';

  override render(): TemplateResult {
    return switchTemplate({
      switchId:     this._switchId,
      checked:      this.checked,
      disabled:     this.disabled,
      label:        this.label,
      sub:          this.sub,
      handleChange: this._handleChange.bind(this),
    });
  }

  private _handleChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    this.checked = input.checked;

    this.dispatchEvent(
      new CustomEvent<{ checked: boolean }>('ui-lib-change', {
        detail:   { checked: this.checked },
        bubbles:  true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-switch': LibSwitch;
  }
}