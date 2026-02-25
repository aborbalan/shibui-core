import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import progressStyles from './lib-progress.css?inline';

@customElement('lib-progress')
export class LibProgress extends LitElement {
  static override styles = [css`${unsafeCSS(progressStyles)}` || []];

  @property({ type: Number }) value = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) showValue = false;
  @property({ type: String }) label = '';

  override render(): TemplateResult {
    const percentage = this.indeterminate ? 100 : Math.min(Math.max((this.value / this.max) * 100, 0), 100);

    return html`
      <div 
        class="progress-wrapper"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="${this.max}"
        aria-valuenow="${this.indeterminate ? undefined : this.value}"
        aria-label="${this.label}"
      >
        <div class="track">
          <div class="bar" style="width: ${percentage}%"></div>
        </div>
        ${this.showValue && !this.indeterminate 
          ? html`<span class="value-label">${Math.round(percentage)}%</span>` 
          : ''}
      </div>
    `;
  }
}