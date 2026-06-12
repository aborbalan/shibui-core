import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-liquid-button.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Actions/Button Liquid',
  tags:['autodocs'],
  component: 'lib-button-liquid',
  argTypes: {
    variant:  { control: 'select', options: ['filled', 'outlined', 'accent', 'info', 'ghost', 'error'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    loading:  { control: 'boolean' },
    dark:     { control: 'boolean' },
    block:    { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant:  'filled',
    size:     'md',
    disabled: false,
    loading:  false,
    dark:     false,
    block:    false,
  },
  render: (args): TemplateResult => html`
    <div style="padding: 3rem; ${args.dark ? 'background: var(--color-washi-950);' : ''}">
      <lib-button-liquid
        variant="${args.variant}"
        size="${args.size}"
        ?disabled="${args.disabled}"
        ?loading="${args.loading}"
        ?dark="${args.dark}"
        ?block="${args.block}"
        @ui-lib-click="${(e: CustomEvent): void => console.log('click', e.detail)}"
      >Pasa el cursor</lib-button-liquid>
    </div>
  `,
};

/* ── Variantes ── */
export const Variants: Story = {
  name: 'Variantes — filled · outlined · accent · info · ghost · danger',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled">Filled</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">filled</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="outlined">Outlined</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">outlined</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="accent">Accent</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">accent</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="info">Info</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">info</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ghost">Ghost</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">ghost</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="error">Eliminar</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">danger</span>
      </div>

    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: 'Tamaños — sm · md · lg',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; align-items: center; gap: 2rem;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" size="sm">Pequeño</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">sm</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" size="md">Default</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">md</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" size="lg">Grande</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">lg</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="accent" size="lg">Kaki lg</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">accent lg</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="info" size="lg">Celadón lg</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">info lg</span>
      </div>

    </div>
  `,
};

/* ── Con iconos ── */
export const WithIcons: Story = {
  name: 'Con iconos — prefix · suffix',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">

      <lib-button-liquid variant="filled">
        <svg slot="prefix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8h12M9 3l5 5-5 5"/>
        </svg>
        Continuar
      </lib-button-liquid>

      <lib-button-liquid variant="outlined">
        Descargar
        <svg slot="suffix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M8 2v9M4 8l4 4 4-4M2 14h12"/>
        </svg>
      </lib-button-liquid>

      <lib-button-liquid variant="info">
        <svg slot="prefix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M8 2l1.9 3.8L14 6.3l-3 2.9.7 4.1L8 11.1l-3.7 2.2.7-4.1-3-2.9 4.1-.5z"/>
        </svg>
        Guardar
      </lib-button-liquid>

      <lib-button-liquid variant="accent" size="lg">
        <svg slot="prefix" width="13" height="13" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8h12M9 3l5 5-5 5"/>
        </svg>
        Publicar
      </lib-button-liquid>

    </div>
  `,
};

/* ── Estados ── */
export const States: Story = {
  name: 'Estados — default · disabled · loading',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled">Default</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">default</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" disabled>Disabled</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">disabled</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" loading>Enviando</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">loading</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="accent" loading>Guardando</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">accent loading</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="outlined" disabled>No disponible</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">outlined disabled</span>
      </div>

    </div>
  `,
};

/* ── Dark ── */
export const Dark: Story = {
  name: 'Surface dark',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding: 3rem; background: var(--color-washi-950); display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="filled" dark>Filled</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">filled</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="accent" dark>Accent</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">accent</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="info" dark>Info</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">info</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ghost" dark>Ghost</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">ghost dark</span>
      </div>

    </div>
  `,
};

/* ── Block ── */
export const Block: Story = {
  name: 'Block — ancho completo',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; max-width: 480px; display: flex; flex-direction: column; gap: 1rem;">
      <lib-button-liquid variant="filled" block>Confirmar pedido</lib-button-liquid>
      <lib-button-liquid variant="outlined" block>Cancelar</lib-button-liquid>
      <lib-button-liquid variant="accent" size="lg" block>
        <svg slot="prefix" width="13" height="13" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8h12M9 3l5 5-5 5"/>
        </svg>
        Publicar ahora
      </lib-button-liquid>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-button-liquid usa tokens semánticos de color y tipografía
   en sus variantes — adapta al contexto katachi ambient.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);padding:var(--lib-space-lg);">
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;flex-wrap:wrap;">
      <lib-button-liquid variant="filled" size="sm">Pequeño</lib-button-liquid>
      <lib-button-liquid variant="filled" size="md">Default</lib-button-liquid>
      <lib-button-liquid variant="filled" size="lg">Grande</lib-button-liquid>
    </div>
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;flex-wrap:wrap;">
      <lib-button-liquid variant="filled">Filled</lib-button-liquid>
      <lib-button-liquid variant="outlined">Outlined</lib-button-liquid>
      <lib-button-liquid variant="accent">Accent</lib-button-liquid>
      <lib-button-liquid variant="info">Info</lib-button-liquid>
      <lib-button-liquid variant="ghost">Ghost</lib-button-liquid>
      <lib-button-liquid variant="error">Danger</lib-button-liquid>
    </div>
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;flex-wrap:wrap;">
      <lib-button-liquid variant="filled" disabled>Disabled</lib-button-liquid>
      <lib-button-liquid variant="filled" loading>Loading</lib-button-liquid>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;