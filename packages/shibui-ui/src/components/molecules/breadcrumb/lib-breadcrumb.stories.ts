import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult }            from 'lit';
import './lib-breadcrumb.component';
import type { LibBreadcrumb }              from './lib-breadcrumb.component';
import type { BreadcrumbItem }             from './lib-breadcrumb.types';
import { createKatachiStories }            from '../../../stories/katachi-stories.helper';

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
  title: 'Universal/Navigation/Breadcrumb',
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
    variant: {
      control: 'select',
      options: ['default', 'filled', 'pill'],
    },
    tone: {
      control: 'select',
      options: ['default', 'accent', 'info', 'strong'],
    },
    dark: { control: 'boolean' },
    maxVisible: { control: 'number' },
  },
  render: (args): TemplateResult => html`
    <div style="padding: 24px; background: ${args.dark ? 'var(--color-washi-950)' : 'var(--bg-base)'};">
      <lib-breadcrumb
        separator="${args.separator}"
        size="${args.size}"
        variant="${args.variant}"
        tone="${args.tone}"
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
    variant:    'default',
    tone:       'default',
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
        { variant: 'default', label: 'Default — sin contenedor' },
        { variant: 'filled',  label: '.bc-filled — barra con fondo' },
        { variant: 'pill',    label: '.bc-pill — crumbs individuales' },
      ] as const).map(({ variant, label }) => html`
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <lib-breadcrumb separator="slash" variant="${variant}" .items="${BASE_ITEMS}"></lib-breadcrumb>
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">${label}</span>
        </div>
      `)}
    </div>
  `,
};


/* ── Acentos ───────────────────────────────────────────── */
export const Accents: Story = {
  name: 'Tono en ítem activo — accent · info · strong',
  render: (): TemplateResult => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
      ${([
        { tone: 'accent',    label: '.bc-accent' },
        { tone: 'info', label: '.bc-info' },
        { tone: 'strong',    label: '.bc-bold' },
      ] as const).map(({ tone, label }) => html`
        <div style="display: grid; grid-template-columns: 100px 1fr; align-items: center; gap: 16px;">
          <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.08em; text-transform: uppercase;">${label}</span>
          <lib-breadcrumb separator="slash" tone="${tone}" .items="${BASE_ITEMS}"></lib-breadcrumb>
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
      <lib-breadcrumb separator="chevron" variant="filled" .items="${ICON_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="chevron" variant="pill"   .items="${ICON_ITEMS}"></lib-breadcrumb>
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
          variant="filled"
          tone="accent"
          max-visible="2"
          .items="${DEEP_ITEMS}"
        ></lib-breadcrumb>
        <span style="font-family: var(--lib-font-mono); font-size: 10px; color: var(--text-muted); letter-spacing: 0.25em; text-transform: uppercase;">Filled · accent · chevron · max-visible=2</span>
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
      <lib-breadcrumb separator="slash"   dark variant="filled" .items="${BASE_ITEMS}"></lib-breadcrumb>
      <lib-breadcrumb separator="chevron" dark variant="pill"   .items="${BASE_ITEMS}"></lib-breadcrumb>

      <!-- En cabecera de página oscura -->
      <div style="padding-top: 24px; border-top: 1px solid oklch(16% 0.02 45); display: flex; flex-direction: column; gap: 12px;">
        <lib-breadcrumb
          separator="dot"
          size="sm"
          dark
          tone="accent"
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
   KATACHI · 形 · Las 6 historias estándar
   lib-breadcrumb usa tokens semánticos de texto y fondo
   (text-primary, bg-base, border-subtle) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="padding:var(--lib-space-md);background:var(--bg-base);border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--lib-space-md);">
    <lib-breadcrumb separator="slash" size="sm" .items="${[
      { label: 'Inicio', href: '#' },
      { label: 'Diseño', href: '#' },
      { label: 'Katachi' },
    ]}"></lib-breadcrumb>
    <lib-breadcrumb separator="chevron" size="md" variant="filled" .items="${[
      { label: 'Inicio', href: '#' },
      { label: 'Diseño', href: '#' },
      { label: 'Katachi' },
    ]}"></lib-breadcrumb>
    <lib-breadcrumb separator="dot" size="lg" variant="pill" tone="accent" .items="${[
      { label: 'Inicio', href: '#' },
      { label: 'Diseño', href: '#' },
      { label: 'Katachi' },
    ]}"></lib-breadcrumb>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;