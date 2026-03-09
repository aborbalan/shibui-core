import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';

// ✅ Side-effect import — registra @customElement('lib-background')
import './lib-background.component';

import type { LibBackgroundVariant } from './lib-background.types';

/* ── Helpers de presentación ── */
const DEMO_CONTENT_LIGHT = html`
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;">
    <span style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:-0.02em;color:#221C16;">渋い</span>
    <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#B8A99A;">shibui</span>
  </div>
`;

const DEMO_CONTENT_DARK = html`
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:8px;">
    <span style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.65);">渋い</span>
    <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,247,244,0.2);">shibui</span>
  </div>
`;

/** Genera una grid de previews de fondos */
function bgGrid(items: Array<{ variant: LibBackgroundVariant; label: string; dark?: boolean }>): TemplateResult {
  return html`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:24px;background:#F2EDE6;">
      ${items.map(({ variant, label, dark }) => html`
        <div style="display:flex;flex-direction:column;gap:4px;">
          <lib-background variant="${variant}" style="height:180px;border-radius:2px;">
            ${dark ? DEMO_CONTENT_DARK : DEMO_CONTENT_LIGHT}
          </lib-background>
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">${label}</span>
        </div>
      `)}
    </div>
  `;
}

/* ────────────────────────────────────────────── */

const meta: Meta = {
  title: 'Components/Atoms/Background',
  component: 'lib-background',
  parameters: {
    docs: {
      description: {
        component: `
**lib-background** — 34 fondos decorativos derivados de los tokens Shibui.

Úsalo como contenedor de sección, hero, card o panel. El contenido se proyecta en el \`slot\` por defecto.

**Categorías:**
- **Light (10)** — papeles y textiles japoneses: seigaiha, tatami, asanoha, sashiko…
- **Dark (10)** — tinta sumi: kintsugi, ash-grid, mokume, temari…  
- **Gradient (5)** — mesh radial: aurora-light, kaki-glow, celadon-mist…
- **Animated CSS (5)** — sin JS: breathing, aurora-drift, scan, ink-drop, shimmer
- **Canvas (4)** — generativo: particles, rain, wave-mesh, constellation

\`\`\`html
<lib-background variant="aurora-light" style="height: 400px;">
  <h1>Tu contenido aquí</h1>
</lib-background>
\`\`\`

Prop \`paused\` detiene todas las animaciones CSS (útil para \`prefers-reduced-motion\`).
        `,
      },
    },
    backgrounds: { default: 'surface' },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'washi','washi-grain','washi-weave','seigaiha','tatami','asanoha','sashiko','komon','kasuri','nishiki',
        'sumi','sumi-grain','kintsugi','ash-grid','ink-dot','mokume','kumo','temari','dusk','embers',
        'aurora-light','kaki-glow','celadon-mist','noctiluca','horizon',
        'breathing','aurora-drift','scan','ink-drop','shimmer',
        'particles','rain','wave-mesh','constellation',
      ] satisfies LibBackgroundVariant[],
      description: '34 variantes de fondo',
    },
    paused: {
      control: 'boolean',
      description: 'Pausa las animaciones CSS',
    },
  },
};

export default meta;
type Story = StoryObj;

/* ─────────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────────── */
export const Playground: Story = {
  name: 'Playground',
  args: {
    variant: 'aurora-light',
    paused:  false,
  },
  render: (args): TemplateResult => html`
    <lib-background
      variant="${args.variant as LibBackgroundVariant}"
      ?paused="${args.paused}"
      style="height: 400px; display: block;"
    >
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;">
        <span style="font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;letter-spacing:-0.02em;">渋い</span>
        <span style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;opacity:0.4;">lib-background · ${args.variant}</span>
      </div>
    </lib-background>
  `,
};

/* ─────────────────────────────────────────────────────────────
   LIGHT
───────────────────────────────────────────────────────────── */
export const Light: Story = {
  name: 'Light — Washi',
  render: (): TemplateResult => bgGrid([
    { variant: 'washi',       label: '01 · washi' },
    { variant: 'washi-grain', label: '02 · washi grain' },
    { variant: 'washi-weave', label: '03 · washi weave' },
    { variant: 'seigaiha',    label: '04 · 青海波 seigaiha' },
    { variant: 'tatami',      label: '05 · 畳 tatami' },
    { variant: 'asanoha',     label: '06 · 麻の葉 asanoha' },
    { variant: 'sashiko',     label: '07 · 刺子 sashiko' },
    { variant: 'komon',       label: '08 · 小紋 komon' },
    { variant: 'kasuri',      label: '09 · 絣 kasuri' },
    { variant: 'nishiki',     label: '10 · 錦 nishiki' },
  ]),
};

/* ─────────────────────────────────────────────────────────────
   DARK
───────────────────────────────────────────────────────────── */
export const Dark: Story = {
  name: 'Dark — Sumi',
  render: (): TemplateResult => bgGrid([
    { variant: 'sumi',      label: '11 · 墨 sumi',       dark: true },
    { variant: 'sumi-grain',label: '12 · sumi grain',    dark: true },
    { variant: 'kintsugi',  label: '13 · 金継 kintsugi', dark: true },
    { variant: 'ash-grid',  label: '14 · 灰 ash grid',   dark: true },
    { variant: 'ink-dot',   label: '15 · 点 ink dot',    dark: true },
    { variant: 'mokume',    label: '16 · 木目 mokume',   dark: true },
    { variant: 'kumo',      label: '17 · 雲 kumo',       dark: true },
    { variant: 'temari',    label: '18 · 手鞠 temari',   dark: true },
    { variant: 'dusk',      label: '19 · 宵 dusk',       dark: true },
    { variant: 'embers',    label: '20 · 炎 embers',     dark: true },
  ]),
};

