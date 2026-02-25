import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-color-picker.component';
import '../../atoms/icon/lib-icon.component';

const meta: Meta = {
  title: 'Forms/Color Picker',
  component: 'lib-color-picker',
};

export default meta;

export const Default: StoryObj = {
  args: {
    value: '#3b82f6',
    label: 'Color de marca'
  },
  render: (args) => html`
    <div style="max-width: 300px;">
      <lib-color-picker 
        .value=${args.value} 
        .label=${args.label}
        @ui-lib-change=${(e: CustomEvent):void => console.log('Color seleccionado:', e.detail.value)}
      ></lib-color-picker>
    </div>
  `
};