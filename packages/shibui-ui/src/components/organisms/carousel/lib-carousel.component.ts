import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, query, queryAssignedElements } from 'lit/decorators.js';
import carouselStyles from './lib-carousel.css?inline';

@customElement('lib-carousel')
export class LibCarousel extends LitElement {
  static override styles = [css`${unsafeCSS(carouselStyles)}` || []];

  @property({ type: Boolean, reflect: true }) arrows = true;

  @query('.track') _track!: HTMLElement;
  @queryAssignedElements({ slot: '' }) _slides!: Array<HTMLElement>;

  private _scroll(direction: 'prev' | 'next'):void {
    // Usamos el ancho visible del contenedor para un scroll preciso
    const scrollAmount = this._track.clientWidth; 
    
    this._track.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  }

  override render(): TemplateResult {
    return html`
      <div class="carousel-wrapper">
        ${this.arrows ? html`
          <button class="nav-button prev" @click=${():void => this._scroll('prev')} aria-label="Anterior">‹</button>
        ` : ''}

        <div class="track">
          <slot></slot>
        </div>

        ${this.arrows ? html`
          <button class="nav-button next" @click=${():void => this._scroll('next')} aria-label="Siguiente">›</button>
        ` : ''}
      </div>
    `;
  }
}