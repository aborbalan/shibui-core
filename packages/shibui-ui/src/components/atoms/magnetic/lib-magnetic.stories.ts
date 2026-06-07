import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-magnetic.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import '../button/lib-button.component'; // Asegúrate de que esta ruta sea correcta

const meta: Meta = {
  title: 'Universal/Actions/Magnetic',
  tags:['autodocs'],
  component: 'lib-magnetic',
  argTypes: {
    shift: { control: { type: 'range', min: 0.1, max: 1, step: 0.1 } },
  },
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <div style="height: 300px; display: flex; align-items: center; justify-content: center;">
      <lib-magnetic .shift=${args.shift}>
        <lib-button variant="primary">¡Acércate!</lib-button>
      </lib-magnetic>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-magnetic es un wrapper de comportamiento — el contenido
   hijo (lib-button) hereda los tokens katachi del ancestor.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="height:200px;display:flex;align-items:center;justify-content:center;gap:var(--lib-space-xl);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
    <lib-magnetic shift="0.3">
      <lib-button variant="primary" size="sm">Sutil</lib-button>
    </lib-magnetic>
    <lib-magnetic shift="0.5">
      <lib-button variant="primary" size="md">Acércate</lib-button>
    </lib-magnetic>
    <lib-magnetic shift="0.8">
      <lib-button variant="primary" size="lg">Intenso</lib-button>
    </lib-magnetic>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;