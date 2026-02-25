import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-range-slider.component';

const meta: Meta = {
  title: 'Forms/Range Slider',
  component: 'lib-range-slider',
};

export default meta;

export const Default: StoryObj = {
  args: {
    min: 0,
    max: 1000,
    minValue: 200,
    maxValue: 800,
    label: 'Rango de Precios (€)'
  },
  render: (args) => html`
    <div style="max-width: 400px; padding: 20px;">
      <lib-range-slider 
        .min=${args.min} 
        .max=${args.max} 
        .minValue=${args.minValue} 
        .maxValue=${args.maxValue}
        .label=${args.label}
        @ui-lib-change=${(e: CustomEvent):void => console.log('Rango:', e.detail)}
      ></lib-range-slider>
    </div>
  `
};