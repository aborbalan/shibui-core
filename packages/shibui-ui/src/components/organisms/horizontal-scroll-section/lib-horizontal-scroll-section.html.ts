import { html, TemplateResult } from 'lit';
import type { LibHorizontalScrollSection } from './lib-horizontal-scroll-section.component';

export function horizontalScrollTemplate(ctx: LibHorizontalScrollSection): TemplateResult {
  return html`
    <div class="sticky-wrapper" part="wrapper">

      <div class="horizontal-content" part="content">
        <slot></slot>
      </div>

      <div class="progress-bar" part="progress-bar" ?hidden="${!ctx.showProgress}">
        <div class="progress-fill" part="progress-fill"></div>
      </div>

      <span class="counter" part="counter" ?hidden="${!ctx.showProgress}">
        0%
      </span>

    </div>
  `;
}