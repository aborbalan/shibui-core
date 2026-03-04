import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  LibDividerStyle,
  LibDividerColor,
  LibDividerAlign,
  LibDividerLabelStyle,
  LibDividerOrientation,
} from './lib-divider.component.html';
import { dividerTemplate } from './lib-divider.component.html';
import dividerCss from './lib-divider.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-divider
 *
 * Separador visual de contenido. Cinco estilos de línea, cuatro pesos,
 * variantes cromáticas, labels con tres tipografías y ornamentos.
 * Horizontal y vertical.
 *
 * @slot - Texto o elemento entre las dos líneas (label).
 */
@customElement('lib-divider')
export class LibDivider extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(dividerCss)}`,
  ];

  @property({ type: String, reflect: true })
  orientation: LibDividerOrientation = 'horizontal';

  @property({ type: String, reflect: true, attribute: 'style-variant' })
  styleVariant: LibDividerStyle = 'hairline';

  @property({ type: String, reflect: true })
  color: LibDividerColor = 'default';

  @property({ type: String, reflect: true })
  align: LibDividerAlign = 'center';

  /**
   * Ornamento visual entre las líneas.
   * Tipado como `string` para permitir que subclases amplíen
   * los valores válidos con `override` sin violar TS2416.
   * Valores base: 'none' | 'dot' | 'diamond'
   */
  @property({ type: String, reflect: true })
  ornament: string = 'none';

  @property({ type: String, reflect: true, attribute: 'label-style' })
  labelStyle: LibDividerLabelStyle = 'mono';

  /** @internal */
  @state()
  protected _hasSlotContent = false;

  protected _handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._hasSlotContent = nodes.some(
      n => n.nodeType === Node.ELEMENT_NODE ||
           (n.nodeType === Node.TEXT_NODE && n.textContent?.trim() !== '')
    );
  }

  override render(): TemplateResult {
    return dividerTemplate({
      orientation:    this.orientation,
      style:          this.styleVariant,
      color:          this.color,
      align:          this.align,
      ornament:       this.ornament as unknown,
      labelStyle:     this.labelStyle,
      hasSlotContent: this._hasSlotContent,
      onSlotChange:   this._handleSlotChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-divider': LibDivider;
  }
}