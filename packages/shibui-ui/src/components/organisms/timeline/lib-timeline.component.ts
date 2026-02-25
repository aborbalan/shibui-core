import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('lib-timeline')
export class LibTimeline extends LitElement {
  static override styles = css`
    :host {
      display: block;
      padding: 16px 0;
    }
    .timeline-wrapper {
      display: flex;
      flex-direction: column;
    }
  `;

  override render(): TemplateResult {
    return html`
      <div class="timeline-wrapper" role="list">
        <slot></slot>
      </div>
    `;
  }
}