import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit'; // Importamos el tipo
import { customElement } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import sidebarStyles from './lib-sidebar.css?inline';

@customElement('lib-sidebar')
export class LibSidebar extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(sidebarStyles)}
    `,
  ];

  protected override render(): TemplateResult {
    // Tipo de retorno añadido
    return html`
      <div class="sidebar-wrapper">
        <slot></slot>
      </div>
    `;
  }
}
