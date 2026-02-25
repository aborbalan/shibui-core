import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-status-dot.component';

const meta: Meta = {
  title: 'Display/Status Dot',
  component: 'lib-status-dot',
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'danger', 'warning', 'info', 'neutral'],
    },
    pulse: { control: 'boolean' },
  },
};

export default meta;

export const AllVariants: StoryObj = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center;">
      <lib-status-dot variant="success" pulse label="Online"></lib-status-dot>
      <lib-status-dot variant="danger" pulse label="Error"></lib-status-dot>
      <lib-status-dot variant="warning" label="Away"></lib-status-dot>
      <lib-status-dot variant="info" label="Update"></lib-status-dot>
      <lib-status-dot variant="neutral"></lib-status-dot>
    </div>
  `,
};