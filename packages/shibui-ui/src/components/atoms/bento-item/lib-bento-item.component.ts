import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bentoItemTemplate } from './lib-bento-item.html';
import itemCss from './lib-bento-item.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

/**
 * lib-bento-item — Celda de la rejilla bento
 *
 * Úsalo como hijo directo de lib-bento-grid.
 *
 * @prop cols        — Columnas que ocupa (default 1)
 * @prop rows        — Filas que ocupa (default 1)
 * @prop interactive — Añade hover y cursor pointer
 * @prop flush       — Elimina el padding interno (para imágenes a sangre)
 *
 * @slot — Contenido de la celda
 */
@customElement('lib-bento-item')
export class LibBentoItem extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(itemCss)}`,
  ];

  @property({ type: Number })
  cols = 1;

  @property({ type: Number })
  rows = 1;

  @property({ type: Boolean, reflect: true })
  interactive = false;

  @property({ type: Boolean, reflect: true })
  flush = false;

  /**
   * FIX: grid-column/row deben aplicarse sobre :host (el elemento
   * que participa en el grid del padre), NO sobre un div interno.
   * Las CSS custom properties no suben al padre, solo bajan.
   * La solución correcta es escribir directamente en this.style.
   */
  override updated(): void {
    this.style.gridColumn = `span ${this.cols}`;
    this.style.gridRow    = `span ${this.rows}`;
  }

  protected override render(): TemplateResult {
    return bentoItemTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-bento-item': LibBentoItem;
  }
}