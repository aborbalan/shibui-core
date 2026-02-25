import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import emptyStateStyles from './lib-empty-state.css?inline';

@customElement('lib-empty-state')
export class LibEmptyState extends LitElement {
  static override styles = [css`${unsafeCSS(emptyStateStyles)}` || []];

  @property({ type: String }) override title = 'No hay datos';
  @property({ type: String }) description = 'Parece que no hay nada que mostrar aquí.';

  override render(): TemplateResult {
    return html`
      <div class="empty-state">
        <div class="media">
          <slot name="media">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </slot>
        </div>
        <h3 class="title">${this.title}</h3>
        <p class="description">${this.description}</p>
        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </div>
    `;
  }
}