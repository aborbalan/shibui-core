import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-button-group.component';
import '../../atoms/button/lib-button.component'; // Asegúrate de que la ruta sea correcta

const meta: Meta = {
  title: 'Navigation/Button Group',
  component: 'lib-button-group',
  argTypes: {
    vertical: { control: 'boolean' }
  }
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <lib-button-group ?vertical=${args.vertical}>
      <lib-button variant="secondary">Izquierda</lib-button>
      <lib-button variant="secondary">Centro</lib-button>
      <lib-button variant="primary">Derecha</lib-button>
    </lib-button-group>
  `
};