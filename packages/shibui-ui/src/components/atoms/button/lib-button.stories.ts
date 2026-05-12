import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-button.component';
import type { LibButton } from './lib-button.component';

type LibButtonStoryArgs = LibButton & { slotContent?: string | TemplateResult };

const meta: Meta<LibButtonStoryArgs> = {
  title: 'Components/Atoms/Button',
  tags:['autodocs'],
  component: 'lib-button',

  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger', 'kintsugi', 'brutal'],
      description: 'Variante visual del botón',
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

/* ── Variantes ── */
export const AllVariants: Story = {
  name: 'All Variants.',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-wrap: wrap; gap: var(--lib-space-md); align-items: center; padding: var(--lib-space-lg);">
      <lib-button variant="primary">Primary</lib-button>
      <lib-button variant="secondary">Secondary</lib-button>
      <lib-button variant="ghost">Ghost</lib-button>
      <lib-button variant="accent">Accent</lib-button>
      <lib-button variant="danger">Danger</lib-button>
      <lib-button variant="kintsugi">Kintsugi</lib-button>
      <lib-button variant="brutal">Brutal</lib-button>
    </div>
  `,
};

/* ── Kintsugi ── */
export const Kintsugi: Story = {
  name: 'Kintsugi ◈',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-wrap: wrap;
      gap: var(--lib-space-md);
      align-items: center;
      justify-content: center;
      padding: var(--lib-space-xl);
      background: var(--color-washi-950, #120E0A);
    ">
      <lib-button variant="kintsugi" size="sm">金継ぎ</lib-button>
      <lib-button variant="kintsugi" size="md">Kintsugi</lib-button>
      <lib-button variant="kintsugi" size="lg">継ぐ</lib-button>
    </div>
  `,
};

/* ── Brutal ── */
export const Brutal: Story = {
  name: 'Brutal ◼',
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-wrap: wrap;
      gap: var(--lib-space-md);
      align-items: center;
      justify-content: center;
      padding: var(--lib-space-xl);
      background: var(--color-washi-100, #F2EDE6);
    ">
      <lib-button variant="brutal" size="sm">EXECUTE</lib-button>
      <lib-button variant="brutal" size="md">DEPLOY</lib-button>
      <lib-button variant="brutal" size="lg">ABORT</lib-button>
    </div>
  `,
};

/* ── Spotlight ── */
export const SpotlightEffect: Story = {
  name: 'Spotlight — Efecto cursor',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-wrap: wrap;
      gap: var(--lib-space-md);
      align-items: center;
      justify-content: center;
      padding: var(--lib-space-xl);
      background: var(--color-washi-950, #120E0A);
    ">
      <lib-button variant="primary" ?spotlight=${true}>Primary</lib-button>
      <lib-button variant="kintsugi" ?spotlight=${true}>Kintsugi</lib-button>
      <lib-button variant="brutal" ?spotlight=${true} style="background: var(--color-washi-50);">Brutal</lib-button>
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
  parameters: {
    backgrounds: { default: 'gradient' },
  },
  render: (): TemplateResult => html`
    <div style="
      padding: var(--lib-space-xl);
      display: flex;
      flex-wrap: wrap;
      gap: var(--lib-space-md);
      align-items: center;
      justify-content: center;
    ">
      <lib-button ?glass=${true}>Paper Glass</lib-button>
      <lib-button ?glass=${true} variant="primary">Water Glass</lib-button>
      <lib-button ?glass=${true} variant="accent">Kaki Glass</lib-button>
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