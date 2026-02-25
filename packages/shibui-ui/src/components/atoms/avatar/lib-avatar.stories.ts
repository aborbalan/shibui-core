import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-avatar.component';
// Importamos el status-dot para que Storybook reconozca el componente hijo
import '../../atoms/status-dot/lib-status-dot.component';

const meta: Meta = {
  title: 'Display/Avatar',
  component: 'lib-avatar',
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: { control: 'boolean' },
    src: { control: 'text' },
    name: { control: 'text' },
  },
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <lib-avatar 
      .src=${args.src} 
      .name=${args.name} 
      .size=${args.size} 
      ?rounded=${args.rounded}
    ></lib-avatar>
  `,
  args: {
    name: 'Gemini AI',
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    size: 'md',
    rounded: true,
  },
};

export const WithStatus: StoryObj = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center;">
      <lib-avatar name="John Doe" size="lg" src="https://api.dicebear.com/7.x/avataaars/svg?seed=John">
        <lib-status-dot slot="status" variant="success" pulse></lib-status-dot>
      </lib-avatar>

      <lib-avatar name="Jane Smith" size="md" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jane">
        <lib-status-dot slot="status" variant="danger"></lib-status-dot>
      </lib-avatar>

      <lib-avatar name="User" size="sm" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ane">
        <lib-status-dot slot="status" variant="warning"></lib-status-dot>
      </lib-avatar>
    </div>
  `,
};

export const InitialsFallback: StoryObj = {
  render: () => html`
    <div style="display: flex; gap: 10px;">
      <lib-avatar name="Albert Einstein" size="md"></lib-avatar>
      <lib-avatar name="Marie Curie" size="md"></lib-avatar>
      <lib-avatar name="Isaac Newton" size="md">
        <lib-status-dot slot="status" variant="info" pulse></lib-status-dot>
      </lib-avatar>
    </div>
  `,
};