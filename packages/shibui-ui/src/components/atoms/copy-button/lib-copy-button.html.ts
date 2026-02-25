import { html, TemplateResult } from 'lit';
import { LibCopyButton } from './lib-copy-button.component';

export const copyButtonTemplate = (context: LibCopyButton, copied: boolean): TemplateResult => html`
  <button 
    class="copy-button ${copied ? 'success' : ''}" 
    @click=${context.copyToClipboard}
    aria-label="Copiar al portapapeles"
  >
    ${copied 
      ? html`<span class="icon">check</span>` // Aquí iría tu <lib-icon name="check">
      : html`<span class="icon">copy</span>`  // Aquí iría tu <lib-icon name="copy">
    }
  </button>
`;