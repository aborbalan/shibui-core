import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-liquid-button.component';

const meta: Meta = {
  title: 'Components/Atoms/ButtonLiquid',
  component: 'lib-button-liquid',
  argTypes: {
    variant:  { control: 'select', options: ['ink', 'washi', 'kaki', 'celadon', 'ghost', 'danger'] },
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
    variant:  'ink',
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
  name: 'Variantes — ink · washi · kaki · celadon · ghost · danger',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ink">Tinta</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">ink</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="washi">Washi</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">washi</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="kaki">Kaki</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">kaki</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="celadon">Celadón</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">celadon</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ghost">Ghost</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">ghost</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="danger">Eliminar</lib-button-liquid>
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
        <lib-button-liquid variant="ink" size="sm">Pequeño</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">sm</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ink" size="md">Default</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">md</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ink" size="lg">Grande</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">lg</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="kaki" size="lg">Kaki lg</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">kaki lg</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="celadon" size="lg">Celadón lg</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">celadon lg</span>
      </div>

    </div>
  `,
};

/* ── Con iconos ── */
export const WithIcons: Story = {
  name: 'Con iconos — prefix · suffix',
  render: (): TemplateResult => html`
    <div style="padding: 3rem; display: flex; flex-wrap: wrap; align-items: center; gap: 2rem;">

      <lib-button-liquid variant="ink">
        <svg slot="prefix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8h12M9 3l5 5-5 5"/>
        </svg>
        Continuar
      </lib-button-liquid>

      <lib-button-liquid variant="washi">
        Descargar
        <svg slot="suffix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M8 2v9M4 8l4 4 4-4M2 14h12"/>
        </svg>
      </lib-button-liquid>

      <lib-button-liquid variant="celadon">
        <svg slot="prefix" width="11" height="11" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M8 2l1.9 3.8L14 6.3l-3 2.9.7 4.1L8 11.1l-3.7 2.2.7-4.1-3-2.9 4.1-.5z"/>
        </svg>
        Guardar
      </lib-button-liquid>

      <lib-button-liquid variant="kaki" size="lg">
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
        <lib-button-liquid variant="ink">Default</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">default</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ink" disabled>Disabled</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">disabled</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="ink" loading>Enviando</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">loading</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="kaki" loading>Guardando</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">kaki loading</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="washi" disabled>No disponible</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted);">washi disabled</span>
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
        <lib-button-liquid variant="ink" dark>Tinta</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">ink</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="kaki" dark>Kaki</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">kaki</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0.75rem;">
        <lib-button-liquid variant="celadon" dark>Celadón</lib-button-liquid>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--color-washi-700);">celadon</span>
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
      <lib-button-liquid variant="ink" block>Confirmar pedido</lib-button-liquid>
      <lib-button-liquid variant="washi" block>Cancelar</lib-button-liquid>
      <lib-button-liquid variant="kaki" size="lg" block>
        <svg slot="prefix" width="13" height="13" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <path d="M2 8h12M9 3l5 5-5 5"/>
        </svg>
        Publicar ahora
      </lib-button-liquid>
    </div>
  `,
};