import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import timelineStyles from './lib-timeline.css?inline';

@customElement('lib-timeline-item')
export class LibTimelineItem extends LitElement {
  static override styles = [css`${unsafeCSS(timelineStyles)}` || []];

  @property({ type: String }) icon = 'circle';
  @property({ type: String }) variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' = 'primary';
  @property({ type: String }) timestamp = '';
  @property({ type: Boolean, reflect: true }) last = false;

  override render(): TemplateResult {
    return html`
      <div class="timeline-item">
        <div class="timeline-left">
          <div class="marker-container variant-${this.variant}">
            <lib-icon .name="${this.icon}" size="sm"></lib-icon>
          </div>
          ${!this.last ? html`<div class="connector"></div>` : ''}
        </div>
        <div class="timeline-content">
          ${this.timestamp ? html`<span class="timestamp">${this.timestamp}</span>` : ''}
          <div class="body">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}