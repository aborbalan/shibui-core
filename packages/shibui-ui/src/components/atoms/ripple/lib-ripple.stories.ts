import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-ripple.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Web/Motion/Ripple',
  tags:['autodocs'],
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

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-ripple hereda el color del texto del contenedor
   (text-muted, bg-elevated) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="position:relative;padding:40px 24px;background:var(--bg-elevated);border:1px solid var(--border-subtle);cursor:pointer;overflow:hidden;text-align:center;user-select:none;">
    <span style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:.15em;color:var(--text-muted);">
      PULSA PARA ONDAS
    </span>
    <lib-ripple></lib-ripple>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;