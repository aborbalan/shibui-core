import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-select.component';

interface SelectArgs {
  label:        string;
  placeholder:  string;
  hint:         string;
  errorMessage: string;
  required:     boolean;
  optional:     boolean;
  open:         boolean;
  disabled:     boolean;
  error:        boolean;
  dark:         boolean;
  size:         'sm' | 'md' | 'lg';
  variant:      'default' | 'filled' | 'ghost';
  multi:        boolean;
  searchable:   boolean;
  value:        string;
}

const meta: Meta<SelectArgs> = {
  title: 'Components/Molecules/Select',
  component: 'lib-select',
  argTypes: {
    label:        { control: 'text' },
    placeholder:  { control: 'text' },
    hint:         { control: 'text' },
    errorMessage: { control: 'text' },
    required:     { control: 'boolean' },
    optional:     { control: 'boolean' },
    open:         { control: 'boolean' },
    disabled:     { control: 'boolean' },
    error:        { control: 'boolean' },
    dark:         { control: 'boolean' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del trigger',
    },
    variant: {
      control: 'select',
      options: ['default', 'filled', 'ghost'],
      description: 'Variante de superficie',
    },
    multi:      { control: 'boolean' },
    searchable: { control: 'boolean' },
    value:      { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<SelectArgs>;

/* ─────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    label:        'País',
    placeholder:  'Selecciona un país…',
    hint:         'Se usa para configurar la moneda y zona horaria',
    errorMessage: '',
    required:     false,
    optional:     false,
    open:         false,
    disabled:     false,
    error:        false,
    dark:         false,
    size:         'md',
    variant:      'default',
    multi:        false,
    searchable:   false,
    value:        '',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 24px; max-width: 320px; height: 300px; background: ${args.dark ? '#120E0A' : 'transparent'};">
      <lib-select
        label="${args.label}"
        placeholder="${args.placeholder}"
        hint="${args.hint}"
        error-message="${args.errorMessage}"
        ?required="${args.required}"
        ?optional="${args.optional}"
        ?open="${args.open}"
        ?disabled="${args.disabled}"
        ?error="${args.error}"
        ?dark="${args.dark}"
        size="${args.size}"
        variant="${args.variant}"
        ?multi="${args.multi}"
        ?searchable="${args.searchable}"
        value="${args.value}"
      >
        <lib-select-option value="es">España</lib-select-option>
        <lib-select-option value="jp">Japón</lib-select-option>
        <lib-select-option value="pt">Portugal</lib-select-option>
        <lib-select-option value="it">Italia</lib-select-option>
        <lib-select-option value="fr" disabled>Francia (no disponible)</lib-select-option>
      </lib-select>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   VARIANTES DE SUPERFICIE
───────────────────────────────────────────────────────── */
export const Variants: Story = {
  name: 'Variants — Default · Filled · Ghost',
  render: (): TemplateResult => html`
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; padding: 32px; background: var(--bg-surface); height: 260px;">

      <lib-select label="Default" hint="Borde visible siempre">
        <lib-select-option value="a">España</lib-select-option>
        <lib-select-option value="b">Portugal</lib-select-option>
        <lib-select-option value="c">Japón</lib-select-option>
      </lib-select>

      <lib-select label="Filled" variant="filled" hint="Fondo washi, borde al enfocar">
        <lib-select-option value="a">Componentes</lib-select-option>
        <lib-select-option value="b">Tokens</lib-select-option>
        <lib-select-option value="c">Patrones</lib-select-option>
      </lib-select>

      <lib-select label="Ghost" variant="ghost" hint="Solo borde inferior">
        <lib-select-option value="a">v0.1.0</lib-select-option>
        <lib-select-option value="b">v0.2.0</lib-select-option>
        <lib-select-option value="c">v1.0.0</lib-select-option>
      </lib-select>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   TAMAÑOS
───────────────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; padding: 32px; background: var(--bg-surface); height: 260px;">

      <lib-select label="SM · 11px" size="sm">
        <lib-select-option value="a">Componentes</lib-select-option>
        <lib-select-option value="b">Tokens</lib-select-option>
      </lib-select>

      <lib-select label="MD · 13px (default)" size="md">
        <lib-select-option value="a">Componentes</lib-select-option>
        <lib-select-option value="b">Tokens</lib-select-option>
      </lib-select>

      <lib-select label="LG · 15px" size="lg">
        <lib-select-option value="a">Componentes</lib-select-option>
        <lib-select-option value="b">Tokens</lib-select-option>
      </lib-select>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   ESTADOS
───────────────────────────────────────────────────────── */
export const States: Story = {
  name: 'States — Default · Error · Disabled',
  render: (): TemplateResult => html`
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 32px; background: var(--bg-surface);">

      <lib-select label="Seleccionado" value="jp" hint="Estado con valor preseleccionado">
        <lib-select-option value="es">España</lib-select-option>
        <lib-select-option value="jp">Japón</lib-select-option>
        <lib-select-option value="it">Italia</lib-select-option>
      </lib-select>

      <lib-select label="Placeholder (vacío)" hint="Primera opción vacía como placeholder">
        <lib-select-option value="es">España</lib-select-option>
        <lib-select-option value="jp">Japón</lib-select-option>
      </lib-select>

      <lib-select
        label="Error"
        required
        error
        error-message="Este campo es obligatorio"
      >
        <lib-select-option value="">Selecciona…</lib-select-option>
        <lib-select-option value="es">España</lib-select-option>
      </lib-select>

      <lib-select
        label="Disabled"
        disabled
        value="enterprise"
        hint="Contacta con soporte para cambiar el plan"
      >
        <lib-select-option value="enterprise">Plan Enterprise</lib-select-option>
      </lib-select>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   SEARCHABLE
───────────────────────────────────────────────────────── */
export const Searchable: Story = {
  name: 'Searchable — búsqueda live',
  render: (): TemplateResult => html`
    <div style="padding: 32px; max-width: 320px; height: 380px; background: var(--bg-surface);">
      <lib-select
        label="Componente"
        required
        searchable
        placeholder="Buscar componente…"
      >
        <lib-select-option value="text-input">Text Input</lib-select-option>
        <lib-select-option value="select">Select</lib-select-option>
        <lib-select-option value="chips">Chips</lib-select-option>
        <lib-select-option value="dropdown">Dropdown</lib-select-option>
        <lib-select-option value="tooltip">Tooltip</lib-select-option>
        <lib-select-option value="modal">Modal</lib-select-option>
        <lib-select-option value="skeleton">Skeleton</lib-select-option>
        <lib-select-option value="counter">Counter</lib-select-option>
        <lib-select-option value="spinner">Spinner</lib-select-option>
      </lib-select>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   MULTI-SELECT
───────────────────────────────────────────────────────── */
export const Multi: Story = {
  name: 'Multi-select con footer',
  render: (): TemplateResult => html`
    <div style="padding: 32px; max-width: 360px; height: 380px; background: var(--bg-surface);">
      <lib-select
        label="Etiquetas"
        multi
        placeholder="Selecciona etiquetas…"
        hint="Las etiquetas se confirman con el botón"
      >
        <lib-select-option value="diseno">Diseño</lib-select-option>
        <lib-select-option value="tipografia">Tipografía</lib-select-option>
        <lib-select-option value="tokens">Tokens</lib-select-option>
        <lib-select-option value="motion">Motion</lib-select-option>
        <lib-select-option value="kintsugi">Kintsugi</lib-select-option>
        <lib-select-option value="a11y">Accesibilidad</lib-select-option>
      </lib-select>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   DARK SURFACE
───────────────────────────────────────────────────────── */
export const Dark: Story = {
  name: 'Dark surface',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 40px;
      background: #120E0A;
      height: 320px;
    ">

      <lib-select
        label="Vista"
        dark
        placeholder="Selecciona vista…"
        hint="Panel de control"
      >
        <lib-select-option value="list">Lista</lib-select-option>
        <lib-select-option value="grid">Grid</lib-select-option>
        <lib-select-option value="kanban">Kanban</lib-select-option>
        <lib-select-option value="calendar">Calendario</lib-select-option>
      </lib-select>

      <lib-select
        label="Componente"
        dark
        searchable
        placeholder="Buscar…"
      >
        <lib-select-option value="select">Select</lib-select-option>
        <lib-select-option value="input">Input</lib-select-option>
        <lib-select-option value="modal">Modal</lib-select-option>
        <lib-select-option value="tooltip">Tooltip</lib-select-option>
      </lib-select>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   CONTEXTO — formulario completo
───────────────────────────────────────────────────────── */
export const FormContext: Story = {
  name: 'Context — formulario de configuración',
  render: (): TemplateResult => html`
    <div style="padding: 40px; max-width: 560px; background: var(--bg-surface);">
      <div style="display: flex; flex-direction: column; gap: 20px;">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <lib-select label="País" required hint="">
            <lib-select-option value="">Selecciona…</lib-select-option>
            <lib-select-option value="es" selected>España</lib-select-option>
            <lib-select-option value="pt">Portugal</lib-select-option>
            <lib-select-option value="fr">Francia</lib-select-option>
            <lib-select-option value="jp">Japón</lib-select-option>
          </lib-select>

          <lib-select label="Idioma" required variant="filled">
            <lib-select-option value="es" selected>Español</lib-select-option>
            <lib-select-option value="en">English</lib-select-option>
            <lib-select-option value="ja">日本語</lib-select-option>
          </lib-select>
        </div>

        <lib-select
          label="Zona horaria"
          variant="filled"
          hint="Se usa para fechas relativas en la interfaz"
        >
          <lib-select-option value="eu">UTC+01:00 — Madrid, París, Roma</lib-select-option>
          <lib-select-option value="utc">UTC+00:00 — Londres, Lisboa</lib-select-option>
          <lib-select-option value="jp">UTC+09:00 — Tokio, Seúl</lib-select-option>
        </lib-select>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <lib-select label="Moneda">
            <lib-select-option value="eur" selected>EUR — Euro</lib-select-option>
            <lib-select-option value="usd">USD — Dólar</lib-select-option>
            <lib-select-option value="jpy">JPY — Yen</lib-select-option>
          </lib-select>

          <lib-select
            label="Plan"
            disabled
            value="enterprise"
            hint="Solo accesible desde Facturación"
          >
            <lib-select-option value="enterprise">Enterprise</lib-select-option>
          </lib-select>
        </div>

      </div>
    </div>
  `,
};