import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-tooltip.component';

/**
 * Interfaz para los argumentos del Tooltip
 */
interface TooltipArgs {
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  slotContent: string;
}

const meta: Meta<TooltipArgs> = {
  title: 'Feedback/Tooltip', // Categoría funcional
  component: 'lib-tooltip',
  argTypes: {
    content: { 
      control: 'text',
      description: 'Texto que se muestra dentro del globo' 
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Posición del globo respecto al elemento'
    },
  },
};

export default meta;
type Story = StoryObj<TooltipArgs>;

// Función de renderizado compartida para evitar errores de tipo y duplicidad
const renderTemplate = (args: TooltipArgs): TemplateResult => html`
  <div style="display: flex; justify-content: center; align-items: center; min-height: 200px; padding: 100px;">
    <lib-tooltip .content=${args.content} .position=${args.position}>
      <button style="padding: 12px 24px; cursor: pointer; border-radius: 6px; border: 1px solid #cbd5e0; background: white;">
        ${args.slotContent}
      </button>
    </lib-tooltip>
  </div>
`;

export const Default: Story = {
  args: {
    content: 'Este es un mensaje de ayuda',
    position: 'top',
    slotContent: 'Pasa el ratón'
  },
  render: (args) => renderTemplate(args),
};

export const Bottom: Story = {
  args: {
    ...Default.args,
    position: 'bottom',
    content: 'Tooltip en la parte inferior',
  },
  render: (args) => renderTemplate(args),
};

export const LongText: Story = {
  args: {
    ...Default.args,
    content: 'Este es un texto mucho más largo para probar cómo se comporta el globo cuando hay mucha información.',
    slotContent: 'Texto largo'
  },
  render: (args) => renderTemplate(args),
};