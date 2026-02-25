import { html, TemplateResult } from 'lit';
import { LibTabs } from './lib-tabs.component';

export const tabsTemplate = (context: LibTabs): TemplateResult => {
  return html`
    <div class="tabs-container">
      <div role="tablist" class="tabs-header">
        ${context.renderBase()}
      </div>

      <div class="tabs-content" role="tabpanel">
        <slot name="content"></slot>
      </div>
    </div>
  `;
};