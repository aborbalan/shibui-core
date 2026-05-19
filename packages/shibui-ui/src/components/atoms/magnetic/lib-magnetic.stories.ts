import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-magnetic.component';
import '../button/lib-button.component'; // Asegúrate de que esta ruta sea correcta

const meta: Meta = {
  title: 'Actions/Magnetic',
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
          <div style="height:120px;display:flex;align-items:center;justify-content:center;background:var(--bg-elevated);border:1px solid var(--border-subtle);">
            <lib-magnetic shift="0.4">
              <lib-button variant="primary">Acércate</lib-button>
            </lib-magnetic>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};