import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-liquid-button.component';

export default {
  title: 'Atoms/Liquid Button',
  component: 'lib-liquid-button',
} as Meta;

export const Default: StoryObj = {
  args: {
    label: 'Explorar Shibui'
  },
  render: (args) => html`
    <div style="padding: 100px; display: flex; justify-content: center; background: var(--bg-base);">
      <lib-liquid-button .label=${args.label}></lib-liquid-button>
    </div>
  `
};

export const AccentVariants: StoryObj = {
  render: () => html`
    <div style="padding: 60px; display: flex; flex-direction: column; gap: 40px; align-items: center; background: #111;">
      <lib-liquid-button 
        label="Water variant" 
        style="--_liquid-color: var(--lib-shibui-water);"
      ></lib-liquid-button>
      
      <lib-liquid-button 
        label="Kintsugi variant" 
        style="--_liquid-color: #D4AF37;"
      ></lib-liquid-button>
    </div>
  `
};