import { html, TemplateResult, nothing } from 'lit';
import { LibStatusDot } from './lib-status-dot.component';

export const statusDotTemplate = (context: LibStatusDot): TemplateResult => html`
  <div class="status-dot-container" title="${context.label || context.variant}">
    <span class="dot"></span>
    ${context.pulse ? html`<span class="pulse"></span>` : nothing}
  </div>
`;