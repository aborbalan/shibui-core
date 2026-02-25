import { html, TemplateResult } from 'lit';
import { LibCloseButton } from './lib-close-button.component';

export const closeButtonTemplate = (context: LibCloseButton): TemplateResult => {
  return html`
    <button 
      type="button" 
      class="close-btn ${context.variant} ${context.size}" 
      aria-label="Cerrar"
      @click=${context.handleClick}
    >
      <lib-icon 
        name="close" 
        size=${context.size === 'lg' ? 'md' : 'sm'}
      ></lib-icon>
    </button>
  `;
};