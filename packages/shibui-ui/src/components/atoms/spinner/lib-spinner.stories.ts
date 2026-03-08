import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-spinner.component';
import type { LibSpinner } from './lib-spinner.component';

type LibSpinnerArgs = Pick<LibSpinner, 'variant' | 'size' | 'tone' | 'dark' | 'label'>;

const meta: Meta<LibSpinnerArgs> = {
  title: 'Components/Atoms/Spinner',
  component: 'lib-spinner',
  argTypes: {
    variant: {
      control: 'select',
      options: ['enso', 'sumi', 'kintsugi', 'shizuku'],
      description: 'Variante visual',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño',
    },
    tone: {
      control: 'select',
      options: ['ink', 'kaki', 'celadon'],
      description: 'Tono de color (afecta a enso y sumi)',
    },
    dark: {
      control: 'boolean',
      description: 'Optimiza para fondos oscuros',
    },
    label: {
      control: 'text',
      description: 'Texto accesible para lectores de pantalla',
    },
  },
  render: (args): TemplateResult => html`
    <div style="padding:3rem;background:${args.dark ? 'oklch(18% 0.02 45)' : 'var(--bg-base)'};display:flex;align-items:center;justify-content:center;min-height:10rem;">
      <lib-spinner
        variant=${args.variant}
        size=${args.size}
        tone=${args.tone}
        ?dark=${args.dark}
        label=${args.label}
      ></lib-spinner>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibSpinnerArgs>;


/* ══════════════════════════════════════
   PLAYGROUND
   ══════════════════════════════════════ */
export const Playground: Story = {
  args: {
    variant: 'enso',
    size:    'md',
    tone:    'ink',
    dark:    false,
    label:   'Cargando',
  },
};


/* ══════════════════════════════════════
   ENSO — 禅の円
   ══════════════════════════════════════ */
export const Enso: Story = {
  name: 'Enso — 禅の円 · trazo zen',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <!-- Light: tamaños + tonos -->
      <div style="padding:3rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="enso" size="${s}"></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">${s} · ink</span>
          </div>
        `)}
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="enso" size="md" tone="kaki"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">md · kaki</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="enso" size="md" tone="celadon"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">md · celadón</span>
        </div>
      </div>

      <!-- Dark -->
      <div style="padding:3rem;background:oklch(18% 0.02 45);border-radius:0 0 8px 8px;display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="enso" size="${s}" ?dark=${true}></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">${s} · paper</span>
          </div>
        `)}
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="enso" size="md" tone="kaki" ?dark=${true}></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">md · kaki</span>
        </div>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   SUMI — 墨
   ══════════════════════════════════════ */
export const Sumi: Story = {
  name: 'Sumi — 墨 · tinta en agua',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <div style="padding:3rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="sumi" size="${s}"></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">${s} · ink</span>
          </div>
        `)}
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="sumi" size="md" tone="celadon"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">md · celadón</span>
        </div>
      </div>

      <div style="padding:3rem;background:oklch(18% 0.02 45);border-radius:0 0 8px 8px;display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="sumi" size="sm" ?dark=${true}></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">sm · paper</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="sumi" size="md" ?dark=${true}></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">md · paper</span>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
          <lib-spinner variant="sumi" size="md" tone="kaki" ?dark=${true}></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">md · kaki</span>
        </div>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   KINTSUGI — 金継ぎ
   ══════════════════════════════════════ */
export const Kintsugi: Story = {
  name: 'Kintsugi — 金継ぎ · el anillo dorado',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <div style="padding:3rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="kintsugi" size="${s}"></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">${s}</span>
          </div>
        `)}
      </div>

      <div style="padding:3rem;background:oklch(18% 0.02 45);border-radius:0 0 8px 8px;display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="kintsugi" size="${s}" ?dark=${true}></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">${s} · dark</span>
          </div>
        `)}
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   SHIZUKU — 雫
   ══════════════════════════════════════ */
export const Shizuku: Story = {
  name: 'Shizuku — 雫 · gotas en órbita',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <div style="padding:3rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="shizuku" size="${s}"></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">${s} · ink</span>
          </div>
        `)}
      </div>

      <div style="padding:3rem;background:oklch(18% 0.02 45);border-radius:0 0 8px 8px;display:flex;flex-wrap:wrap;gap:3rem;align-items:flex-end;">
        ${(['sm','md','lg'] as const).map(s => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="shizuku" size="${s}" ?dark=${true}></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">${s} · kaki</span>
          </div>
        `)}
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   ALL VARIANTS — visión rápida
   ══════════════════════════════════════ */