/* ─────────────────────────────────────────────────────────────
   GRADIENTS
───────────────────────────────────────────────────────────── */
export const Gradients: Story = {
  name: 'Gradients — Mesh',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;">
      ${([
        { variant: 'aurora-light',  label: '21 · aurora light',   dark: false },
        { variant: 'kaki-glow',     label: '22 · kaki glow',      dark: false },
        { variant: 'celadon-mist',  label: '23 · celadon mist',   dark: false },
        { variant: 'noctiluca',     label: '24 · noctiluca',      dark: true  },
        { variant: 'horizon',       label: '25 · 地平 horizon',   dark: false },
      ] as Array<{ variant: LibBackgroundVariant; label: string; dark: boolean }>).map(({ variant, label, dark }) => html`
        <div style="display:flex;flex-direction:column;gap:4px;">
          <lib-background variant="${variant}" style="height:220px;border-radius:2px;">
            ${dark ? DEMO_CONTENT_DARK : DEMO_CONTENT_LIGHT}
          </lib-background>
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">${label}</span>
        </div>
      `)}
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   ANIMATED
───────────────────────────────────────────────────────────── */
export const Animated: Story = {
  name: 'Animated — CSS puro',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;">
      ${([
        { variant: 'breathing',    label: '26 · breathing · 6s',    dark: false },
        { variant: 'aurora-drift', label: '27 · aurora drift · 12s', dark: true  },
        { variant: 'scan',         label: '28 · scan · 5s',          dark: true  },
        { variant: 'ink-drop',     label: '29 · ink drop · 4s',      dark: false },
        { variant: 'shimmer',      label: '30 · shimmer · 4s',       dark: false },
      ] as Array<{ variant: LibBackgroundVariant; label: string; dark: boolean }>).map(({ variant, label, dark }) => html`
        <div style="display:flex;flex-direction:column;gap:4px;">
          <lib-background variant="${variant}" style="height:220px;border-radius:2px;">
            ${dark ? DEMO_CONTENT_DARK : DEMO_CONTENT_LIGHT}
          </lib-background>
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">${label}</span>
        </div>
      `)}
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   CANVAS
───────────────────────────────────────────────────────────── */
export const Canvas: Story = {
  name: 'Canvas — Generativo',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:24px;background:#F2EDE6;">
      ${([
        { variant: 'particles',    label: '31 · particle field', dark: true  },
        { variant: 'rain',         label: '32 · rain lines',     dark: true  },
        { variant: 'wave-mesh',    label: '33 · wave mesh',      dark: false },
        { variant: 'constellation',label: '34 · constellation',  dark: true  },
      ] as Array<{ variant: LibBackgroundVariant; label: string; dark: boolean }>).map(({ variant, label, dark }) => html`
        <div style="display:flex;flex-direction:column;gap:4px;">
          <lib-background variant="${variant}" style="height:260px;border-radius:2px;display:block;">
            ${dark ? DEMO_CONTENT_DARK : DEMO_CONTENT_LIGHT}
          </lib-background>
          <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">${label}</span>
        </div>
      `)}
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   USO REAL — Hero section
───────────────────────────────────────────────────────────── */
export const HeroExample: Story = {
  name: 'Uso real — Hero',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:2px;">

      <!-- Hero claro -->
      <lib-background variant="aurora-light" style="height:360px;display:block;">
        <div style="display:flex;flex-direction:column;justify-content:center;height:100%;padding:64px;">
          <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#B8A99A;margin-bottom:16px;">渋い · Design System</span>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,4rem);font-weight:300;letter-spacing:-0.02em;line-height:1.15;color:#221C16;margin-bottom:16px;">
            Materia que<br><em style="font-style:italic;color:#B85A1E;">respira</em>
          </h2>
          <p style="font-family:'Shippori Mincho',serif;font-size:0.9375rem;color:#7A6A5C;max-width:380px;line-height:1.8;">
            Sistema de diseño construido sobre papel washi, tinta sumi y la filosofía de la imperfección.
          </p>
        </div>
      </lib-background>

      <!-- Hero oscuro -->
      <lib-background variant="constellation" style="height:360px;display:block;">
        <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;gap:16px;">
          <span style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:rgba(250,247,244,0.2);">星座 · 52 · backgrounds</span>
          <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,5vw,3.5rem);font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.55);">
            Sistema de <em style="font-style:italic;color:#D97234;">fondos</em>
          </h2>
        </div>
      </lib-background>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   PAUSED — a11y
───────────────────────────────────────────────────────────── */
export const Paused: Story = {
  name: 'Paused — reduce motion',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:24px;background:#F2EDE6;">
      <div style="display:flex;flex-direction:column;gap:4px;">
        <lib-background variant="breathing" style="height:200px;">
          ${DEMO_CONTENT_LIGHT}
        </lib-background>
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">animado</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        <lib-background variant="breathing" paused style="height:200px;">
          ${DEMO_CONTENT_LIGHT}
        </lib-background>
        <span style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.15em;text-transform:uppercase;color:#B8A99A;">paused</span>
      </div>
    </div>
  `,
};