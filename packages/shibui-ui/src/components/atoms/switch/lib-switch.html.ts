import { html, TemplateResult } from 'lit';
import { LibSwitch } from './lib-switch.component';

export const htmlTemplate = (context: LibSwitch): TemplateResult => html`
  <label class="switch">
    <input 
      type="checkbox" 
      ?checked="${context.checked}" 
      ?disabled="${context.disabled}"
      @change="${context.handleToggle}"
    >
    <span class="slider"></span>
    ${context.label ? html`<span class="label-text">${context.label}</span>` : ''}
  </label>
`;