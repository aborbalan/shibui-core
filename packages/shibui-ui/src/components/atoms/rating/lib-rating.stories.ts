import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-rating.component';

const meta: Meta = {
  title: 'Forms/Rating',
  component: 'lib-rating',
  argTypes: {
    value: { control: { type: 'number', min: 0, max: 5 } },
    max: { control: 'number' },
    readonly: { control: 'boolean' },
  },
};

export default meta;

export const Default: StoryObj = {
  args: { value: 3, max: 5, readonly: false },
  render: (args) => html`
    <lib-rating 
      .value=${args.value} 
      .max=${args.max} 
      ?readonly=${args.readonly}
     @change=${(e: CustomEvent<{ value: number }>): void => 
  console.log('Nuevo valor:', e.detail.value)
}
    ></lib-rating>
  `,
};