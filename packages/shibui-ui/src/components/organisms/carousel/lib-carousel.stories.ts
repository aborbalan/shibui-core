import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-carousel.component';

const meta: Meta = {
  title: 'Display/Carousel',
  component: 'lib-carousel',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <div style="max-width: 500px; margin: 50px auto; border: 1px solid #eee; padding: 20px;">
      <lib-carousel>
        <div style="background: #e3f2fd; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #1976d2;">Slide 1</div>
        <div style="background: #f3e5f5; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #7b1fa2;">Slide 2</div>
        <div style="background: #e8f5e9; height: 150px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #388e3c;">Slide 3</div>
      </lib-carousel>
    </div>
  `,
};