import { html, nothing, TemplateResult } from 'lit';
import { LibFormField } from './lib-form-field.component';

export const formFieldTemplate = (context: LibFormField): TemplateResult => html`
  <div class="form-field-container">
    ${context.label 
      ? html`<label class="label ${context.required ? 'required' : ''}">${context.label}</label>` 
      : nothing}
    
    <div class="input-wrapper">
      <slot></slot>
    </div>

    ${context.error && context.errorText
      ? html`<span class="error-text">${context.errorText}</span>`
      : context.helperText 
        ? html`<span class="helper-text">${context.helperText}</span>` 
        : nothing}
  </div>
`;