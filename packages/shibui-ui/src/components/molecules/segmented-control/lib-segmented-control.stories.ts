import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';

// ✅ side-effect import — registra el custom element
import './lib-segmented-control.component';
import type { LibSegmentedControl } from './lib-segmented-control.component';
import type { SegmentedOption } from './lib-segmented-control.types';

/* ── Datos de ejemplo reutilizables ── */
const VIEW_OPTS: SegmentedOption[] = [
  { label: 'Vista',  value: 'view'  },
  { label: 'Código', value: 'code'  },
  { label: 'Split',  value: 'split' },
];

const NAV_OPTS: SegmentedOption[] = [
  { label: 'Día',    value: 'day'   },
  { label: 'Semana', value: 'week'  },
  { label: 'Mes',    value: 'month' },
  { label: 'Año',    value: 'year'  },
];

const ICON_OPTS: SegmentedOption[] = [
  { label: 'Mapa',   value: 'map',    icon: 'map-pin'    },
  { label: 'Lista',  value: 'list',   icon: 'list'       },
  { label: 'Grid',   value: 'grid',   icon: 'grid-four'  },
];

const BADGE_OPTS: SegmentedOption[] = [
  { label: 'Inbox',   value: 'inbox',   badge: 12 },
  { label: 'Enviado', value: 'sent'              },
  { label: 'Archivo', value: 'archive', badge: 3  },
];

const DISABLED_OPTS: SegmentedOption[] = [
  { label: 'Vista',    value: 'view'                     },
  { label: 'Código',   value: 'code',  disabled: true    },
  { label: 'Preview',  value: 'preview'                  },
];

/* ================================================================
   Meta
   ================================================================ */
type Args = Partial<LibSegmentedControl> & {
  options?: SegmentedOption[];
  slotLabel?: string;
};

const meta: Meta<Args> = {
  title: 'Components/Molecules/Segmented Control',
  component: 'lib-segmented-control',

  argTypes: {
    variant: {
      control: 'select',
      options: [
        'outline', 'underline', 'pill', 'ghost', 'kaki', 'celadon',
        'dark-outline', 'dark-pill', 'dark-kaki', 'dark-underline',
      ],
      description: 'Variante de superficie',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño',
    },
    disabled: { control: 'boolean' },
    full:     { control: 'boolean', description: 'Ancho completo' },
    glitch:   { control: 'boolean', description: 'Efecto glitch al cambiar' },
  },

  render: (args): TemplateResult => html`
    <div style="padding: var(--lib-space-lg);">
      <lib-segmented-control
        variant="${args.variant ?? 'outline'}"
        size="${args.size ?? 'md'}"
        ?disabled="${args.disabled}"
        ?full="${args.full}"
        ?glitch="${args.glitch}"
        .options="${args.options ?? VIEW_OPTS}"
        .value="${args.value ?? 'view'}"
        @ui-lib-change="${(e: CustomEvent): void => console.log('ui-lib-change', e.detail)}"
      ></lib-segmented-control>
    </div>
  `,
};

export default meta;
type Story = StoryObj<Args>;

/* ================================================================
   Playground
   ================================================================ */
export const Playground: Story = {
  args: {
    variant:  'outline',
    size:     'md',
    disabled: false,
    full:     false,
    glitch:   false,
    options:  VIEW_OPTS,
    value:    'view',
  },
};

/* ================================================================
   Light Variants — las 6 variantes claras del SG
   ================================================================ */
export const LightVariants: Story = {
  name: 'Variantes Light',
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--bg-base);
    ">
      ${(['outline', 'underline', 'pill', 'ghost', 'kaki', 'celadon'] as const).map(v => html`
        <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm)">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted)">${v}</p>
          <lib-segmented-control
            variant="${v}"
            .options="${VIEW_OPTS}"
            value="view"
          ></lib-segmented-control>
        </div>
      `)}
    </div>
  `,
};

/* ================================================================
   Dark Variants
   ================================================================ */
export const DarkVariants: Story = {
  name: 'Variantes Dark',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-xl);
      padding: var(--lib-space-xl);
      background: var(--color-washi-950);
    ">
      ${(['dark-outline', 'dark-pill', 'dark-kaki', 'dark-underline'] as const).map(v => html`
        <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm)">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:rgba(250,247,244,.3)">${v}</p>
          <lib-segmented-control
            variant="${v}"
            .options="${VIEW_OPTS}"
            value="view"
          ></lib-segmented-control>
        </div>
      `)}
    </div>
  `,
};

/* ================================================================
   Sizes
   ================================================================ */
