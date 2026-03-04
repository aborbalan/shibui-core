import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import styles from './lib-bento-grid.css?inline';
import { bentoGridTemplate } from './lib-bento-grid.html';

export type BentoGapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@customElement('lib-bento-grid')
export class LibBentoGrid extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Número de columnas de la rejilla */
  @property({ type: Number }) columns: number = 4;

  /** Tamaño del gap basado en los tokens de aire */
  @property({ type: String }) gap: BentoGapSize = 'md';

  /** Altura base de cada fila (ej: '150px', '20rem') */
  @property({ type: String }) rowHeight: string = '150px';

  protected override render(): TemplateResult {
    return bentoGridTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-bento-grid': LibBentoGrid;
  }
}