import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import accordionItemStyles from './lib-accordion-item.css?inline';

@customElement('lib-accordion-item')
export class LibAccordionItem extends LitElement {
  static override styles = [css`${unsafeCSS(accordionItemStyles)}` || []];

  @property({ type: String }) label = 'Accordion Item';
  @property({ type: Boolean, reflect: true }) open = false;

  private _handleToggle(): void {
    this.open = !this.open;
    
    // Emitimos el evento para la futura orquestación del organismo
    this.dispatchEvent(new CustomEvent('accordion-toggle', {
      bubbles: true,
      composed: true,
      detail: { open: this.open }
    }));
  }

  override render(): TemplateResult {
    return html`
      <div class="accordion-item" ?data-open=${this.open}>
        <button 
          class="header" 
          @click=${this._handleToggle}
          aria-expanded="${this.open}"
          type="button"
        >
          <span class="label">${this.label}</span>
          <span class="icon" aria-hidden="true">▼</span>
        </button>
        <div class="content-wrapper">
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-accordion-item': LibAccordionItem;
  }
}