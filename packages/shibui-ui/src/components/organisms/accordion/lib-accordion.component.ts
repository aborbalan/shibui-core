import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import accordionStyles from './lib-accordion.css?inline';
import { LibAccordionItem } from '../../atoms/accordion-item/lib-accordion-item.component';

@customElement('lib-accordion')
export class LibAccordion extends LitElement {
  static override styles = [css`${unsafeCSS(accordionStyles)}` || []];

  /**
   * Si es true, solo un ítem puede estar abierto a la vez.
   */
  @property({ type: Boolean }) exclusive = false;

  /**
   * Maneja el evento disparado por los hijos
   */
  private _handleToggle(e: Event): void {
    if (!this.exclusive) return;

    const target = e.target as LibAccordionItem;
    
    // Si el ítem se ha abierto, cerramos todos los demás
    if (target.open) {
      const items = Array.from(this.querySelectorAll('lib-accordion-item')) as LibAccordionItem[];
      items.forEach(item => {
        if (item !== target) {
          item.open = false;
        }
      });
    }
  }

  override render(): TemplateResult {
    return html`
      <div class="accordion-group" @accordion-toggle=${this._handleToggle}>
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-accordion': LibAccordion;
  }
}