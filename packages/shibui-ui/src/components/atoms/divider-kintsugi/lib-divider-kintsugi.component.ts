import { css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LibDivider } from '../divider/lib-divider.component';
import type { LibKintsugiWeight, LibKintsugiOrnament } from './lib-divider-kintsugi.component.html';
import { kintsugiDividerTemplate } from './lib-divider-kintsugi.component.html';
import kintsugiCss from './lib-divider-kintsugi.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * @element lib-divider-kintsugi
 *
 * Variante kintsugi (金継ぎ) del divider base.
 * La línea se convierte en una vena de oro animada con shimmer,
 * pulse y glow. Hereda orientation, align y labelStyle de lib-divider.
 *
 * @slot - Texto del label (mono o display) o carácter japonés (kanji-label).
 *
 * @example — línea base
 * <lib-divider-kintsugi></lib-divider-kintsugi>
 *
 * @example — thick con diamond
 * <lib-divider-kintsugi weight="thick" ornament="diamond"></lib-divider-kintsugi>
 *
 * @example — label dorado
 * <lib-divider-kintsugi>O</lib-divider-kintsugi>
 *
 * @example — kanji con gradiente dorado
 * <lib-divider-kintsugi ornament="kanji-label">間</lib-divider-kintsugi>
 *
 * @example — vertical en metadatos
 * <lib-divider-kintsugi orientation="vertical" style="height:14px;"></lib-divider-kintsugi>
 */
@customElement('lib-divider-kintsugi')
export class LibDividerKintsugi extends LibDivider {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(kintsugiCss)}`,
  ];

  /**
   * Grosor y estilo de la vena de oro.
   * - base  : 1px con fade en extremos (default)
   * - thick : 2px con glow pulsante
   * - full  : sin fade, de borde a borde
   */
  @property({ type: String, reflect: true })
  weight: LibKintsugiWeight = 'base';

  /**
   * Ornamento entre las dos líneas.
   * Amplía los valores del base con `ring` y `kanji-label`.
   * Posible gracias a que la base declara `ornament: string`.
   */
  @property({ type: String, reflect: true })
  override ornament: LibKintsugiOrnament = 'none';

  /** @internal */
  @state()
  protected override _hasSlotContent = false;

  protected override _handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({ flatten: true });
    this._hasSlotContent = nodes.some(
      n => n.nodeType === Node.ELEMENT_NODE ||
           (n.nodeType === Node.TEXT_NODE && n.textContent?.trim() !== '')
    );
  }

  override render(): TemplateResult {
    return kintsugiDividerTemplate({
      orientation:    this.orientation,
      weight:         this.weight,
      align:          this.align,
      ornament:       this.ornament,
      labelStyle:     this.labelStyle,
      hasSlotContent: this._hasSlotContent,
      onSlotChange:   this._handleSlotChange.bind(this),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-divider-kintsugi': LibDividerKintsugi;
  }
}