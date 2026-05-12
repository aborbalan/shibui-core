import { html, TemplateResult } from 'lit';
import { RippleEffect } from './lib-ripple.component';

export const rippleTemplate = (ripples: RippleEffect[]): TemplateResult => {
  return html`
    ${ripples.map(r => html`
      <span class="ripple" style="
        width: ${r.size}px;
        height: ${r.size}px;
        left: ${r.x}px;
        top: ${r.y}px;
      "></span>
    `)}
  `;
};