import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-cursor-follower.component';

export default {
  title: 'Organisms/Cursor Follower',
  component: 'lib-cursor-follower',
} as Meta;

export const Default: StoryObj = {
  render: () => html`
    <lib-cursor-follower lerp="0.08"></lib-cursor-follower>
    
    <div style="height: 100vh; display: flex; align-items: center; justify-content: center; gap: 2rem; background: #111; color: white;">
      <button style="padding: 1rem 2rem; border: 1px solid white; background: transparent; color: white; cursor: pointer;">
        Pasa por encima de mí
      </button>
      
      <a href="#" style="color: var(--color-kintsugi);">Un enlace elegante</a>
    </div>
  `
};