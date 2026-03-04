import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  LibDividerStyle,
  LibDividerColor,
  LibDividerAlign,
  LibDividerOrnament,
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
 *
 * @example — línea simple
 * <lib-divider></lib-divider>
 *
 * @example — con label
 * <lib-divider>O</lib-divider>
 *
 * @example — con ornamento diamond y gradiente
 * <lib-divider style-variant="gradient" ornament="diamond"></lib-divider>
 *
 * @example — kaki con dot
 * <lib-divider color="kaki" ornament="dot"></lib-divider>
 *
 * @example — vertical en nav
 * <lib-divider orientation="vertical" style="height:14px"></lib-divider>
 */
@customElement('lib-divider')
export class LibDivider extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(dividerCss)}`,
  ];

  /** Dirección del separador */
  @property({ type: String, reflect: true })
  orientation: LibDividerOrientation = 'horizontal';

  /**
   * Estilo de la línea.
   * Nota: el atributo es `style-variant` para no colisionar
   * con el atributo nativo `style` del DOM.
   */
  @property({ type: String, reflect: true, attribute: 'style-variant' })
  styleVariant: LibDividerStyle = 'hairline';

  /** Color de acento de la línea */
  @property({ type: String, reflect: true })
  color: LibDividerColor = 'default';

  /**
   * Alineación del label u ornamento.
   * `left` y `right` acortan el segmento opuesto a 24px.
   */
  @property({ type: String, reflect: true })
  align: LibDividerAlign = 'center';

  /**
   * Ornamento visual entre las líneas.
   * Toma prioridad sobre el contenido del slot si ambos están presentes.
   */
  @property({ type: String, reflect: true })
  ornament: LibDividerOrnament = 'none';

  /** Tipografía del label slotado */
  @property({ type: String, reflect: true, attribute: 'label-style' })
  labelStyle: LibDividerLabelStyle = 'mono';

  /** Detectado via slotchange — true si el slot tiene nodos de texto o elementos */
  @state()
  private _hasSlotContent = false;

  private _handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._hasSlotContent = nodes.some(
      n => n.nodeType === Node.ELEMENT_NODE ||
           (n.nodeType === Node.TEXT_NODE && n.textContent?.trim() !== '')
    );
  }

  override render(): TemplateResult {
    return dividerTemplate({
      orientation: this.orientation,
      style: this.styleVariant,
      color: this.color,
      align: this.align,
      ornament: this.ornament,
      labelStyle: this.labelStyle,
      hasSlotContent: this._hasSlotContent,
      onSlotChange: this._handleSlotChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-divider': LibDivider;
  }
}