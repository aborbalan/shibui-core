import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import cardStyles from './lib-card.css?inline';

@customElement('lib-card')
export class LibCard extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(cardStyles)}
    `,
  ];

  protected override render(): TemplateResult {
    // Tipo de retorno añadido
    return html`
      <div class="card-header">
        <slot name="header"></slot>
      </div>
      <div class="card-content">
        <slot></slot>
      </div>
    `;
  }
}
