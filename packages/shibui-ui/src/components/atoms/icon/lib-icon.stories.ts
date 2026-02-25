import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite'; // Usamos el paquete de vite para evitar errores de renderer
import './lib-icon.component';
import { ICON_REGISTRY } from '../../../shared/icons/icon-registry';

// 1. Definimos la interfaz de argumentos para eliminar el 'any'
interface IconStoryArgs {
  size: string;
  color: string;
}

const meta: Meta<IconStoryArgs> = {
  title: 'Display/Icon',
  component: 'lib-icon',
  argTypes: {
    size: { 
      control: 'select', 
      options: ['sm', 'md', 'lg', 'xl'] 
    },
    color: { control: 'color' }
  }
};

export default meta;

export const Gallery: StoryObj<IconStoryArgs> = {
    render: (args: IconStoryArgs): TemplateResult => html`
      <style>
        /* Estilos para recuperar las cards */
        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 16px;
          padding: 24px;
          font-family: sans-serif;
        }
        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #e1e4e8;
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .icon-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border-color: #007aff;
        }
        .icon-name {
          margin-top: 12px;
          font-size: 11px;
          color: #586069;
          font-weight: 500;
          text-align: center;
          word-break: break-all;
        }
      </style>
  
      <div class="icon-grid">
        ${Object.keys(ICON_REGISTRY).map((iconName: string): TemplateResult => html`
          <div class="icon-item">
            <lib-icon 
              .name="${iconName}" 
              size="${args.size || 'md'}" 
              style="color: ${args.color || 'currentColor'}"
            ></lib-icon>
            <span class="icon-name">${iconName}</span>
          </div>
        `)}
      </div>
    `,
    args: {
      size: 'md',
      color: '#333333'
    }
  };