import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-step.component';

interface StepArgs {
  label: string;
  index: number;
  status: 'active' | 'completed' | 'inactive';
}

const meta: Meta<StepArgs> = {
  title: 'Navigation/Step Item', // Categoría funcional
  component: 'lib-step',
  argTypes: {
    status: {
      control: { type: 'select' },
      options: ['active', 'completed', 'inactive'],
    },
    label: { control: 'text' },
    index: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<StepArgs>;

export const Default: Story = {
  args: {
    label: 'Información Personal',
    index: 1,
    status: 'inactive',
  },
  render: (args) => html`
    <div style="width: 150px; padding: 20px;">
      <lib-step .label=${args.label} .index=${args.index} .status=${args.status}></lib-step>
    </div>
  `,
};

export const Active: Story = {
  args: { ...Default.args, status: 'active' },
  render: (args) => html`
    <div style="width: 150px; padding: 20px;">
      <lib-step .label=${args.label} .index=${args.index} .status=${args.status}></lib-step>
    </div>
  `,
};

export const Completed: Story = {
  args: { ...Default.args, status: 'completed' },
  render: (args) => html`
    <div style="width: 150px; padding: 20px;">
      <lib-step .label=${args.label} .index=${args.index} .status=${args.status}></lib-step>
    </div>
  `,
};