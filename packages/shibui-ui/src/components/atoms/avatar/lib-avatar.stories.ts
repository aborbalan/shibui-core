import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-avatar.component';
import '../status-dot/lib-status-dot.component';
import type { LibAvatar } from './lib-avatar.component';

type LibAvatarStoryArgs = Pick<LibAvatar, 'src' | 'name' | 'size' | 'shape' | 'color'>;

const DEMO_IMG = 'https://i.pravatar.cc/200?img=32';

const meta: Meta<LibAvatarStoryArgs> = {
  title: 'Components/Atoms/Avatar',
  tags:['autodocs'],
  component: 'lib-avatar',

  argTypes: {
    src: { control: 'text', description: 'URL de imagen' },
    name: { control: 'text', description: 'Nombre completo (genera iniciales)' },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Tamano del avatar',
    },
    shape: {
      control: 'select',
      options: ['circle', 'squircle', 'square'],
      description: 'Forma del avatar',
    },
    color: {
      control: 'select',
      options: ['washi', 'kaki', 'celadon', 'dark'],
      description: 'Paleta de color del fondo (iniciales / icono)',
    },
  },

  render: (args): TemplateResult => html`
    <lib-avatar
      src=${args.src}
      name=${args.name}
      size=${args.size}
      shape=${args.shape}
      color=${args.color}
    ></lib-avatar>
  `,
};

export default meta;
type Story = StoryObj<LibAvatarStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    src: DEMO_IMG,
    name: 'Ana Bel',
    size: 'md',
    shape: 'circle',
    color: 'washi',
  },
};

/* ── Sizes — Image ── */
export const SizesImage: Story = {
  name: 'Sizes — Image',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:24px; padding:24px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xs" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">xs</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="sm" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">sm</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="md" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">md</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">lg</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xl" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">xl</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="2xl" src=${DEMO_IMG} name="AB"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">2xl</span>
      </div>
    </div>
  `,
};

/* ── Sizes — Initials ── */
export const SizesInitials: Story = {
  name: 'Sizes — Initials',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:24px; padding:24px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xs" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">xs</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="sm" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">sm</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="md" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">md</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">lg</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xl" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">xl</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="2xl" name="Ana Bel"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">2xl</span>
      </div>
    </div>
  `,
};

/* ── Shapes ── */
export const Shapes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:flex-end; gap:32px; padding:24px;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xl" src=${DEMO_IMG} name="AB" shape="circle"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">circle</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xl" src=${DEMO_IMG} name="AB" shape="squircle"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">squircle</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="xl" src=${DEMO_IMG} name="AB" shape="square"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">square</span>
      </div>
    </div>
  `,
};

/* ── Colors ── */
export const Colors: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:flex-end; gap:32px; padding:24px; background:#F2EDE6;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" color="washi"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">washi</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" color="kaki"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">kaki</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" color="celadon"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">celadon</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" color="dark"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">dark</span>
      </div>
    </div>
  `,
};

/* ── With Status Dot ── */
export const WithStatusDot: Story = {
  name: 'With Status Dot.',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:32px; padding:32px;">
      <lib-avatar size="lg" src=${DEMO_IMG} name="Ana Bel">
        <lib-status-dot slot="status" variant="success" pulse></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Carlos M" color="kaki">
        <lib-status-dot slot="status" variant="warning"></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Davide R" color="celadon">
        <lib-status-dot slot="status" variant="danger" pulse></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Eva P" color="dark">
        <lib-status-dot slot="status" variant="neutral"></lib-status-dot>
      </lib-avatar>
    </div>
  `,
};

/* ── Icon fallback ── */
export const IconFallback: Story = {
  name: 'Icon Fallback.',
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:24px; padding:24px; background:#F2EDE6;">
      <lib-avatar size="xl" color="washi"></lib-avatar>
      <lib-avatar size="xl" color="kaki"></lib-avatar>
      <lib-avatar size="xl" color="celadon"></lib-avatar>
      <lib-avatar size="xl" color="dark"></lib-avatar>
    </div>
  `,
};