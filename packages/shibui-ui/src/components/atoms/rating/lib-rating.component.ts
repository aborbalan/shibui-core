import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import ratingStyles from './lib-rating.css?inline';

@customElement('lib-rating')
export class LibRating extends LitElement {
  static override styles = [css`${unsafeCSS(ratingStyles)}` || []];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 5;
  @property({ type: Boolean, reflect: true }) readonly = false;

  @state() private _hoverValue = 0;

  private _handleMouseMove(index: number):void {
    if (this.readonly) return;
    this._hoverValue = index;
  }

  private _handleMouseLeave():void {
    this._hoverValue = 0;
  }

  private _handleClick(index: number):void {
    if (this.readonly) return;
    this.value = index;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  override render(): TemplateResult {
    const stars = [];
    for (let i = 1; i <= this.max; i++) {
      const isActive = i <= (this._hoverValue || this.value);
      stars.push(html`
        <span 
          class="star ${isActive ? 'active' : ''}"
          @mousemove=${():void => this._handleMouseMove(i)}
          @click=${():void => this._handleClick(i)}
          role="button"
          aria-label="Puntuar ${i} de ${this.max}"
        >
          ★
        </span>
      `);
    }

    return html`
      <div class="rating-container" @mouseleave=${this._handleMouseLeave}>
        ${stars}
      </div>
    `;
  }
}