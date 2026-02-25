import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-kbd.component';

const meta: Meta = {
  title: 'Surfaces/Kbd',
  component: 'lib-kbd',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <p>Presiona <lib-kbd key="Ctrl"></lib-kbd> + <lib-kbd key="K"></lib-kbd> para buscar.</p>
  `,
};

export const Combinations: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div>Guardar: <lib-kbd key="Cmd"></lib-kbd> <lib-kbd key="S"></lib-kbd></div>
      <div>Captura: <lib-kbd key="Shift"></lib-kbd> <lib-kbd key="Cmd"></lib-kbd> <lib-kbd key="4"></lib-kbd></div>
      <div>Borrar: <lib-kbd>Delete ⌫</lib-kbd></div>
    </div>
  `,
};