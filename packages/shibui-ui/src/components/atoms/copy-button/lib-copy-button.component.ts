import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../atoms/icon/lib-icon.component';
import type { LibCopyVariant, LibCopySize } from './lib-copy-button.html';
import { copyButtonTemplate } from './lib-copy-button.html';
import copyButtonCss from './lib-copy-button.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/** Tiempo en ms que el estado copiado permanece activo */
const COPIED_DURATION = 1800;

/**
 * @element lib-copy-button
 *
 * Boton que copia texto al portapapeles y confirma la accion
 * con un checkmark animado (crossfade idle/copied con ease-bounce).
 *
 * @fires lib-copy - Emitido al copiar con exito. detail: { value: string }
 *
 * @example
 * <lib-copy-button value="npm install @shibui-ui/ui"></lib-copy-button>
 * <lib-copy-button value="sk-ant-api03-xyz" variant="outlined" tooltip></lib-copy-button>
 * <lib-copy-button value="copy me" variant="ghost" icon-only size="sm"></lib-copy-button>
 */
@customElement('lib-copy-button')
export class LibCopyButton extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(copyButtonCss)}`,
  ];

  private _resetTimer: ReturnType<typeof setTimeout> | null = null;

  /** Texto que se copia al portapapeles */
  @property({ type: String })
  value = '';

  /** Variante visual */
  @property({ type: String, reflect: true })
  variant: LibCopyVariant = 'ghost';

  /** Tamaño */
  @property({ type: String, reflect: true })
  size: LibCopySize = 'md';

  /** Modo icono-solo (sin label, cuadrado) */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' })
  iconOnly = false;

  /** Label en estado idle */
  @property({ type: String })
  label = 'Copiar';

  /** Label en estado copiado */
  @property({ type: String, attribute: 'success-label' })
  successLabel = 'Copiado';

  /** Muestra un tooltip "Copiado" al copiar */
  @property({ type: Boolean, reflect: true })
  tooltip = false;

  /** Estado deshabilitado */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Estado interno — activa el crossfade y el tooltip */
  @state()
  private _copied = false;

  /** Refleja _copied como atributo para que los selectores CSS :host([copied]) funcionen */
  override updated(changed: Map<string, unknown>): void {
    if (changed.has('_copied')) {
      this.toggleAttribute('copied', this._copied);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._resetTimer) clearTimeout(this._resetTimer);
  }

  private async _handleClick(): Promise<void> {
    if (!this.value || this.disabled || this._copied) return;

    try {
      await navigator.clipboard.writeText(this.value);
      this._copied = true;

      this.dispatchEvent(
        new CustomEvent('lib-copy', {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );

      if (this._resetTimer) clearTimeout(this._resetTimer);
      this._resetTimer = setTimeout(() => {
        this._copied = false;
      }, COPIED_DURATION);

    } catch (err) {
      console.error('[lib-copy-button] Error al copiar:', err);
    }
  }

  override render(): TemplateResult {
    return copyButtonTemplate({
      value: this.value,
      variant: this.variant,
      size: this.size,
      iconOnly: this.iconOnly,
      label: this.label,
      successLabel: this.successLabel,
      tooltip: this.tooltip,
      copied: this._copied,
      disabled: this.disabled,
      onClick: this._handleClick.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-copy-button': LibCopyButton;
  }
}