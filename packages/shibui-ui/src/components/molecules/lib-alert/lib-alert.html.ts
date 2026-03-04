import { html, TemplateResult } from 'lit';
import type { LibAlert } from './lib-alert.component'; // <--- IMPORTANTE: 'import type'
import '../../atoms/icon/lib-icon.component'; 

export const template = (context: LibAlert): TemplateResult => {
  const iconMap: Record<string, string> = {
    info: 'info',
    success: 'check-circle',
    warning: 'warning-circle',
    error: 'x-circle'
  };

  return html`
    <div class="alert-container" role="alert" aria-live="polite">
      <div class="alert-icon-wrapper">
        <lib-icon name="${iconMap[context.type] || 'info'}"></lib-icon>
      </div>
      
      <div class="alert-content">
        <slot></slot>
      </div>

      ${context.closable 
        ? html`
            <button class="close-button" @click="${context.handleClose}" aria-label="Cerrar alerta">
              <lib-icon name="x"></lib-icon>
            </button>
          ` 
        : ''}
    </div>
  `;
};