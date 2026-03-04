import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-bento-grid.component';
import '../../atoms/bento-item/lib-bento-item.component';

const meta: Meta = {
  title: 'Organisms/Bento Grid',
  component: 'lib-bento-grid',
  tags: ['autodocs'],
};

export default meta;

export const Showcase: StoryObj = {
  args: {
    columns: 4,
    gap: 'md',
    rowHeight: '160px'
  },
  render: (args) => html`
    <lib-bento-grid 
      .columns=${args.columns} 
      .gap=${args.gap} 
      .rowHeight=${args.rowHeight}
    >
      <lib-bento-item .cols=${2} .rows=${2} interactive>
        <div style="background: var(--color-washi-100); height: 100%; display: flex; align-items: flex-end; padding: 1rem;">
          <h2 style="margin: 0; font-family: var(--lib-font-display);">Destacado</h2>
        </div>
      </lib-bento-item>

      <lib-bento-item .cols=${2} .rows=${1} interactive>
        <p>Contenido Alargado</p>
      </lib-bento-item>

      <lib-bento-item .cols=${1} .rows=${1} interactive>
        <p>Mini 1</p>
      </lib-bento-item>

      <lib-bento-item .cols=${1} .rows=${1} interactive>
        <p>Mini 2</p>
      </lib-bento-item>
    </lib-bento-grid>
  `
};