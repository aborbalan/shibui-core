import { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect } from 'storybook/test';
import { html, TemplateResult } from 'lit';
import './lib-badge.component';
import type { LibBadge } from './lib-badge.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibBadgeStoryArgs = Pick<LibBadge, 'variant' | 'size' | 'dot' | 'pill'> & {
  slotContent?: string;
};

const meta: Meta<LibBadgeStoryArgs> = {
  title: 'Universal/Content/Badge',
  tags:['autodocs'],
  component: 'lib-badge',

  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'info', 'strong', 'error', 'success', 'warning'],
      description: 'Variante semántica del badge',
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
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="default">Default</lib-badge>
      <lib-badge variant="accent">Accent</lib-badge>
      <lib-badge variant="info">Info</lib-badge>
      <lib-badge variant="strong">Strong</lib-badge>
      <lib-badge variant="error">Error</lib-badge>
      <lib-badge variant="success">Success</lib-badge>
      <lib-badge variant="warning">Warning</lib-badge>
    </div>
  `,
};

export const WithDot: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="default" dot>Pendiente</lib-badge>
      <lib-badge variant="success" dot>Activo</lib-badge>
      <lib-badge variant="error"   dot>Critico</lib-badge>
      <lib-badge variant="warning" dot>Atencion</lib-badge>
      <lib-badge variant="info"    dot>Info</lib-badge>
    </div>
  `,
};

export const Pill: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:16px; align-items:center; padding:24px;">
      <lib-badge variant="accent"  pill>Nuevo</lib-badge>
      <lib-badge variant="success" pill dot>Online</lib-badge>
      <lib-badge variant="strong"  pill>v1.2.0</lib-badge>
      <lib-badge variant="info"    pill>Beta</lib-badge>
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
        <lib-badge variant="info" size="sm">Nuevo</lib-badge>
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

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-badge variant="default" usa --lib-comp-bg-subtle y
   --lib-comp-fg — adapta al katachi activo sin CSS adicional.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-sm);">
      <lib-badge variant="default">Default</lib-badge>
      <lib-badge variant="accent">Accent</lib-badge>
      <lib-badge variant="info">Info</lib-badge>
      <lib-badge variant="strong">Strong</lib-badge>
      <lib-badge variant="error">Error</lib-badge>
      <lib-badge variant="success">Success</lib-badge>
      <lib-badge variant="warning">Warning</lib-badge>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-sm);">
      <lib-badge variant="default" dot size="sm">sm</lib-badge>
      <lib-badge variant="accent" dot size="sm">sm</lib-badge>
      <lib-badge variant="success" dot size="md">md</lib-badge>
      <lib-badge variant="error" dot size="md">md</lib-badge>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-sm);">
      <lib-badge variant="accent" pill>Nuevo</lib-badge>
      <lib-badge variant="success" pill dot>Online</lib-badge>
      <lib-badge variant="strong" pill>v1.2.0</lib-badge>
      <lib-badge variant="info" pill>Beta</lib-badge>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

export const KatachiExplicitOverride: Story = {
  name: 'Katachi · explicit variant wins',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--lib-space-xl);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      <section data-katachi="kintsugi" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
        <header style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
          <strong style="font-family:'Shippori Mincho',serif;font-size:1.5rem;color:var(--katachi-accent);">金</strong>&nbsp;katachi="kintsugi" · default
        </header>
        <div style="display:flex;gap:var(--lib-space-sm);">
          <lib-badge variant="default">Ambient</lib-badge>
          <lib-badge variant="default" dot>Inherits</lib-badge>
        </div>
      </section>

      <section data-katachi="kintsugi" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
        <header style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
          <strong style="font-family:'Shippori Mincho',serif;font-size:1.5rem;color:var(--katachi-accent);">金</strong>&nbsp;katachi="kintsugi" · variants explícitos
        </header>
        <div style="display:flex;gap:var(--lib-space-sm);flex-wrap:wrap;">
          <lib-badge variant="accent">Accent</lib-badge>
          <lib-badge variant="info">Info</lib-badge>
          <lib-badge variant="success">Success</lib-badge>
          <lib-badge variant="error">Error</lib-badge>
        </div>
      </section>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

/* ═══════════════════════════════════════════════════════════════
   TESTS · Render y atributos
   ═══════════════════════════════════════════════════════════════ */

export const TestDotRenders: Story = {
  name: 'Test · dot=true renderiza el indicador visual',
  tags: ['test'],
  args: { variant: 'success', dot: true, slotContent: 'Activo' },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-badge') as HTMLElement;
    const dot = el.shadowRoot!.querySelector('.badge__dot');

    expect(dot).not.toBeNull();
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
  },
};

export const TestNoDotByDefault: Story = {
  name: 'Test · dot=false no renderiza el indicador',
  tags: ['test'],
  args: { variant: 'default', dot: false, slotContent: 'Badge' },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-badge') as HTMLElement;
    const dot = el.shadowRoot!.querySelector('.badge__dot');

    expect(dot).toBeNull();
  },
};
