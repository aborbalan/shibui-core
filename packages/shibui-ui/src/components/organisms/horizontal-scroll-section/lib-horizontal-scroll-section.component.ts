import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import styles from './lib-horizontal-scroll-section.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';

@customElement('lib-horizontal-scroll-section')
export class LibHorizontalScrollSection extends LitElement {

  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(styles)}`,
  ];

  @query('.horizontal-content') _content!: HTMLElement;
  @query('.progress-fill') _progress!: HTMLElement;
  @query('.counter') _counter!: HTMLElement;

  private _onScroll = (): void => {
    const rect = this.getBoundingClientRect();
    const scrollDistance = -rect.top;
    const scrollHeight = rect.height - window.innerHeight;
    
    if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
      const progress = Math.min(Math.max(scrollDistance / scrollHeight, 0), 1);
      const maxMove = this._content.scrollWidth - window.innerWidth + (window.innerWidth * 0.2); // 0.2 es por el padding
      
      this._content.style.transform = `translateX(-${progress * maxMove}px)`;
      this._progress.style.width = `${progress * 100}%`;
      this._counter.innerText = `${Math.round(progress * 100)}%`;
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this._onScroll);
  }

  override disconnectedCallback(): void {
    window.removeEventListener('scroll', this._onScroll);
    super.disconnectedCallback();
  }

  protected override render(): TemplateResult {
    return html`
      <div class="sticky-wrapper">
        <div class="horizontal-content">
          <slot></slot>
        </div>
        
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        <div class="counter">0%</div>
      </div>
    `;
  }
}