import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-empty-state.component';

const meta: Meta = {
  title: 'Display/Empty State', // Clasificación funcional para Storybook
  component: 'lib-empty-state',
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    title: 'No hay mensajes',
    description: 'Tu bandeja de entrada está limpia. ¡Buen trabajo!'
  },
  render: (args) => html`
    <lib-empty-state .title=${args.title} .description=${args.description}>
      <button slot="actions" style="padding: 8px 16px; background: #3182ce; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Nueva búsqueda
      </button>
    </lib-empty-state>
  `
};