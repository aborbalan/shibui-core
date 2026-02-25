import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import progressCircleStyles from './lib-progress-circle.css?inline';

@customElement('lib-progress-circle')
export class LibProgressCircle extends LitElement {
  static override styles = [css`${unsafeCSS(progressCircleStyles)}` || []];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) size = 80;
  @property({ type: Number }) strokeWidth = 8;

  override render(): TemplateResult {
    const radius = (this.size - this.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (this.value / this.max) * circumference;

    return html`
      <div class="progress-container" style="width: ${this.size}px; height: ${this.size}px;">
        <svg width="${this.size}" height="${this.size}">
          <circle
            class="track"
            cx="${this.size / 2}"
            cy="${this.size / 2}"
            r="${radius}"
            stroke-width="${this.strokeWidth}"
          />
          <circle
            class="indicator"
            cx="${this.size / 2}"
            cy="${this.size / 2}"
            r="${radius}"
            stroke-width="${this.strokeWidth}"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${offset}"
            stroke-linecap="round"
          />
        </svg>
        <div class="label">
          <slot>${Math.round((this.value / this.max) * 100)}%</slot>
        </div>
      </div>
    `;
  }
}