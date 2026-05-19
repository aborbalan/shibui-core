import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-aspect-ratio.component';

const meta: Meta = {
  title: 'Layout/Aspect Ratio',
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
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: StoryObj = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <lib-aspect-ratio ratio="16/9">
            <div style="width:100%;height:100%;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
              <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);letter-spacing:.1em;">16 / 9</span>
            </div>
          </lib-aspect-ratio>
          <div style="display:flex;gap:8px;">
            <lib-aspect-ratio ratio="1/1" style="flex:0 0 72px;">
              <div style="width:100%;height:100%;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
                <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);">1/1</span>
              </div>
            </lib-aspect-ratio>
            <lib-aspect-ratio ratio="4/3" style="flex:1;">
              <div style="width:100%;height:100%;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;">
                <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);">4/3</span>
              </div>
            </lib-aspect-ratio>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};