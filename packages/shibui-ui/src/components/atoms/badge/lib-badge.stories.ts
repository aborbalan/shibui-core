import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-badge.component';
import type { LibBadge } from './lib-badge.component';

type LibBadgeStoryArgs = Pick<LibBadge, 'variant' | 'size' | 'dot' | 'pill'> & {
  slotContent?: string;
};

const meta: Meta<LibBadgeStoryArgs> = {
  title: 'Components/Atoms/Badge',
  component: 'lib-badge',

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'celadon', 'dark', 'error', 'success', 'warning'],
      description: 'Variante semantica del badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: 'Tamano del badge',
    },
    dot: {
      control: 'boolean',
      description: 'Muestra un punto indicador a la izquierda',
    },
    pill: {
      control: 'boolean',
      description: 'Aplica border-radius completo (estilo pildora)',
    },
    slotContent: {
      control: 'text',
      description: 'Texto del badge (slot)',
    },
  },

  render: (args): TemplateResult => html`
    <lib-badge
      variant=${args.variant}
      size=${args.size}
      ?dot=${args.dot}
      ?pill=${args.pill}
    >
      ${args.slotContent ?? 'Badge'}
    </lib-badge>
  `,
};

export default meta;
type Story = StoryObj<LibBadgeStoryArgs>;

export const Playground: Story = {
  args: {
    variant: 'default',
    size: 'md',
    dot: false,
    pill: false,
    slotContent: 'Shibui',
  },
};

export const AllVariants: Story = {
  name: 'All Variants',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="default">Default</lib-badge>
      <lib-badge variant="accent">Accent</lib-badge>
      <lib-badge variant="celadon">Celadon</lib-badge>
      <lib-badge variant="dark">Dark</lib-badge>
      <lib-badge variant="error">Error</lib-badge>
      <lib-badge variant="success">Success</lib-badge>
      <lib-badge variant="warning">Warning</lib-badge>
    </div>
  `,
};

export const WithDot: Story = {
  name: 'With Dot',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="default" dot>Pendiente</lib-badge>
      <lib-badge variant="success" dot>Activo</lib-badge>
      <lib-badge variant="error"   dot>Critico</lib-badge>
      <lib-badge variant="warning" dot>Atencion</lib-badge>
      <lib-badge variant="celadon" dot>Info</lib-badge>
    </div>
  `,
};

export const Pill: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="accent"  pill>Nuevo</lib-badge>
      <lib-badge variant="success" pill dot>Online</lib-badge>
      <lib-badge variant="dark"    pill>v1.2.0</lib-badge>
      <lib-badge variant="celadon" pill>Beta</lib-badge>
    </div>
  `,
};

export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="accent" size="sm">Small</lib-badge>
      <lib-badge variant="accent" size="md">Medium</lib-badge>
    </div>
  `,
};

export const InContext: Story = {
  name: 'In Context',
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-lg);
      padding: var(--lib-space-xl);
      font-family: var(--lib-font-body);
      max-width: 480px;
    ">
      <div style="display:flex; align-items:center; gap:var(--lib-space-sm);">
        <span style="font-size:var(--text-base); color:var(--text-primary);">Componente lib-badge</span>
        <lib-badge variant="celadon" size="sm">Nuevo</lib-badge>
      </div>
      <div style="display:flex; flex-direction:column; gap:var(--lib-space-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--lib-space-sm) 0; border-bottom:1px solid var(--border-subtle);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary);">Deploy #142</span>
          <lib-badge variant="success" dot>Completado</lib-badge>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--lib-space-sm) 0; border-bottom:1px solid var(--border-subtle);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary);">Deploy #141</span>
          <lib-badge variant="error" dot>Fallido</lib-badge>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--lib-space-sm) 0; border-bottom:1px solid var(--border-subtle);">
          <span style="font-size:var(--text-sm); color:var(--text-secondary);">Deploy #140</span>
          <lib-badge variant="warning" dot>En revision</lib-badge>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; padding:var(--lib-space-sm) 0;">
          <span style="font-size:var(--text-sm); color:var(--text-secondary);">Deploy #139</span>
          <lib-badge variant="default">Archivado</lib-badge>
        </div>
      </div>
    </div>
  `,
};
