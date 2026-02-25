import { html, TemplateResult } from 'lit';
import { LibSpinner } from './lib-spinner.component';

export const spinnerTemplate = (context: LibSpinner): TemplateResult => html`
  <div 
    class="spinner size-${context.size} variant-${context.variant}"
    role="status"
    aria-label="Cargando"
  ></div>
`;