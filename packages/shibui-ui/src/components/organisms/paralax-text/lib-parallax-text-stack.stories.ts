import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-parallax-text-stack.component';

export default {
  title: 'Organisms/Parallax Text Stack',
  component: 'lib-parallax-text-stack',
} as Meta;

export const Default: StoryObj = {
  args: {
    lines: ['The beauty of', 'IMPERFECTION', 'Wabi Sabi', 'DESIGN SYSTEM'],
    speed: 0.15
  },
  render: (args) => html`
    <div style="height: 100vh; display: flex; align-items: flex-end; justify-content: center; padding: 2rem;">
      <p style="color: var(--color-washi-400);">↓ Haz scroll para ver el efecto ↓</p>
    </div>

    <lib-parallax-text-stack 
      .lines=${args.lines} 
      .speed=${args.speed}
      style="font-size: 8rem;"
    ></lib-parallax-text-stack>

    <div style="height: 100vh;"></div>
  `
};