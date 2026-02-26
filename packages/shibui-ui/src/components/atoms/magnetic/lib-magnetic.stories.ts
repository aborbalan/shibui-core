import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-magnetic.component';
import '../button/lib-button.component'; // Asegúrate de que esta ruta sea correcta

const meta: Meta = {
  title: 'Components/Atoms/Magnetic',
  component: 'lib-magnetic',
  argTypes: {
    shift: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
      <lib-magnetic .shift=${args.shift}>
        <lib-button variant="primary">¡Acércate!</lib-button>
      </lib-magnetic>
    </div>
  `,
};