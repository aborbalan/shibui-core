import { html, TemplateResult } from 'lit';
import { LibBentoGrid } from './lib-bento-grid.component';

export const bentoGridTemplate = (context: LibBentoGrid): TemplateResult => html`
  <div 
    class="bento-grid"
    style="
      --lib-bento-columns: ${context.columns};
      --lib-bento-gap: var(--lib-space-${context.gap});
      --lib-bento-row-height: ${context.rowHeight};
    "
    role="presentation"
  >
    <slot></slot>
  </div>
`;