export const AllVariants: Story = {
  name: 'All Variants — md · side by side',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <div style="padding:3rem;background:var(--bg-elevated);border:1px solid var(--border-subtle);display:flex;gap:4rem;align-items:flex-end;flex-wrap:wrap;">
        ${(['enso','sumi','kintsugi','shizuku'] as const).map(v => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="${v}" size="md"></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">${v}</span>
          </div>
        `)}
      </div>

      <div style="padding:3rem;background:oklch(18% 0.02 45);border-radius:0 0 8px 8px;display:flex;gap:4rem;align-items:flex-end;flex-wrap:wrap;">
        ${(['enso','sumi','kintsugi','shizuku'] as const).map(v => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
            <lib-spinner variant="${v}" size="md" ?dark=${true}></lib-spinner>
            <span style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">${v} · dark</span>
          </div>
        `)}
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   CONTEXT — usos reales en la interfaz
   ══════════════════════════════════════ */
export const Context: Story = {
  name: 'Context — usos en la interfaz',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">

      <!-- Inline loading button -->
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:center;position:relative;min-height:160px;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">Inline · btn</span>
        <button style="display:inline-flex;align-items:center;gap:0.75rem;font-family:var(--lib-font-mono);font-size:0.6875rem;letter-spacing:0.08em;text-transform:uppercase;background:var(--color-washi-900);color:var(--color-washi-50);border:none;padding:0.75rem 1.5rem;cursor:pointer;">
          <lib-spinner variant="enso" size="sm" label=""></lib-spinner>
          Cargando
        </button>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;margin-top:0.5rem;">enso · sm · inline</span>
      </div>

      <!-- Card loading centered -->
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:center;position:relative;min-height:160px;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">Card loading</span>
        <lib-spinner variant="sumi" size="md"></lib-spinner>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">sumi · md · centered</span>
      </div>

      <!-- Full overlay -->
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:center;position:relative;min-height:160px;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">Overlay</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);text-align:center;">Contenido bloqueado por carga.</p>
        <!-- overlay -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(250,247,244,0.7);backdrop-filter:blur(3px);">
          <lib-spinner variant="kintsugi" size="md"></lib-spinner>
        </div>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;position:relative;z-index:1;margin-top:auto;">kintsugi · md · overlay</span>
      </div>

      <!-- Dark card with shizuku -->
      <div style="background:oklch(18% 0.02 45);border:1px solid oklch(100% 0 0 / 0.06);padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:center;position:relative;min-height:160px;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:oklch(45% 0 0);text-transform:uppercase;">Dark card</span>
        <lib-spinner variant="shizuku" size="md" ?dark=${true}></lib-spinner>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.15em;color:oklch(40% 0 0);text-transform:uppercase;">shizuku · kaki · dark</span>
      </div>

      <!-- Status indicators list -->
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:2rem;display:flex;flex-direction:column;gap:1rem;position:relative;min-height:160px;justify-content:center;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">Status indicators</span>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-spinner variant="enso" size="sm" label="Sincronizando"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-secondary);letter-spacing:0.08em;">Sincronizando tokens...</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-spinner variant="shizuku" size="sm" label="Generando"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-secondary);letter-spacing:0.08em;">Generando Storybook...</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.75rem;">
          <lib-spinner variant="kintsugi" size="sm" label="Publicando"></lib-spinner>
          <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-accent);letter-spacing:0.08em;">Publicando npm...</span>
        </div>
      </div>

      <!-- Decorative enso bg -->
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);padding:2rem;display:flex;flex-direction:column;gap:1rem;align-items:center;justify-content:center;position:relative;overflow:hidden;min-height:160px;">
        <span style="position:absolute;top:1rem;left:1.25rem;font-family:var(--lib-font-mono);font-size:9px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;">Decorative · lg</span>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0.07;pointer-events:none;">
          <lib-spinner variant="enso" size="lg" label=""></lib-spinner>
        </div>
        <span style="font-family:var(--lib-font-display);font-size:var(--text-xl);font-weight:300;position:relative;z-index:1;">Procesando</span>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.15em;color:var(--text-muted);text-transform:uppercase;position:relative;z-index:1;">enso · xl · background</span>
      </div>

    </div>
  `,
};