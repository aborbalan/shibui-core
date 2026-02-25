import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-modal.component';
// Importamos la clase para el tipado
import { LibModal } from './lib-modal.component';

const meta: Meta = {
  title: 'Feedback/Modal',
  component: 'lib-modal',
  // ... resto de la config
};

export default meta;

export const Default: StoryObj = {
  render: (args) => {
    // Función con tipado estricto
    const toggleModal = (isOpen: boolean):void => {
      const modal = document.querySelector<LibModal>('lib-modal');
      if (modal) {
        modal.open = isOpen;
      }
    };

    return html`
      <button @click=${():void => toggleModal(true)}>Abrir Modal</button>

      <lib-modal 
        .title=${args.title} 
        ?open=${args.open} 
        .size=${args.size}
        @modal-closed=${():void => {
          // Sincronizamos el estado si se cierra desde la X o ESC
          args.open = false;
        }}
      >
        <p>Contenido del modal con tipado estricto.</p>
        
        <div slot="footer">
          <button @click=${():void => toggleModal(false)}>Cancelar</button>
        </div>
      </lib-modal>
    `;
  }
};