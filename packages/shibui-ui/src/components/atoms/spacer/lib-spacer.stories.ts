import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-spacer.component';

export default {
  title: 'Components/Atoms/Spacer',
  component: 'lib-spacer',
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    horizontal: { control: 'boolean' }
  }
} as Meta;

// Caja de ayuda para visualizar el efecto
const Box = (color: string):TemplateResult => html`
  <div style="background: ${color}; padding: 1rem; border-radius: 4px; color: white; font-family: sans-serif;">
    Elemento
  </div>
`;

export const VerticalStack: StoryObj = {
  render: (args) => html`
    <div style="display: flex; flex-direction: column; background: #f5f5f5; padding: 20px;">
      ${Box('#2c3e50')}
      <lib-spacer .size=${args.size} ?horizontal=${args.horizontal}></lib-spacer>
      ${Box('#e67e22')}
      <lib-spacer size="xl"></lib-spacer>
      ${Box('#27ae60')}
    </div>
  `,
};

export const HorizontalRow: StoryObj = {
  args: { horizontal: true, size: 'lg' },
  render: (args) => html`
    <div style="display: flex; align-items: center; background: #f5f5f5; padding: 20px;">
      ${Box('#8e44ad')}
      <lib-spacer .size=${args.size} ?horizontal=${args.horizontal}></lib-spacer>
      ${Box('#c0392b')}
      <lib-spacer size="xs" horizontal></lib-spacer>
      ${Box('#2980b9')}
    </div>
  `,
};