export const Sizes: Story = {
  name: 'Tamaños',
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-lg);
      padding: var(--lib-space-xl);
      align-items: flex-start;
    ">
      ${(['sm', 'md', 'lg'] as const).map(s => html`
        <div style="display:flex;align-items:center;gap:var(--lib-space-lg)">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--text-muted);width:24px">${s}</span>
          <lib-segmented-control
            variant="outline"
            size="${s}"
            .options="${VIEW_OPTS}"
            value="view"
          ></lib-segmented-control>
          <lib-segmented-control
            variant="pill"
            size="${s}"
            .options="${VIEW_OPTS}"
            value="view"
          ></lib-segmented-control>
        </div>
      `)}
    </div>
  `,
};

/* ================================================================
   Full Width
   ================================================================ */
export const FullWidth: Story = {
  name: 'Ancho completo',
  render: (): TemplateResult => html`
    <div style="padding: var(--lib-space-xl); display:flex; flex-direction:column; gap: var(--lib-space-lg);">
      <lib-segmented-control
        variant="outline"
        ?full="${true}"
        .options="${NAV_OPTS}"
        value="week"
      ></lib-segmented-control>
      <lib-segmented-control
        variant="pill"
        ?full="${true}"
        .options="${NAV_OPTS}"
        value="month"
      ></lib-segmented-control>
    </div>
  `,
};

/* ================================================================
   With Icons
   ================================================================ */
export const WithIcons: Story = {
  name: 'Con iconos',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);padding:var(--lib-space-xl);">
      <lib-segmented-control
        variant="outline"
        .options="${ICON_OPTS}"
        value="map"
      ></lib-segmented-control>
      <lib-segmented-control
        variant="pill"
        .options="${ICON_OPTS}"
        value="list"
      ></lib-segmented-control>
      <!-- Solo iconos -->
      <lib-segmented-control
        variant="outline"
        ?icon-only="${true}"
        .options="${ICON_OPTS}"
        value="grid"
      ></lib-segmented-control>
    </div>
  `,
};

/* ================================================================
   With Badges
   ================================================================ */
export const WithBadges: Story = {
  name: 'Con badges',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);display:flex;flex-direction:column;gap:var(--lib-space-lg);">
      <lib-segmented-control
        variant="outline"
        .options="${BADGE_OPTS}"
        value="inbox"
      ></lib-segmented-control>
      <lib-segmented-control
        variant="kaki"
        .options="${BADGE_OPTS}"
        value="inbox"
      ></lib-segmented-control>
    </div>
  `,
};

/* ================================================================
   Disabled States
   ================================================================ */
export const DisabledStates: Story = {
  name: 'Estados deshabilitados',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);display:flex;flex-direction:column;gap:var(--lib-space-lg);">
      <!-- Control completamente deshabilitado -->
      <lib-segmented-control
        variant="outline"
        ?disabled="${true}"
        .options="${VIEW_OPTS}"
        value="view"
      ></lib-segmented-control>

      <!-- Una opción individual deshabilitada -->
      <lib-segmented-control
        variant="outline"
        .options="${DISABLED_OPTS}"
        value="view"
      ></lib-segmented-control>
    </div>
  `,
};

/* ================================================================
   Glitch Variant
   ================================================================ */
export const GlitchVariant: Story = {
  name: 'Glitch',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="
      padding: var(--lib-space-xl);
      background: var(--color-washi-900);
      display:flex;
      flex-direction:column;
      gap:var(--lib-space-lg);
    ">
      <p style="font-family:var(--lib-font-mono);font-size:10px;color:rgba(250,247,244,.3);letter-spacing:.15em;text-transform:uppercase;">
        Haz clic para ver el efecto glitch
      </p>
      <lib-segmented-control
        variant="dark-kaki"
        ?glitch="${true}"
        .options="${VIEW_OPTS}"
        value="view"
      ></lib-segmented-control>
      <lib-segmented-control
        variant="dark-outline"
        ?glitch="${true}"
        .options="${NAV_OPTS}"
        value="week"
      ></lib-segmented-control>
    </div>
  `,
};

/* ================================================================
   Demo Panel — segmented como tab controller
   ================================================================ */
export const DemoPanel: Story = {
  name: 'Demo Panel',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);max-width:520px;">
      <demo-segmented-panel></demo-segmented-panel>
    </div>

    <script>
      // Inline demo usando el componente real
      class DemoSegmentedPanel extends HTMLElement {
        constructor() { super(); }
        connectedCallback() {
          this.innerHTML = '';
          const seg = document.createElement('lib-segmented-control');
          seg.setAttribute('variant','outline');
          const opts = [
            { label:'Vista',   value:'view'    },
            { label:'Código',  value:'code'    },
            { label:'Preview', value:'preview' },
          ];
          seg.options = opts;
          seg.value = 'view';

          const panel = document.createElement('div');
          panel.style.cssText = 'margin-top:1rem;border:1px solid var(--border-subtle);padding:1.5rem;font-family:var(--lib-font-mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted)';
          panel.textContent = 'CONTENIDO — VISTA';

          seg.addEventListener('ui-lib-change', (e) => {
            panel.textContent = 'CONTENIDO — ' + e.detail.value.toUpperCase();
          });

          this.appendChild(seg);
          this.appendChild(panel);
        }
      }
      if (!customElements.get('demo-segmented-panel')) {
        customElements.define('demo-segmented-panel', DemoSegmentedPanel);
      }
    </script>
  `,
};