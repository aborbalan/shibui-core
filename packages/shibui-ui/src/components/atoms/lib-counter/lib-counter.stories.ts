import { Meta, StoryObj } from '@storybook/web-components-vite'; // Importante: web-components
import { html } from 'lit';
import './lib-counter.component';

const meta: Meta = {
  title: 'Atoms/Counter',
  component: 'lib-counter',
  argTypes: {
    value: { control: 'number' },
    duration: { control: 'number' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: {
    value: 1250,
    duration: 2000,
  },
  render: (args) => html`
    <div style="font-size: 2rem;">
      <lib-counter .value=${args.value} .duration=${args.duration}></lib-counter>
    </div>
  `,
};

export const RapidCount: StoryObj = {
  args: {
    value: 100,
    duration: 500,
  },
  render: (args) => html`
    <div style="font-size: 3rem; color: var(--color-celadon-500);">
      <lib-counter .value=${args.value} .duration=${args.duration}></lib-counter>
    </div>
  `,
};