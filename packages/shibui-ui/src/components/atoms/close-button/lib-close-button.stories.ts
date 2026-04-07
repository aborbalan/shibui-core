import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-close-button.component';
import type { LibCloseButton } from './lib-close-button.component';

type LibCloseButtonStoryArgs = Pick<
  LibCloseButton,
  'variant' | 'size' | 'icon' | 'disabled'
>;

const meta: Meta<LibCloseButtonStoryArgs> = {
  title: 'Components/Atoms/CloseButton',
  tags:['autodocs'],
  component: 'lib-close-button',

  argTypes: {
    variant: {
      control: 'select',
      options: ['ghost', 'subtle', 'outlined', 'filled', 'filled-round', 'danger', 'on-dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    icon: {
      control: 'select',
      options: ['x', 'x-circle', 'x-square'],
      description: 'Forma del icono Phosphor',
    },
    disabled: { control: 'boolean' },
  },

  render: (args): TemplateResult => html`
    <div style="padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; display:inline-flex;">
      <lib-close-button
        variant=${args.variant}
        size=${args.size}
        icon=${args.icon}
        ?disabled=${args.disabled}
      ></lib-close-button>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibCloseButtonStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    icon: 'x',
    disabled: false,
  },
};

/* ── All Variants ── */
export const AllVariants: Story = {
  name: 'All Variants.',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; align-items:center; gap:24px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Ghost</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="subtle" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Subtle</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="outlined" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Outlined</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="filled" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Filled</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="filled-round" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Filled-round</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="danger" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em;">Danger</span>
      </div>

      <div style="display:flex; flex-direction:column; align-items:center; gap:8px; background:#221C16; padding:12px;">
        <lib-close-button variant="on-dark" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.15em;">On-dark</span>
      </div>

    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="sm"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">SM · 24px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">MD · 32px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="lg"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">LG · 40px</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="xl"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">XL · 48px</span>
      </div>
    </div>
  `,
};

/* ── Icons ── */
export const Icons: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:24px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="lg" icon="x"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">x</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="lg" icon="x-circle"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">x-circle</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="ghost" size="lg" icon="x-square"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#9A8878;">x-square</span>
      </div>
    </div>
  `,
};

/* ── Context: Chip ── */
export const ContextChip: Story = {
  name: 'Context — Chip',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-wrap:wrap; gap:8px; padding:24px; background:#F2EDE6; border:1px solid #E5DDD3;">
      ${['Diseno de sistemas', 'Kintsugi', 'Tipografia'].map(label => html`
        <div style="display:inline-flex; align-items:center; gap:4px; padding:4px 4px 4px 12px; border:1px solid #D3C8BC; background:#FFFFFF; font-family:monospace; font-size:11px; letter-spacing:0.08em; color:#7A6A5C;">
          ${label}
          <lib-close-button variant="ghost" size="sm"></lib-close-button>
        </div>
      `)}
    </div>
  `,
};

/* ── Context: Toast ── */
export const ContextToast: Story = {
  name: 'Context — Toast',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:12px; padding:24px; background:#F2EDE6; border:1px solid #E5DDD3;">

      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:16px 20px; background:#FFFFFF; border:1px solid #E5DDD3; box-shadow:0 2px 8px rgba(26,20,14,0.06); min-width:280px; max-width:380px;">
        <div style="display:flex; flex-direction:column; gap:4px;">
          <p style="font-family:'Shippori Mincho',serif; font-size:13px; color:#221C16; font-weight:600;">Cambios guardados</p>
          <p style="font-family:monospace; font-size:10px; letter-spacing:0.08em; color:#B8A99A;">Hace un momento</p>
        </div>
        <lib-close-button variant="ghost" size="md"></lib-close-button>
      </div>

      <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:16px 20px; background:#FDF3EC; border:1px solid #FAE2CC; box-shadow:0 2px 8px rgba(26,20,14,0.06); min-width:280px; max-width:380px;">
        <div style="display:flex; flex-direction:column; gap:4px;">
          <p style="font-family:'Shippori Mincho',serif; font-size:13px; color:#8C4115; font-weight:600;">Atencion requerida</p>
          <p style="font-family:monospace; font-size:10px; letter-spacing:0.08em; color:#D97234;">Revisa los campos del formulario</p>
        </div>
        <lib-close-button variant="ghost" size="md" style="color:var(--color-kaki-400);"></lib-close-button>
      </div>

    </div>
  `,
};

/* ── Context: Modal header ── */
export const ContextModal: Story = {
  name: 'Context — Modal Header',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3;">
      <div style="display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid #E5DDD3; background:#FFFFFF; box-shadow:0 2px 8px rgba(26,20,14,0.06); min-width:320px; max-width:480px;">
        <span style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:#221C16; letter-spacing:-0.02em;">Confirmar accion</span>
        <lib-close-button variant="subtle" size="lg"></lib-close-button>
      </div>
    </div>
  `,
};

/* ── Context: On dark ── */
export const ContextOnDark: Story = {
  name: 'Context — On Dark Surface',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:32px; padding:32px; background:#221C16;">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="on-dark" size="sm"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.15em;">SM</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="on-dark" size="md"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.15em;">MD</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="on-dark" size="lg"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.15em;">LG</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-close-button variant="on-dark" size="xl"></lib-close-button>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.15em;">XL</span>
      </div>
    </div>
  `,
};