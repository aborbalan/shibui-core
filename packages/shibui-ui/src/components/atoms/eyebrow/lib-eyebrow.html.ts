import { html, type TemplateResult, nothing } from 'lit';
import type { LibEyebrow } from './lib-eyebrow.component';

export function renderEyebrow(ctx: LibEyebrow): TemplateResult {
  return html`
    <span class="eb" part="base">
      <slot></slot>
      ${ctx.num
        ? html`<span class="eb-num-badge" part="badge">${ctx.num}</span>`
        : nothing
      }
    </span>
  `;
}