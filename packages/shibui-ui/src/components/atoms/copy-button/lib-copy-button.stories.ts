import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-copy-button.component';
// Importamos el input para el ejemplo de integración
import '../../molecules/input/lib-input.component'; 

const meta: Meta = {
  title: 'Forms/Copy Button',
  component: 'lib-copy-button',
  argTypes: {
    value: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>Copiar código: <code>${args.value}</code></span>
      <lib-copy-button .value=${args.value} .size=${args.size}></lib-copy-button>
    </div>
  `,
  args: {
    value: 'NPM_TOKEN_748293',
    size: 'md',
  },
};

export const InputIntegration: StoryObj = {
  render: () => {
    const apiToken = 'sk-ant-api03-abcdef123456';
    return html`
      <div style="max-width: 400px;">
        <p style="font-family: sans-serif; font-size: 14px; margin-bottom: 8px;">API Key</p>
        <div style="display: flex; gap: 4px;">
          <lib-input 
            style="flex: 1;" 
            value=${apiToken} 
            readonly
          ></lib-input>
          
          <lib-copy-button .value=${apiToken}></lib-copy-button>
        </div>
      </div>
    `;
  },
};

export const Gallery: StoryObj = {
  render: () => html`
    <div style="display: grid; gap: 20px;">
      <div>
        <p>Tamaño pequeño (sm)</p>
        <lib-copy-button value="Pequeño" size="sm"></lib-copy-button>
      </div>
      <div>
        <p>Tamaño medio (md)</p>
        <lib-copy-button value="Mediano" size="md"></lib-copy-button>
      </div>
    </div>
  `,
};