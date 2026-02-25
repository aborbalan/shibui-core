import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-tabs.component';

const meta: Meta = {
  title: 'Navigation/Tabs',
  component: 'lib-tabs',
  argTypes: {
    loading: { control: 'boolean' },
    activeTabId: { control: 'text' }
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    items: [
      { id: 'profile', label: 'Perfil' },
      { id: 'settings', label: 'Ajustes' },
      { id: 'notifications', label: 'Notificaciones', disabled: true }
    ],
    activeTabId: 'profile',
    loading: false
  },
  render: (args) => html`
    <lib-tabs 
      .items=${args.items} 
      .activeTabId=${args.activeTabId}
      ?loading=${args.loading}
    >
      <div slot="content" style="padding: 20px;">
        Contenido de la pestaña activa: <strong>${args.activeTabId}</strong>
      </div>
    </lib-tabs>
  `
};