import { html, TemplateResult } from 'lit';
import type { LibBentoGrid } from './lib-bento-grid.component';

export function bentoGridTemplate(ctx: LibBentoGrid): TemplateResult {
  return html`
    <div
      class="bento-grid"
      part="grid"
      role="presentation"
      style="
        --_columns: ${ctx.columns};
        --_gap: var(--lib-space-${ctx.gap});
        --_row-height: ${ctx.rowHeight};
      "
    >
      <slot></slot>
    </div>
  `;
}