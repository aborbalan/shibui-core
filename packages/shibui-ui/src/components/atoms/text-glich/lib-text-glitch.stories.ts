import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-text-glitch.component';

export default {
  title: 'Atoms/Text Glitch',
  component: 'lib-text-glitch',
  argTypes: {
    text: { control: 'text' },
    active: { control: 'boolean' }
  },
} as Meta;

export const Heading: StoryObj = {
  args: {
    text: 'SHIBUI COLLECTIVE',
    active: false
  },
  render: (args) => html`
    <div style="background: var(--bg-base); padding: 100px; min-height: 50vh;">
      <h1 style="font-size: 5rem; font-family: var(--lib-font-display); margin: 0;">
        <lib-text-glitch .text=${args.text} ?active=${args.active}></lib-text-glitch>
      </h1>
      <p style="margin-top: 20px; color: var(--color-washi-500); font-family: var(--lib-font-body);">
        Pasa el ratón sobre el texto para ver la vibración de la tinta.
      </p>
    </div>
  `
};

export const BrutalistCard: StoryObj = {
  render: () => html`
    <div style="padding: 50px; background: var(--color-washi-100);">
      <div style="border: 1px solid var(--lib-shibui-ink); padding: 40px; width: 300px; background: white;">
        <p style="font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">
          System Error _ 04
        </p>
        <h2 style="font-size: var(--text-2xl); font-family: var(--lib-font-display); margin: 0;">
          <lib-text-glitch text="IMPERFECTION"></lib-text-glitch>
        </h2>
      </div>
    </div>
  `
};