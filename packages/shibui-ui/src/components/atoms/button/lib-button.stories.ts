import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite'; 
import './lib-button.component';

const meta: Meta = {
  title: 'Forms/Button',
  component: 'lib-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;

// 1. Galería de Variantes: Para ver todas de un vistazo
export const AllVariants: StoryObj = {
  render: (args) => html`
    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
      <lib-button .size=${args.size} variant="primary">Primary</lib-button>
      <lib-button .size=${args.size} variant="secondary">Secondary</lib-button>
      <lib-button .size=${args.size} variant="danger">Danger</lib-button>
      <lib-button .size=${args.size} variant="ghost">Ghost</lib-button>
    </div>
  `
};

// 2. Con Iconos (Aprovechando tus slots prefix/suffix)
export const WithIcons: StoryObj = {
  render: (args) => html`
    <div style="display: flex; gap: 15px;">
      <lib-button .size=${args.size} variant="primary">
        <span slot="prefix">🔥</span>
        Boton con prefijo
      </lib-button>
      <lib-button .size=${args.size} variant="secondary">
        Boton con sufijo
        <span slot="suffix">🚀</span>
      </lib-button>
    </div>
  `
};

// 3. Comportamiento en Bloque (Full Width)
export const FullWidthExample: StoryObj = {
  render: () => html`
    <div style="width: 300px; border: 1px dashed #ccc; padding: 20px;">
      <p style="margin-bottom: 10px; font-size: 12px; color: #666;">Contenedor de 300px</p>
      <lib-button variant="primary" style="width: 100%;">
        Botón Expandido
      </lib-button>
    </div>
  `
};

export const GlassOverride: StoryObj = {
  args: {
    glass: true,
    label: 'Botón de Cristal',
    size: 'md',
  },
  render: (args) => html`
    <div style="
      background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);
      padding: 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      border-radius: 16px;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        width: 100px;
        height: 100px;
        background: rgba(255,255,255,0.4);
        border-radius: 50%;
        top: 20%;
        left: 30%;
        z-index: 0;
      "></div>

      <lib-button 
        ?glass=${args.glass} 
        .size=${args.size}
        style="z-index: 1;"
      >
        ${args.label}
      </lib-button>

      <p style="color: #004d4d; font-size: 12px; z-index: 1;">
        El botón debería ignorar el color de la variante y ser 100% cristalino.
      </p>
    </div>
  `
};