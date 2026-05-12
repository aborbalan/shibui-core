import { html, TemplateResult } from 'lit';
import type { LibParallaxTextStack } from './lib-parallax-text-stack.component';

export function parallaxTextStackTemplate(ctx: LibParallaxTextStack): TemplateResult {
  return html`
    <div class="pts-container" part="container">
      ${ctx.lines.map((line, i) => html`
        <span
          class="pts-layer ${i % 2 === 0 ? 'pts-layer--outline' : 'pts-layer--italic'}"
          part="layer layer-${i % 2 === 0 ? 'outline' : 'italic'}"
          aria-hidden="${i > 0}"
        >${line}</span>
      `)}
    </div>
  `;
}