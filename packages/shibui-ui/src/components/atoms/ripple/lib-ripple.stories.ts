import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-ripple.component';

const meta: Meta = {
  title: 'Motion/Ripple',
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
          <div style="position:relative;padding:40px 24px;background:var(--bg-elevated);border:1px solid var(--border-subtle);cursor:pointer;overflow:hidden;text-align:center;user-select:none;">
            <span style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:.15em;color:var(--text-muted);">
              PULSA PARA ONDAS
            </span>
            <lib-ripple></lib-ripple>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};