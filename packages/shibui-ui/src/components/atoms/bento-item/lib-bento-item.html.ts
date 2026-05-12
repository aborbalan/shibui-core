import { html, TemplateResult } from 'lit';
import type { LibBentoItem } from './lib-bento-item.component';

export function bentoItemTemplate(_ctx: LibBentoItem): TemplateResult {
  return html`
    <div class="bento-item" part="item">
      <div class="content" part="content">
        <slot></slot>
      </div>
    </div>
  `;
}