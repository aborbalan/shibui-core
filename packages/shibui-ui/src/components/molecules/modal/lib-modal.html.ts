import { html, TemplateResult } from 'lit';
import { LibModal } from './lib-modal.component';
import '../../atoms/close-button/lib-close-button.component';

export const modalTemplate = (context: LibModal): TemplateResult => {
  return html`
    <dialog 
      id="modal-container"
      class="modal ${context.size}"
      @cancel=${context.handleCancel}
      @click=${context.handleBackdropClick}
    >
      <div class="modal-content" @click=${(e: Event):void => e.stopPropagation()}>
        <header class="modal-header">
          <slot name="header">
            <h2 class="modal-title">${context.title}</h2>
          </slot>
          <lib-close-button 
            variant="ghost" 
            size="md"
            @lib-close=${context.close}
          ></lib-close-button>
        </header>

        <section class="modal-body">
          <slot></slot>
        </section>

        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </dialog>
  `;
};