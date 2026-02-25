import { html, TemplateResult } from 'lit';
import { LibDialog } from './lib-dialog.component';

export const htmlTemplate = (context: LibDialog): TemplateResult => html`
  <dialog id="lib-dialog" @cancel="${context.handleCancel}">
    <div class="dialog-container">
      <header class="dialog-header">
        <slot name="header">
          <strong>${context.title}</strong>
        </slot>
        <button class="close-btn" @click="${context.close}">×</button>
      </header>

      <div class="dialog-content">
        <slot></slot>
      </div>

      <footer class="dialog-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </dialog>
`;