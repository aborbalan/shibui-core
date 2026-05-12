import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';

// ✅ side-effect import — registra el custom element
import './lib-text-list.component';
import type { LibTextList } from './lib-text-list.component';
import type { ContentItem, UiItem, DlItem } from './lib-text-list.types';

/* ================================================================
   DATOS DE EJEMPLO
   ================================================================ */

const CONTENT_ITEMS: ContentItem[] = [
  { label: 'Tokens de color — washi, kaki, celadón' },
  { label: 'Sistema tipográfico — Cormorant · Shippori · DM Mono' },
  { label: 'Espaciado con escala base 4px' },
  { label: 'Sombras y radios de borde' },
];

const NESTED_ITEMS: ContentItem[] = [
  {
    label: 'Design System',
    children: [
      { label: 'Tokens de color' },
      { label: 'Tipografía' },
      { label: 'Espaciado' },
    ],
  },
  {
    label: 'Componentes',
    children: [
      { label: 'Entradas' },
      { label: 'Navegación' },
      { label: 'Overlays' },
    ],
  },
  { label: 'Kintsugi' },
];

const CHECK_ITEMS: ContentItem[] = [
  { label: 'Accesibilidad WCAG AA',      checked: true  },
  { label: 'CSS nativo, sin dependencias', checked: true  },
  { label: 'Semántica HTML correcta',    checked: true  },
  { label: 'Internacionalización RTL',   checked: false },
];

const UI_ITEMS_BASIC: UiItem[] = [
  { key: 'profile',  label: 'Mi perfil',     desc: 'Actualiza tus datos', icon: 'user',         iconVariant: 'default', chevron: true },
  { key: 'notif',   label: 'Notificaciones', desc: 'Configura alertas',   icon: 'bell',          iconVariant: 'kaki',    badge: { label: '3', variant: 'kaki' }, chevron: true },
  { key: 'privacy', label: 'Privacidad',     desc: 'Permisos y acceso',   icon: 'shield-check',  iconVariant: 'celadon', chevron: true },
];

const UI_ITEMS_GROUPED: UiItem[] = [
  { type: 'header', label: 'Cuenta' },
  { key: 'profile',  label: 'Mi perfil',  icon: 'user',    iconVariant: 'default', chevron: true },
  { key: 'plan',     label: 'Plan actual', icon: 'crown',  iconVariant: 'kaki',    meta: 'Pro', chevron: true },
  { type: 'separator' },
  { type: 'header', label: 'Preferencias' },
  { key: 'dark',    label: 'Modo oscuro',  icon: 'moon',   iconVariant: 'default', toggle: false },
  { key: 'compact', label: 'Vista compacta', icon: 'rows', iconVariant: 'default', toggle: true  },
  { type: 'separator' },
  { key: 'logout',  label: 'Cerrar sesión', icon: 'sign-out', danger: true },
];

const UI_ITEMS_AVATAR: UiItem[] = [
  { key: 'ana',    label: 'Ana García',    desc: 'Diseñadora UX',  avatar: 'AG', meta: 'En línea' },
  { key: 'pablo',  label: 'Pablo Torres',  desc: 'Dev Frontend',   avatar: 'PT', meta: 'Hace 5m'  },
  { key: 'lucia',  label: 'Lucía Martín',  desc: 'Product Manager', avatar: 'LM', meta: 'Ayer'    },
];

const DL_ITEMS: DlItem[] = [
  { term: 'Versión',      description: '1.0.0' },
  { term: 'Licencia',     description: 'MIT' },
  { term: 'Autor',        description: 'Shibui Team' },
  { term: 'Repositorio',  description: 'github.com/shibui/ui', mono: true },
  { term: 'Dependencias', description: 'Lit 3, TypeScript 5' },
];

/* ================================================================
   META
   ================================================================ */

type Args = Partial<LibTextList>;

