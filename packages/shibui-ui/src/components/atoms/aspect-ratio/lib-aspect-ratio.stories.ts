import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-aspect-ratio.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Layout/Aspect Ratio',
  tags:['autodocs'],
  component: 'lib-aspect-ratio',
};

export default meta;

export const Ratios: StoryObj = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 2rem; max-width: 500px;">
      
      <div>
        <p>Ratio 16:9 (Video HD)</p>
        <lib-aspect-ratio ratio="16/9">
          <img src="https://picsum.photos/800/450" alt="Random" />
        </lib-aspect-ratio>
      </div>

      <div>
        <p>Ratio 1:1 (Cuadrado / Instagram)</p>
        <div style="width: 200px;">
           <lib-aspect-ratio ratio="1/1">
            <div style="background: var(--color-kaki-500); display: flex; align-items: center; justify-content: center; color: white;">
              Caja Cuadrada
            </div>
          </lib-aspect-ratio>
        </div>
      </div>

      <div>
        <p>Ratio 4:3 (Fotografía clásica)</p>
        <lib-aspect-ratio ratio="4/3">
          <img src="https://picsum.photos/800/600" alt="Random" />
        </lib-aspect-ratio>
      </div>

    </div>
  `
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-aspect-ratio es un wrapper estructural — sin colores propios.
   Las proporciones heredan el katachi del contexto ancestro.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:100%;max-width:320px;">
    <lib-aspect-ratio ratio="16/9">
      <div style="width:100%;height:100%;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);letter-spacing:.1em;">16 / 9</span>
      </div>
    </lib-aspect-ratio>
    <div style="display:flex;gap:var(--lib-space-sm);">
      <lib-aspect-ratio ratio="1/1" style="flex:0 0 80px;">
        <div style="width:100%;height:100%;background:var(--bg-surface);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
          <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);">1/1</span>
        </div>
      </lib-aspect-ratio>
      <lib-aspect-ratio ratio="4/3" style="flex:1;">
        <div style="width:100%;height:100%;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
          <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);">4/3</span>
        </div>
      </lib-aspect-ratio>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;