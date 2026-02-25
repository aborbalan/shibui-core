import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-drawer.component';
import { LibDrawer } from './lib-drawer.component';

const meta: Meta = {
  title: 'Organisms/Drawer',
  component: 'lib-drawer',
  argTypes: {
    open: { control: 'boolean' },
    placement: { control: 'select', options: ['left', 'right'] },
  }
};

export default meta;

export const Interactive: StoryObj = {
  args: { 
    open: false, 
    placement: 'right', 
    label: 'Configuración de Usuario' 
  },
  render: (args) => {
    const toggleDrawer = ():void => {
      const drawer = document.querySelector('lib-drawer') as LibDrawer;
      if (drawer) {
        drawer.open = !drawer.open;
      }
    };

    return html`
      <div style="height: 400px; display: flex; align-items: center; justify-content: center; background: #f0f2f5;">
        <button 
          @click=${toggleDrawer}
          style="padding: 12px 24px; background: #3182ce; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;"
        >
          Abrir Panel Lateral
        </button>

        <lib-drawer 
          .open=${args.open} 
          .placement=${args.placement} 
          .label=${args.label}
          @close=${():void => { args.open = false; }} 
        >
          <p>¡Ahora sí! El panel debería deslizarse correctamente desde el lateral.</p>
          <div slot="footer">
            <button @click=${toggleDrawer} style="width: 100%; padding: 10px; cursor: pointer;">Entendido</button>
          </div>
        </lib-drawer>
      </div>
    `;
  }
};