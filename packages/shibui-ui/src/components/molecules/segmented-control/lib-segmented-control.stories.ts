import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-segmented-control.component';
import '../../atoms/icon/lib-icon.component'; // Reutilizamos tu átomo

const meta: Meta = {
  title: 'Forms/Segmented Control',
  component: 'lib-segmented-control',
};

export default meta;

export const Default: StoryObj = {
  args: {
    options: [
      { label: 'Mapa', value: 'map', icon: 'map' },
      { label: 'Lista', value: 'list', icon: 'list' },
      { label: 'Híbrido', value: 'hybrid', icon: 'grid' }
    ],
    value: 'map'
  },
  render: (args) => html`
    <lib-segmented-control 
      .options=${args.options} 
      .value=${args.value}
      @ui-lib-change=${(e: CustomEvent):void => console.log('Nuevo valor:', e.detail.value)}
    ></lib-segmented-control>
  `
};