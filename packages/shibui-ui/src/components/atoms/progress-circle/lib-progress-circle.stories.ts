import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-progress-circle.component';

const meta: Meta = {
  title: 'Display/Progress Circle',
  component: 'lib-progress-circle',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'number' },
    strokeWidth: { control: 'number' },
  }
};

export default meta;

export const Default: StoryObj = {
  args: {
    value: 75,
    max: 100,
    size: 100,
    strokeWidth: 10
  },
  render: (args) => html`
    <lib-progress-circle 
      .value=${args.value} 
      .max=${args.max} 
      .size=${args.size} 
      .strokeWidth=${args.strokeWidth}
    ></lib-progress-circle>
  `
};