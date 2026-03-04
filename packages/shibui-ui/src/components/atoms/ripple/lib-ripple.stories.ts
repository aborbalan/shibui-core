import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-ripple.component';

const meta: Meta = {
  title: 'Components/Atoms/Ripple',
  component: 'lib-ripple',
};

export default meta;

export const InteractiveDemo: StoryObj = {
  render: (): TemplateResult => html`
    <div style="
      position: relative; 
      padding: 60px; 
      background: var(--color-washi-100); 
      border: 1px solid var(--color-washi-300);
      border-radius: var(--lib-radius-md);
      cursor: pointer;
      overflow: hidden;
      text-align: center;
      user-select: none;
    ">
      <span style="font-family: var(--lib-font-family-mono); color: var(--color-kaki-800);">
        EFECTO GOTA (SHIBUI)
      </span>
      <lib-ripple style="--lib-ripple-color: #e67e22"></lib-ripple>
    </div>
  `
};

export const InheritanceDemo: StoryObj = {
  render: (): TemplateResult => html`
    <div style="
      position: relative; 
      padding: 40px; 
      background: var(--color-washi-900); 
      color: var(--color-celadon-300);
      cursor: pointer;
      overflow: hidden;
      border: 1px solid var(--color-washi-700);
    ">
      Heredando color de texto Celadón
      <lib-ripple></lib-ripple>
    </div>
  `
};