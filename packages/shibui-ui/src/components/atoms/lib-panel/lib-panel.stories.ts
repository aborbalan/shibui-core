import { Meta, StoryObj } from '@storybook/web-components-vite'; // Importante: web-components
import { html } from 'lit';
import './lib-panel.component';

interface PanelProps {
  glass: boolean;
  headerText: string;
}

const meta: Meta<PanelProps> = {
  title: 'Surfaces/Panel',
  component: 'lib-panel',
  argTypes: {
    glass: { control: 'boolean' },
    headerText: { control: 'text' },
  },
};

export default meta;

// Aquí le pasamos PanelProps al genérico StoryObj
type Story = StoryObj<PanelProps>;

export const Default: Story = {
  args: {
    glass: false,
    headerText: 'Panel Estándar',
  },
  render: (args) => html`
    <div style="background: #f0f0f0; padding: 40px;">
      <lib-panel ?glass=${args.glass}>
        <h2 slot="header">${args.headerText}</h2>
        <p>Contenido del panel heredado de LibCard.</p>
      </lib-panel>
    </div>
  `
};

export const GlassMode: Story = {
  args: {
    glass: true,
    headerText: 'Panel de Cristal',
  },
  render: (args) => html`
    <div style="
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%); 
      padding: 40px;
    ">
      <lib-panel ?glass=${args.glass}>
        <h2 slot="header">${args.headerText}</h2>
        <p style="color: white;">Efecto cristalino sobre fondo degradado.</p>
      </lib-panel>
    </div>
  `
};