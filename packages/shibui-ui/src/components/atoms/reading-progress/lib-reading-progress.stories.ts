import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-reading-progress.component';

const meta: Meta = {
  title: 'Atoms/Reading Progress',
  component: 'lib-reading-progress',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <div style="height: 200vh; padding: 2rem; font-family: var(--lib-font-body);">
      <lib-reading-progress></lib-reading-progress>
      <h1>Haz scroll hacia abajo...</h1>
      <p>Este componente trackea el progreso de lectura del documento.</p>
      <div style="margin-top: 100vh;">
        <h2>¡Casi al final!</h2>
      </div>
    </div>
  `
};