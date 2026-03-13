import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite'; // Importación necesaria
import './lib-bento-item.component';

// 1. Definimos la metadata del componente (Meta)
const meta: Meta = {
  title: 'Components/Atoms/Bento Item',
  component: 'lib-bento-item',
  argTypes: {
    cols: { control: 'number', description: 'Columnas que ocupa' },
    rows: { control: 'number', description: 'Filas que ocupa' },
    interactive: { control: 'boolean', description: 'Efectos de hover' },
  },
  // Tag obligatorio según nuestro protocolo para auto-generar tablas de API [cite: 41, 57]
  tags: ['autodocs'], 
};

export default meta;

// 2. Definimos el tipo para nuestras historias
type Story = StoryObj;

// 3. Creamos la historia base
export const Default: Story = {
  args: {
    cols: 2,
    rows: 1,
    interactive: true,
  },
  render: (args) => html`
    <div style="
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 16px; 
      width: 100%; 
      max-width: 800px; 
      background: var(--bg-surface); 
      padding: 40px;
      border-radius: var(--radius-lg);
    ">
      <lib-bento-item 
        .cols=${args.cols} 
        .rows=${args.rows} 
        ?interactive=${args.interactive}
      >
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <h3 style="margin: 0; font-family: var(--lib-font-display);">Shibui Bento</h3>
          <p style="margin: 0; font-size: var(--text-sm); color: var(--text-secondary);">
            Elegancia discreta en cada celda.
          </p>
        </div>
      </lib-bento-item>
    </div>
  `,
};