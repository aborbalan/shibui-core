import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-divider.component';
import '../icon/lib-icon.component';

/**
 * Interfaz para los argumentos de la historia
 */
interface DividerArgs {
  orientation: 'horizontal' | 'vertical';
  align: 'left' | 'center' | 'right';
  faded: boolean;
  content: string;
}

const meta: Meta<DividerArgs> = {
  title: 'Display/Divider', 
  component: 'lib-divider',
  argTypes: {
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Define si la línea es horizontal o vertical',
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right'],
      description: 'Alineación del contenido (solo horizontal)',
    },
    faded: {
      control: { type: 'boolean' },
      description: 'Aplica un degradado en los extremos',
    },
    content: {
      control: { type: 'text' },
      description: 'Texto o contenido dentro del divider',
    },
  },
};

export default meta;

type Story = StoryObj<DividerArgs>;

/**
 * Template base para las historias
 */
const renderDivider = (args: DividerArgs): TemplateResult => html`
  <div style="${args.orientation === 'vertical' ? 'height: 100px; display: flex; align-items: center; justify-content: center;' : 'width: 100%;'}">
    ${args.orientation === 'vertical' ? html`<span>Arriba</span>` : ''}
    
    <lib-divider 
      .orientation=${args.orientation} 
      .align=${args.align} 
      ?faded=${args.faded}
    >
      ${args.content}
    </lib-divider>

    ${args.orientation === 'vertical' ? html`<span>Abajo</span>` : ''}
  </div>
`;

export const Default: Story = {
  args: {
    orientation: 'horizontal',
    align: 'center',
    faded: false,
    content: '',
  },
  render: (args) => renderDivider(args),
};

export const WithText: Story = {
  args: {
    orientation: 'horizontal',
    align: 'center',
    faded: false,
    content: 'O CONTINUAR CON',
  },
  render: (args) => renderDivider(args),
};

export const WithIcon: Story = {
  args: {
    orientation: 'horizontal',
    align: 'center',
    faded: true,
    content: '',
  },
  render: (args) => html`
    <lib-divider .faded=${args.faded}>
      <lib-icon name="star" style="font-size: 16px;"></lib-icon>
    </lib-divider>
  `,
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    align: 'center',
    faded: false,
    content: '',
  },
  render: (args) => renderDivider(args),
};