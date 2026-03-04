import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './lib-bento-item.css?inline';
import { bentoItemTemplate } from './lib-bento-item.html';

@customElement('lib-bento-item')
export class LibBentoItem extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Número de columnas que ocupa el item */
  @property({ type: Number }) cols: number = 1;

  /** Número de filas que ocupa el item */
  @property({ type: Number }) rows: number = 1;

  /** Si es true, añade efectos hover y cursor pointer */
  @property({ type: Boolean, reflect: true }) interactive: boolean = false;

  protected override render(): TemplateResult {
    return bentoItemTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-bento-item': LibBentoItem;
  }
}