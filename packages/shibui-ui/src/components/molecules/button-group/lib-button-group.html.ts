import { html, TemplateResult } from 'lit';

export const buttonGroupTemplate = (): TemplateResult => html`
  <div 
    class="button-group" 
    role="group" 
    aria-label="Grupo de botones"
  >
    <slot></slot>
  </div>
`;