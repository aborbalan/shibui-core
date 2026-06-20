import { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, userEvent, fireEvent } from 'storybook/test';
import { html, TemplateResult } from 'lit';
import './lib-button.component';
import type { LibButton } from './lib-button.component';
import type { UiClickEventDetail } from '../../../types';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibButtonStoryArgs = LibButton & { slotContent?: string | TemplateResult };

const meta: Meta<LibButtonStoryArgs> = {
  title: 'Universal/Actions/Button',
  tags: ['autodocs'],
  component: 'lib-button',

  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outlined', 'ghost'],
      description: 'Tratamiento visual del botón (prominencia). La estética viene del contexto katachi del ancestor.',
    },
    tone: {
      control: 'select',
      options: ['default', 'accent', 'error'],
      description: 'Tinte semántico del botón.',
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
      tone=${args.tone ?? 'default'}
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
    variant: 'solid',
    tone: 'default',
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
      <lib-button variant="solid">Primary</lib-button>
      <lib-button variant="outlined">Secondary</lib-button>
      <lib-button variant="ghost">Ghost</lib-button>
      <lib-button tone="accent">Accent</lib-button>
      <lib-button tone="error">Danger</lib-button>
    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="solid" size="sm">Small</lib-button>
      <lib-button variant="solid" size="md">Medium</lib-button>
      <lib-button variant="solid" size="lg">Large</lib-button>
    </div>
  `,
};

/* ── Disabled ── */
export const Disabled: Story = {
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="solid"   ?disabled=${true}>Primary</lib-button>
      <lib-button variant="outlined" ?disabled=${true}>Secondary</lib-button>
      <lib-button variant="ghost"     ?disabled=${true}>Ghost</lib-button>
      <lib-button tone="accent"    ?disabled=${true}>Accent</lib-button>
      <lib-button tone="error"    ?disabled=${true}>Danger</lib-button>
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
      <lib-button ?glass=${true} variant="solid">Water Glass</lib-button>
      <lib-button ?glass=${true} tone="accent">Kaki Glass</lib-button>
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
      <lib-button variant="solid"   ?spotlight=${true}>Primary</lib-button>
      <lib-button variant="outlined" ?spotlight=${true}>Secondary</lib-button>
      <lib-button tone="accent"    ?spotlight=${true}>Accent</lib-button>
    </div>
  `,
};

/* ── Con iconos en slots ── */
export const WithIcons: Story = {
  name: 'With Icon Slots',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="solid">
        <span slot="prefix">→</span>
        Siguiente
      </lib-button>
      <lib-button variant="outlined">
        Exportar
        <span slot="suffix">↗</span>
      </lib-button>
      <lib-button tone="error">
        <span slot="prefix">✕</span>
        Eliminar
      </lib-button>
    </div>
  `,
};


/* ═══════════════════════════════════════════════════════════════
   KATACHI · 6 historias estándar generadas con el helper
   Cada componente debe tener estas historias como mínimo.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<LibButtonStoryArgs>(() => html`
  <lib-button variant="solid">Primary</lib-button>
  <lib-button variant="outlined">Secondary</lib-button>
  <lib-button variant="ghost">Ghost</lib-button>
  <lib-button tone="accent">Accent</lib-button>
  <lib-button tone="error">Danger</lib-button>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ═══════════════════════════════════════════════════════════════
   TESTS · Interacción y eventos
   ═══════════════════════════════════════════════════════════════ */

export const TestClickEvent: Story = {
  name: 'Test · ui-lib-click se dispara con detail',
  tags: ['test'],
  args: { variant: 'solid', size: 'md', disabled: false },
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
  args: { variant: 'solid', size: 'md', disabled: true },
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
