import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bentoGridTemplate } from './lib-bento-grid.html';
import gridCss from './lib-bento-grid.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { BentoGapSize } from './lib-bento-grid.types';

/**
 * lib-bento-grid — Contenedor de rejilla tipo bento
 *
 * @prop columns    — Número de columnas (default 4)
 * @prop gap        — Espacio entre celdas: 'xs'|'sm'|'md'(default)|'lg'|'xl'
 * @prop row-height — Altura base de cada fila (default '150px')
 *
 * @slot — lib-bento-item elements
 */
@customElement('lib-bento-grid')
export class LibBentoGrid extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(gridCss)}`,
  ];

  @property({ type: Number })
  columns = 4;

  @property({ type: String })
  gap: BentoGapSize = 'md';

  @property({ type: String, attribute: 'row-height' })
  rowHeight = '150px';

  protected override render(): TemplateResult {
    return bentoGridTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-bento-grid': LibBentoGrid;
  }
}