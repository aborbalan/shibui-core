import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-text-list.component';

const meta: Meta = {
  title: 'Display/Text List',
  component: 'lib-text-list',
  argTypes: {
    variant: {
      control: 'select',
      options: ['ordered', 'unordered'],
    },
    loading: { control: 'boolean' },
    skeletonCount: { control: 'number' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    items: ['Configurar arquitectura base', 'Crear modelos genéricos', 'Implementar átomos'],
    variant: 'unordered',
    loading: false,
    skeletonCount: 3,
  },
  render: (args) => html`
    <lib-text-list 
      .items=${args.items} 
      variant=${args.variant}
      ?loading=${args.loading}
      .skeletonCount=${args.skeletonCount}>
    </lib-text-list>
  `,
};

export const Loading: StoryObj = {
  args: {
    ...Default.args,
    loading: true,
  },
};