import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult }            from 'lit';
import './lib-breadcrumb.component';
import type { LibBreadcrumb }              from './lib-breadcrumb.component';
import type { BreadcrumbItem }             from './lib-breadcrumb.types';

type StoryArgs = LibBreadcrumb & { items?: BreadcrumbItem[] };

/* ── Items de ejemplo ──────────────────────────────────── */
const BASE_ITEMS: BreadcrumbItem[] = [
  { label: 'Shibui',       href: '/' },
  { label: 'Componentes',  href: '/components' },
  { label: 'Breadcrumb' },
];

const DEEP_ITEMS: BreadcrumbItem[] = [
  { label: 'Shibui',        href: '/' },
  { label: 'Design System', href: '/ds' },
  { label: 'Componentes',   href: '/ds/components' },
  { label: 'Moléculas',     href: '/ds/components/molecules' },
  { label: 'Breadcrumb' },
];

const ICON_ITEMS: BreadcrumbItem[] = [
  { label: '',          href: '/',          icon: 'house' },
  { label: 'Proyectos', href: '/projects',  icon: 'folder' },
  { label: 'Shibui UI', href: '/projects/shibui', icon: 'folder' },
  { label: 'breadcrumb.css',                icon: 'file-css' },
];

/* ── Meta ──────────────────────────────────────────────── */
const meta: Meta<StoryArgs> = {
  title: 'Navigation/Breadcrumb',
  component: 'lib-breadcrumb',
  tags:['autodocs'],
  argTypes: {
    separator: {
      control: 'select',
      options: ['slash', 'chevron', 'dot', 'line'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    surface: {
      control: 'select',
      options: ['default', 'filled', 'pill'],
    },
    accent: {
      control: 'select',
      options: ['none', 'kaki', 'celadon', 'bold'],
    },
    dark: { control: 'boolean' },
    maxVisible: { control: 'number' },
  },
  render: (args): TemplateResult => html`
    <div style="padding: 24px; background: ${args.dark ? 'var(--color-washi-950)' : 'var(--bg-base)'};">
      <lib-breadcrumb
        separator="${args.separator}"
        size="${args.size}"
        surface="${args.surface}"
        accent="${args.accent}"
        ?dark="${args.dark}"
        max-visible="${args.maxVisible ?? 0}"
        .items="${args.items ?? BASE_ITEMS}"
      ></lib-breadcrumb>
    </div>
  `,
};

export default meta;
type Story = StoryObj<StoryArgs>;

/* ── Playground ────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    separator:  'slash',
    size:       'md',
    surface:    'default',
    accent:     'none',
    dark:       false,
    maxVisible: 0,
    items:      BASE_ITEMS,
  },
};


/* ── Separadores ───────────────────────────────────────── */
export const Separators: Story = {
  name: 'Separadores — slash · chevron · dot · line',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
      ${(['slash', 'chevron', 'dot', 'line'] as const).map(sep => html`
        <div style="display: grid; grid-template-columns: 80px 1fr; align-items: center; gap: 16px;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase;">
            .bc-${sep}
          </span>
          <lib-breadcrumb separator="${sep}" .items="${DEEP_ITEMS}"></lib-breadcrumb>
        </div>
      `)}
    </div>
  `,
};


/* ── Tamaños ───────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Tamaños — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
      ${([
        { size: 'sm', label: 'SM · 10px' },
        { size: 'md', label: 'MD · 11px · default' },
        { size: 'lg', label: 'LG · 13px Shippori' },
      ] as const).map(({ size, label }) => html`
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <lib-breadcrumb separator="slash" size="${size}" .items="${BASE_ITEMS}"></lib-breadcrumb>
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">${label}</span>
        </div>
      `)}
    </div>
  `,
};


/* ── Superficies ───────────────────────────────────────── */
export const Surfaces: Story = {
  name: 'Superficies — default · filled · pill',
  render: (): TemplateResult => html`
    <div style="padding: 24px; background: var(--bg-surface); display: flex; flex-direction: column; gap: 20px;">
      ${([
        { surface: 'default', label: 'Default — sin contenedor' },
        { surface: 'filled',  label: '.bc-filled — barra con fondo' },
        { surface: 'pill',    label: '.bc-pill — crumbs individuales' },
      ] as const).map(({ surface, label }) => html`
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <lib-breadcrumb separator="slash" surface="${surface}" .items="${BASE_ITEMS}"></lib-breadcrumb>
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">${label}</span>
        </div>
      `)}
    </div>
  `,
};


/* ── Acentos ───────────────────────────────────────────── */
export const Accents: Story = {
  name: 'Acentos en ítem activo — kaki · celadón · bold',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
      ${([
        { accent: 'kaki',    label: '.bc-kaki' },
        { accent: 'celadon', label: '.bc-celadon' },
        { accent: 'bold',    label: '.bc-bold' },
      ] as const).map(({ accent, label }) => html`
        <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 16px;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase;">${label}</span>
          <lib-breadcrumb separator="slash" accent="${accent}" .items="${BASE_ITEMS}"></lib-breadcrumb>
        </div>
      `)}
    </div>
  `,
};


/* ── Con iconos ────────────────────────────────────────── */
export const WithIcons: Story = {
  name: 'Con iconos — home · carpeta · archivo',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px;">
      <lib-breadcrumb separator="chevron" .items="${ICON_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="chevron" surface="filled" .items="${ICON_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="chevron" surface="pill"   .items="${ICON_ITEMS}"></lib-breadcrumb>
    </div>
  `,
};


/* ── Truncado ──────────────────────────────────────────── */
export const Collapsed: Story = {
  name: 'Truncado — collapse expansible',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 20px;">
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <lib-breadcrumb
          separator="slash"
          max-visible="2"
          .items="${DEEP_ITEMS}"
        ></lib-breadcrumb>
        <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">max-visible=2 → clic en … para expandir</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <lib-breadcrumb
          separator="chevron"
          surface="filled"
          accent="kaki"
          max-visible="2"
          .items="${DEEP_ITEMS}"
        ></lib-breadcrumb>
        <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">Filled · kaki · chevron · max-visible=2</span>
      </div>
    </div>
  `,
};


/* ── Dark surface ──────────────────────────────────────── */
export const DarkSurface: Story = {
  name: 'Dark — superficie oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding: 32px; background: var(--color-washi-950); display: flex; flex-direction: column; gap: 24px;">

      <lib-breadcrumb separator="slash"   dark .items="${BASE_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="slash"   dark surface="filled" .items="${BASE_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="chevron" dark surface="pill"   .items="${BASE_ITEMS}"></lib-breadcrumb>

      <!-- En cabecera de página oscura -->
      <div style="padding-top: 24px; border-top: 1px solid oklch(16% 0.02 45); display: flex; flex-direction: column; gap: 12px;">
        <lib-breadcrumb
          separator="dot"
          size="sm"
          dark
          accent="kaki"
          .items="${[
            { label: 'Dashboard',       href: '/' },
            { label: 'Configuración',   href: '/settings' },
            { label: 'API Keys' },
          ]}"
        ></lib-breadcrumb>
        <p style="font-family: var(--lib-font-display); font-size: 1.5rem; font-weight: 300; color: oklch(72% 0.02 55); letter-spacing: -0.02em;">
          Tokens de API
        </p>
      </div>

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
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <lib-breadcrumb .items="${[
            { label: 'Inicio', href: '#' },
            { label: 'Diseño', href: '#' },
            { label: 'Katachi' },
          ]}"></lib-breadcrumb>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};