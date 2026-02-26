import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-button.component';
import type { LibButton } from './lib-button.component';

// Definimos los argumentos que acepta la historia, incluyendo el contenido del slot
type LibButtonStoryArgs = LibButton & { slotContent?: string | TemplateResult };

const meta: Meta<LibButtonStoryArgs> = {
  title: 'Components/Atoms/Button',
  component: 'lib-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger', 'ghost', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    glass: { control: 'boolean' },
  },
  // Tipamos el retorno como TemplateResult para evitar el error de ESLint
  render: (args): TemplateResult => html`
    <lib-button 
      .variant=${args.variant} 
      .size=${args.size} 
      ?disabled=${args.disabled}
      ?glass=${args.glass}
    >
      ${args.slotContent || 'Shibui Button'}
    </lib-button>
  `,
};

export default meta;
type Story = StoryObj<LibButtonStoryArgs>;

export const AllVariants: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; gap: var(--lib-space-md); align-items: center;">
      <lib-button variant="primary">Water (Primary)</lib-button>
      <lib-button variant="danger">Kaki (Danger)</lib-button>
      <lib-button variant="neutral">Ink (Neutral)</lib-button>
      <lib-button variant="ghost">Ghost</lib-button>
    </div>
  `,
};

export const GlassEffect: Story = {
  render: (): TemplateResult => html`
    <div style="
      padding: 60px; 
      /* Un fondo con patrón para ver el desenfoque */
      background:rgb(27, 8, 8) url('https://grainy-gradients.vercel.app/noise.svg');
      background-blend-mode: overlay;
      display: flex; 
      gap: 20px;
      justify-content: center;
    ">
      <lib-button glass variant="primary">Efecto Agua</lib-button>
      <lib-button glass>Efecto Papel</lib-button>
    </div>
  `,
};