const meta: Meta<Args> = {
  title: 'Components/Atoms/Text List',
  component: 'lib-text-list',
  tags:['autodocs'],
  argTypes: {
    family: {
      control: 'select',
      options: ['ul', 'ol', 'ui', 'dl'],
      description: 'Familia de lista',
    },
    marker: {
      control: 'select',
      options: ['default', 'kaki', 'dash', 'check'],
      description: 'Viñeta (solo ul)',
    },
    counter: {
      control: 'select',
      options: ['decimal', 'roman', 'alpha'],
      description: 'Contador (solo ol)',
    },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    divided:     { control: 'boolean' },
    bordered:    { control: 'boolean' },
    inset:       { control: 'boolean' },
    interactive: { control: 'boolean' },
    dark:        { control: 'boolean' },
    loading:     { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Args>;

/* ================================================================
   Playground
   ================================================================ */
export const Playground: Story = {
  args: {
    family:   'ul',
    marker:   'default',
    size:     'md',
    dark:     false,
    loading:  false,
  },
  render: (args): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:480px;">
      <lib-text-list
        family="${args.family ?? 'ul'}"
        marker="${args.marker ?? 'default'}"
        size="${args.size ?? 'md'}"
        ?dark="${args.dark}"
        ?loading="${args.loading}"
        .items="${CONTENT_ITEMS}"
      ></lib-text-list>
    </div>
  `,
};

/* ================================================================
   Content — Bullets
   ================================================================ */
export const ContentBullets: Story = {
  name: 'Content — Viñetas',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-xl);">
      ${(['default', 'kaki', 'dash'] as const).map(m => html`
        <div style="min-width:200px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">${m}</p>
          <lib-text-list
            family="ul"
            marker="${m}"
            .items="${CONTENT_ITEMS}"
          ></lib-text-list>
        </div>
      `)}

      <div style="min-width:200px;">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">check</p>
        <lib-text-list
          family="ul"
          marker="check"
          .items="${CHECK_ITEMS}"
        ></lib-text-list>
      </div>
    </div>
  `,
};

/* ================================================================
   Content — Ordered
   ================================================================ */
export const ContentOrdered: Story = {
  name: 'Content — Ordenadas',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-xl);">
      ${(['decimal', 'roman', 'alpha'] as const).map(c => html`
        <div style="min-width:200px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">${c}</p>
          <lib-text-list
            family="ol"
            counter="${c}"
            .items="${CONTENT_ITEMS}"
          ></lib-text-list>
        </div>
      `)}
    </div>
  `,
};

/* ================================================================
   Content — Nested + Sizes
   ================================================================ */
export const ContentNestedSizes: Story = {
  name: 'Content — Anidada · Tamaños',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-xl);">
      <div style="min-width:240px;">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">Anidada</p>
        <lib-text-list
          family="ul"
          .items="${NESTED_ITEMS}"
        ></lib-text-list>
      </div>

      <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);">
        ${(['sm', 'md', 'lg'] as const).map(s => html`
          <div>
            <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">.lst-${s}</p>
            <lib-text-list
              family="ul"
              size="${s}"
              .items="${CONTENT_ITEMS.slice(0, 3)}"
            ></lib-text-list>
          </div>
        `)}
      </div>
    </div>
  `,
};

/* ================================================================
   UI List — basic
   ================================================================ */
export const UiListBasic: Story = {
  name: 'UI List — básica',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:480px;">
      <lib-text-list
        family="ui"
        ?divided="${true}"
        ?bordered="${true}"
        ?interactive="${true}"
        .uiItems="${UI_ITEMS_BASIC}"
        @ui-lib-row-click="${(e: CustomEvent): void => console.log('click', e.detail)}"
      ></lib-text-list>
    </div>
  `,
};

/* ================================================================
   UI List — grouped with sections
   ================================================================ */
export const UiListGrouped: Story = {
  name: 'UI List — agrupada con secciones',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:420px;">
      <lib-text-list
        family="ui"
        ?bordered="${true}"
        ?interactive="${true}"
        .uiItems="${UI_ITEMS_GROUPED}"
        @ui-lib-row-click="${(e: CustomEvent): void => console.log('click', e.detail)}"
        @ui-lib-toggle="${(e: CustomEvent): void => console.log('toggle', e.detail)}"
      ></lib-text-list>
    </div>
  `,
};

/* ================================================================
   UI List — avatars
   ================================================================ */
export const UiListAvatars: Story = {
  name: 'UI List — avatares',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:420px;">
      <lib-text-list
        family="ui"
        ?divided="${true}"
        ?bordered="${true}"
        ?interactive="${true}"
        .uiItems="${UI_ITEMS_AVATAR}"
      ></lib-text-list>
    </div>
  `,
};

/* ================================================================
   UI List — dark
   ================================================================ */
export const UiListDark: Story = {
  name: 'UI List — dark',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:420px;background:var(--color-washi-950);">
      <lib-text-list
        family="ui"
        ?divided="${true}"
        ?bordered="${true}"
        ?interactive="${true}"
        ?dark="${true}"
        .uiItems="${UI_ITEMS_GROUPED}"
      ></lib-text-list>
    </div>
  `,
};

/* ================================================================
   Description List
   ================================================================ */
export const DescriptionList: Story = {
  name: 'List',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-xl);">
      <div style="min-width:280px;">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">inline (default)</p>
        <lib-text-list
          family="dl"
          dl-layout="inline"
          .dlItems="${DL_ITEMS}"
        ></lib-text-list>
      </div>

      <div style="min-width:320px;">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">wide + divided</p>
        <lib-text-list
          family="dl"
          dl-layout="wide"
          ?dl-divided="${true}"
          .dlItems="${DL_ITEMS}"
        ></lib-text-list>
      </div>

      <div style="min-width:200px;">
        <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-sm)">stack</p>
        <lib-text-list
          family="dl"
          dl-layout="stack"
          .dlItems="${DL_ITEMS}"
        ></lib-text-list>
      </div>
    </div>
  `,
};

/* ================================================================
   Loading skeleton
   ================================================================ */
export const Loading: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;gap:var(--lib-space-xl);padding:var(--lib-space-xl);">
      <lib-text-list family="ul" ?loading="${true}" skeleton-count="4"></lib-text-list>
      <lib-text-list family="ol" ?loading="${true}" skeleton-count="4"></lib-text-list>
    </div>
  `,
};