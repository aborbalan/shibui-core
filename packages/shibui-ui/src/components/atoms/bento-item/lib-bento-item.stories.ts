import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite'; // Importación necesaria
import './lib-bento-item.component';

// 1. Definimos la metadata del componente (Meta)
const meta: Meta = {
  title: 'Layout/Bento Item',
  
  component: 'lib-bento-item',
  argTypes: {
    cols: { control: 'number', description: 'Columnas que ocupa' },
    rows: { control: 'number', description: 'Filas que ocupa' },
    interactive: { control: 'boolean', description: 'Efectos de hover' },
  },
  // Tag obligatorio según nuestro protocolo para auto-generar tablas de API [cite: 41, 57]
  tags: ['autodocs'], 
};

export default meta;

// 2. Definimos el tipo para nuestras historias
type Story = StoryObj;

// 3. Creamos la historia base
export const Default: Story = {
  args: {
    cols: 2,
    rows: 1,
    interactive: true,
  },
  render: (args) => html`
    <div style="
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 16px; 
      width: 100%; 
      max-width: 800px; 
      background: var(--bg-surface); 
      padding: 40px;
      border-radius: var(--radius-lg);
    ">
      <lib-bento-item 
        .cols=${args.cols} 
        .rows=${args.rows} 
        ?interactive=${args.interactive}
      >
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <h3 style="margin: 0; font-family: var(--lib-font-display);">Shibui Bento</h3>
          <p style="margin: 0; font-size: var(--text-sm); color: var(--text-secondary);">
            Elegancia discreta en cada celda.
          </p>
        </div>
      </lib-bento-item>
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

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <lib-bento-item cols="2" rows="1" interactive style="grid-column:span 2;">
              <div style="display:flex;flex-direction:column;gap:4px;padding:4px;">
                <span style="font-family:var(--lib-font-display);font-size:var(--text-lg);color:var(--text-primary);">Principal</span>
                <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">cols × 2</span>
              </div>
            </lib-bento-item>
            <lib-bento-item cols="1" rows="1" interactive>
              <div style="display:flex;align-items:center;justify-content:center;height:100%;">
                <span style="font-family:'Shippori Mincho',serif;font-size:1.4rem;color:var(--katachi-accent,var(--text-primary));">${k.kanji}</span>
              </div>
            </lib-bento-item>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};