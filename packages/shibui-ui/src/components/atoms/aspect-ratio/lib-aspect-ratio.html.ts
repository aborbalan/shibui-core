import { html, TemplateResult } from 'lit';

export const aspectRatioTemplate = (): TemplateResult => {
  return html`
    <div class="aspect-ratio-container">
      <slot></slot>
    </div>
  `;
};