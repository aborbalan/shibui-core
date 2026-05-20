import { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, fireEvent } from 'storybook/test';
import { html, TemplateResult } from 'lit';
import './lib-button.component';
import type { LibButton } from './lib-button.component';
import type { UiClickEventDetail } from '../../../types';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibButtonStoryArgs = LibButton & { slotContent?: string | TemplateResult };

const meta: Meta<LibButtonStoryArgs> = {
  title: 'Actions/Button',
  tags: ['autodocs'],
  component: 'lib-button',

  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger'],
      description: 'Rol semántico del botón (prominencia y comportamiento). La estética viene del contexto katachi del ancestor.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tamaño del botón',
    },
    disabled: {
      control: 'boolean',
      description: 'Estado deshabilitado',
    },
    glass: {
      control: 'boolean',
      description: 'Activa el efecto Agua (glassmorphism)',
    },
    spotlight: {
      control: 'boolean',
      description: 'Activa el overlay spotlight reactivo al cursor',
    },
  },
  render: (args): TemplateResult => html`
    <lib-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?glass=${args.glass}
      ?spotlight=${args.spotlight}
    >
      ${args.slotContent || 'Shibui Button'}
    </lib-button>
  `,
};

export default meta;
type Story = StoryObj<LibButtonStoryArgs>;

export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    glass: false,
    spotlight: false,
    slotContent: 'Shibui Button',
  },
};

/* ── Roles semánticos (sin contexto katachi) ── */
export const AllVariants: Story = {
  name: 'Roles — sin contexto',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="primary">Primary</lib-button>
      <lib-button variant="secondary">Secondary</lib-button>
      <lib-button variant="ghost">Ghost</lib-button>
      <lib-button variant="accent">Accent</lib-button>
      <lib-button variant="danger">Danger</lib-button>
    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="primary" size="sm">Small</lib-button>
      <lib-button variant="primary" size="md">Medium</lib-button>
      <lib-button variant="primary" size="lg">Large</lib-button>
    </div>
  `,
};

/* ── Disabled ── */
export const Disabled: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="primary"   ?disabled=${true}>Primary</lib-button>
      <lib-button variant="secondary" ?disabled=${true}>Secondary</lib-button>
      <lib-button variant="ghost"     ?disabled=${true}>Ghost</lib-button>
      <lib-button variant="accent"    ?disabled=${true}>Accent</lib-button>
      <lib-button variant="danger"    ?disabled=${true}>Danger</lib-button>
    </div>
  `,
};

/* ── Glass — Efecto Agua ── */
export const GlassEffect: Story = {
  name: 'Glass — Efecto Agua',
  parameters: { backgrounds: { default: 'gradient' } },
  render: (): TemplateResult => html`
    <div style="
      padding: var(--lib-space-xl);
      display: flex; flex-wrap: wrap;
      gap: var(--lib-space-md);
      align-items: center; justify-content: center;
    ">
      <lib-button ?glass=${true}>Paper Glass</lib-button>
      <lib-button ?glass=${true} variant="primary">Water Glass</lib-button>
      <lib-button ?glass=${true} variant="accent">Kaki Glass</lib-button>
    </div>
  `,
};

/* ── Spotlight — Efecto cursor ── */
export const SpotlightEffect: Story = {
  name: 'Spotlight — Efecto cursor',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="
      display: flex; flex-wrap: wrap; gap: var(--lib-space-md);
      align-items: center; justify-content: center;
      padding: var(--lib-space-xl);
      background: var(--color-washi-950, #120E0A);
    ">
      <lib-button variant="primary"   ?spotlight=${true}>Primary</lib-button>
      <lib-button variant="secondary" ?spotlight=${true}>Secondary</lib-button>
      <lib-button variant="accent"    ?spotlight=${true}>Accent</lib-button>
    </div>
  `,
};

/* ── Con iconos en slots ── */
export const WithIcons: Story = {
  name: 'With Icon Slots',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="primary">
        <span slot="prefix">→</span>
        Siguiente
      </lib-button>
      <lib-button variant="secondary">
        Exportar
        <span slot="suffix">↗</span>
      </lib-button>
      <lib-button variant="danger">
        <span slot="prefix">✕</span>
        Eliminar
      </lib-button>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Efectos ambient por contexto estético
   ═══════════════════════════════════════════════════════════════
   Los efectos decorativos (gold border, glaze shimmer, brutal
   shadow) se activan automáticamente cuando el componente vive
   dentro de un ancestor con [data-katachi="x"].
   ═══════════════════════════════════════════════════════════════ */

/* ── Katachi · vista general (6 contextos) ── */
export const KatachiContexts: Story = {
  name: 'Katachi · 6 contextos',
  render: (): TemplateResult => html`
    <div style="
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: var(--lib-space-lg);
      padding: var(--lib-space-xl);
      background: var(--color-washi-100);
    ">
      ${([
        { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
        { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
        { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
        { id: 'terminal', kanji: '>_', label: 'terminal' },
        { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
        { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
      ] as const).map(k => html`
        <section
          data-katachi="${k.id}"
          style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);"
        >
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
            <lib-button variant="primary">Primary</lib-button>
            <lib-button variant="secondary">Secondary</lib-button>
            <lib-button variant="ghost">Ghost</lib-button>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 6 historias estándar generadas con el helper
   Cada componente debe tener estas historias como mínimo.
   ═══════════════════════════════════════════════════════════════ */

export const {
  KatachiShizen,
  KatachiWabi,
  KatachiKintsugi,
  KatachiCeladon,
  KatachiSabi,
  KatachiTerminal,
} = createKatachiStories<LibButtonStoryArgs>(() => html`
  <lib-button variant="primary">Primary</lib-button>
  <lib-button variant="secondary">Secondary</lib-button>
  <lib-button variant="ghost">Ghost</lib-button>
  <lib-button variant="accent">Accent</lib-button>
  <lib-button variant="danger">Danger</lib-button>
`);

/* ═══════════════════════════════════════════════════════════════
   TESTS · Interacción y eventos
   ═══════════════════════════════════════════════════════════════ */

export const TestClickEvent: Story = {
  name: 'Test · ui-lib-click se dispara con detail',
  tags: ['test'],
  args: { variant: 'primary', size: 'md', disabled: false },
  play: async ({ canvasElement }): Promise<void> => {
    const btn = canvasElement.querySelector('lib-button') as HTMLElement;
    const shadowBtn = btn.shadowRoot!.querySelector('.btn') as HTMLElement;

    let detail: UiClickEventDetail | null = null;
    canvasElement.addEventListener('ui-lib-click', (e) => {
      detail = (e as CustomEvent<UiClickEventDetail>).detail;
    }, { once: true });

    await userEvent.click(shadowBtn);

    expect(detail).not.toBeNull();
    expect(detail!.timestamp).toBeGreaterThan(0);
  },
};

export const TestDisabledBlocksEvent: Story = {
  name: 'Test · disabled bloquea el evento',
  tags: ['test'],
  args: { variant: 'primary', size: 'md', disabled: true },
  play: async ({ canvasElement }): Promise<void> => {
    const btn = canvasElement.querySelector('lib-button') as HTMLElement;
    const shadowBtn = btn.shadowRoot!.querySelector('.btn') as HTMLElement;

    let fired = false;
    canvasElement.addEventListener('ui-lib-click', () => { fired = true; }, { once: true });

    // fireEvent bypasses pointer-events:none on disabled button; component handler still checks disabled
    fireEvent.click(shadowBtn);

    expect(fired).toBe(false);
  },
};
