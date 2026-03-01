import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-button.component';
import type { LibButton } from './lib-button.component';

type LibButtonStoryArgs = LibButton & { slotContent?: string | TemplateResult };

const meta: Meta<LibButtonStoryArgs> = {
  title: 'Components/Atoms/Button',
  component: 'lib-button',
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'accent', 'danger'],
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
  },
  render: (args): TemplateResult => html`
    <lib-button
      variant=${args.variant}
      size=${args.size}
      ?disabled=${args.disabled}
      ?glass=${args.glass}
    >
      ${args.slotContent || 'Shibui Button'}
    </lib-button>
  `,
};

export default meta;
type Story = StoryObj<LibButtonStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    glass: false,
    slotContent: 'Shibui Button',
  },
};

/* ── Variantes ── */
export const AllVariants: Story = {
  name: 'All Variants',
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