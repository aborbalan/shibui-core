import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-spacer.component';

export default {
  title: 'Foundations/Spacing/Spacer',
  tags:['autodocs'],
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
          <div style="display:flex;flex-direction:column;">
            <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-primary);">xs</div>
            <lib-spacer size="xs"></lib-spacer>
            <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-primary);">sm</div>
            <lib-spacer size="sm"></lib-spacer>
            <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-primary);">md</div>
            <lib-spacer size="md"></lib-spacer>
            <div style="padding:10px 12px;background:var(--bg-elevated);border:1px solid var(--border-subtle);font-family:var(--lib-font-mono);font-size:11px;color:var(--text-primary);">lg</div>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};