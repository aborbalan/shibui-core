import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-badge.component';
import '../../atoms/icon/lib-icon.component';

interface BadgeArgs {
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  icon: string;
  removable: boolean;
}

const meta: Meta<BadgeArgs> = {
  title: 'Display/Badge',
  component: 'lib-badge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'error', 'neutral'],
    },
    icon: { control: 'text' },
    removable: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<BadgeArgs>;

export const Default: Story = {
    // Añadimos el tipo de retorno : TemplateResult aquí
    render: (args: BadgeArgs): TemplateResult => html`
      <lib-badge 
        variant="${args.variant}" 
        .icon="${args.icon}" 
        ?removable="${args.removable}"
        @remove="${(): void => alert('Evento remove disparado')}"
      >
        ${args.label}
      </lib-badge>
    `,
    args: {
      label: 'Badge Label',
      variant: 'neutral',
      icon: '',
      removable: false,
    },
  };

export const AllVariants: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <lib-badge variant="primary">Primary</lib-badge>
      <lib-badge variant="success" icon="check">Success</lib-badge>
      <lib-badge variant="warning" icon="warning">Warning</lib-badge>
      <lib-badge variant="error" icon="trash">Error</lib-badge>
      <lib-badge variant="neutral" removable>Removable</lib-badge>
    </div>
  `,
};