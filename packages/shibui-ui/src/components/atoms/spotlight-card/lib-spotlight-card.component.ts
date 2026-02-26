import { LitElement, html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import styles from './lib-spotlight-card.css?inline';

@customElement('lib-spotlight-card')
export class LibSpotlightCard extends LitElement {
  static override styles = unsafeCSS(styles);

  @query('.spotlight-card') _card!: HTMLElement;

  override render(): TemplateResult {
    return html`
      <div 
        class="spotlight-card"
        @mousemove=${this._handleMouseMove}
      >
        <div class="content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  private _handleMouseMove(e: MouseEvent): void {
    const { left, top } = this.getBoundingClientRect();
    
    // Calculamos la posición del ratón relativa a la tarjeta
    const x = e.clientX - left;
    const y = e.clientY - top;

    // Pasamos los valores al CSS
    this._card.style.setProperty('--mouse-x', `${x}px`);
    this._card.style.setProperty('--mouse-y', `${y}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-spotlight-card': LibSpotlightCard;
  }
}