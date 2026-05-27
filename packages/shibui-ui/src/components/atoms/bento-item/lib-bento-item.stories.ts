import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components-vite'; // Importación necesaria
import './lib-bento-item.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

// 1. Definimos la metadata del componente (Meta)
const meta: Meta = {
  title: 'Universal/Layout/Bento Item',
  
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
   KATACHI · 形 · Las 6 historias estándar
   lib-bento-item usa tokens semánticos (--bg-elevated,
   --border-subtle, --border-strong) — hereda katachi directamente.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--lib-space-sm);width:100%;max-width:360px;">
    <lib-bento-item style="grid-column:span 2;" interactive>
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-xs);">
        <span style="font-family:var(--lib-font-display);font-size:var(--text-lg);color:var(--text-primary);font-weight:300;">Shibui</span>
        <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);letter-spacing:.1em;">2 × 1</span>
      </div>
    </lib-bento-item>
    <lib-bento-item interactive>
      <div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:80px;">
        <span style="font-family:'Shippori Mincho',serif;font-size:1.6rem;color:var(--text-muted);">渋</span>
      </div>
    </lib-bento-item>
    <lib-bento-item interactive>
      <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.1em;">1 × 1</span>
    </lib-bento-item>
    <lib-bento-item style="grid-column:span 2;" interactive>
      <span style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.1em;">2 × 1</span>
    </lib-bento-item>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;