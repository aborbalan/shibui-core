import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-spinner.component';
import type { LibSpinner } from './lib-spinner.component';

const meta: Meta<LibSpinner> = {
  title: 'Feedback/Spinner',
  component: 'lib-spinner',
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'white'],
    },
  },
};

export default meta;
type Story = StoryObj<LibSpinner>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'primary',
  },
  render: (args) => html`
    <lib-spinner .size=${args.size} .variant=${args.variant}></lib-spinner>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 1rem;">
      <lib-spinner size="sm"></lib-spinner>
      <lib-spinner size="md"></lib-spinner>
      <lib-spinner size="lg"></lib-spinner>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background-color: #eee;">
      <lib-spinner variant="primary"></lib-spinner>
      <lib-spinner variant="secondary"></lib-spinner>
      <div style="background-color: #333; padding: 0.5rem; display: inline-flex;">
        <lib-spinner variant="white"></lib-spinner>
      </div>
    </div>
  `,
};
