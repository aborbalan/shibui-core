import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-dialog.component';
import '../../atoms/button/lib-button.component'; // Asumo la ruta de tus botones
import '../../atoms/icon/lib-icon.component';     // Asumo la ruta de tus iconos

interface DialogArgs {
  title: string;
  open: boolean;
}

const meta: Meta<DialogArgs> = {
  title: 'Feedback/Dialog',
  component: 'lib-dialog',
  argTypes: {
    title: { control: 'text' },
    open: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<DialogArgs>;

// Helper para manejar la apertura desde la Story
const toggleDialog = (id: string, open: boolean): void => {
    // Moldeamos a un tipo que extienda HTMLElement con la propiedad open
    const dialog = document.getElementById(id) as HTMLElement & { open: boolean };
    if (dialog) {
      dialog.open = open;
    }
  };

  export const Default: Story = {
    render: (args: DialogArgs): TemplateResult => html`
      <div>
        <lib-button @click="${(): void => toggleDialog('modal-1', true)}">
          Abrir Modal Simple
        </lib-button>
  
        <lib-dialog 
          id="modal-1" 
          .title="${args.title}" 
          ?open="${args.open}"
          @close="${(): void => console.log('Modal cerrado')}"
        >
          <p>Contenido...</p>
          
          <div slot="footer">
            <lib-button @click="${(): void => toggleDialog('modal-1', false)}" type="secondary">
              Cancelar
            </lib-button>
          </div>
        </lib-dialog>
      </div>
    `,
    args: {
      title: 'Información del Sistema',
      open: false,
    },
  };

export const SearchError: Story = {
  render: ():TemplateResult => html`
    <div>
      <lib-button @click="${():void => toggleDialog('modal-error', true)}" style="--lib-button-bg: #ef4444;">
        Simular Error de Búsqueda
      </lib-button>

      <lib-dialog id="modal-error" title="Error de Búsqueda">
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
          <lib-icon name="warning-circle" size="48" style="color: #ef4444;"></lib-icon>
          <div>
            <h3 style="margin: 0; color: #1f2937;">No se encontraron resultados</h3>
            <p style="color: #6b7280; margin-top: 8px;">
              Lo sentimos, la búsqueda "Zapatillas de cristal" no devolvió ningún producto. 
              Prueba con términos más generales.
            </p>
          </div>
        </div>

        <div slot="footer" style="width: 100%;">
          <lib-button @click="${():void => toggleDialog('modal-error', false)}" style="width: 100%;">
            Entendido
          </lib-button>
        </div>
      </lib-dialog>
    </div>
  `,
};