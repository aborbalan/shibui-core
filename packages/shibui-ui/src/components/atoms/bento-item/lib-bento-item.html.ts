import { html, TemplateResult } from 'lit';
import { LibBentoItem } from './lib-bento-item.component';

export const bentoItemTemplate = (context: LibBentoItem): TemplateResult => html`
  <div 
    class="bento-item"
    style="
      --lib-bento-item-cols: ${context.cols};
      --lib-bento-item-rows: ${context.rows};
    "
  >
    <div class="content">
      <slot></slot>
    </div>
  </div>
`;