import { html, TemplateResult } from 'lit';
import { LibList } from './lib-list.component';

export const listTemplate = (context: LibList): TemplateResult => {
  return html`
    <div class="list-container">
      ${context.renderBase()}
    </div>
  `;
};