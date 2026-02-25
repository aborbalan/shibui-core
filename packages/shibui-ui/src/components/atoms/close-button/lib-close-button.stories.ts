import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-close-button.component';

const meta: Meta = {
  title: 'Forms/Close Button',
  component: 'lib-close-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'primary', 'success', 'danger', 'ghost', 'white']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    }
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    variant: 'neutral',
    size: 'md'
  }
};

export const AllVariants: StoryObj = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
      <lib-close-button variant="neutral"></lib-close-button>
      <lib-close-button variant="primary"></lib-close-button>
      <lib-close-button variant="success"></lib-close-button>
      <lib-close-button variant="danger"></lib-close-button>
      <lib-close-button variant="ghost"></lib-close-button>
      <div style="background: #333; padding: 10px; border-radius: 4px;">
        <lib-close-button variant="white"></lib-close-button>
      </div>
    </div>
  `
};

export const Sizes: StoryObj = {
  render: () => html`
    <div style="display: flex; gap: 20px; align-items: center;">
      <lib-close-button size="sm"></lib-close-button>
      <lib-close-button size="md"></lib-close-button>
      <lib-close-button size="lg"></lib-close-button>
    </div>
  `
};