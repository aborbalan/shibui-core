import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-avatar.component';
import '../status-dot/lib-status-dot.component';
import type { LibAvatar } from './lib-avatar.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibAvatarStoryArgs = Pick<LibAvatar, 'src' | 'name' | 'size' | 'shape' | 'tint'>;

/**
 * Retrato demo embebido como SVG `data-URI` — sin dependencia de red.
 * Antes se usaba `https://i.pravatar.cc/200`, un servicio externo lento/
 * inestable: cuando no cargaba (offline, red bloqueada o petición colgada
 * sin disparar `error`) el fallback a iniciales no saltaba y las stories de
 * imagen quedaban en blanco. Un `data-URI` es determinista: funciona offline,
 * en el build estático y en los snapshots de regresión visual.
 */
const DEMO_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EBE3D9"/>
      <stop offset="1" stop-color="#CFC1B0"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <circle cx="100" cy="206" r="80" fill="#A36B43"/>
  <circle cx="100" cy="84" r="44" fill="#E8C39B"/>
  <path d="M58 88 Q58 40 100 40 Q142 40 142 88 Q120 64 100 64 Q80 64 58 88 Z" fill="#3E3127"/>
</svg>`;

const DEMO_IMG = `data:image/svg+xml,${encodeURIComponent(DEMO_AVATAR_SVG)}`;

const meta: Meta<LibAvatarStoryArgs> = {
  title: 'Universal/Content/Avatar',
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
    tint: {
      control: 'select',
      options: ['neutral', 'warm', 'cool', 'inverse'],
      description: 'Tinte decorativo del fondo (iniciales / icono)',
    },
  },

  render: (args): TemplateResult => html`
    <lib-avatar
      src=${args.src}
      name=${args.name}
      size=${args.size}
      shape=${args.shape}
      tint=${args.tint}
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
    tint: 'neutral',
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

/* ── Tones ── */
export const Tones: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:flex-end; gap:32px; padding:24px; background:#F2EDE6;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" tint="neutral"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">neutral</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" tint="warm"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">warm</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" tint="cool"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">cool</span>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:8px;">
        <lib-avatar size="lg" name="Ana Bel" tint="inverse"></lib-avatar>
        <span style="font-family:monospace;font-size:10px;color:#9A8878;text-transform:uppercase;letter-spacing:0.1em;">inverse</span>
      </div>
    </div>
  `,
};


/* ── With Status Dot ── */
export const WithStatusDot: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:32px; padding:32px;">
      <lib-avatar size="lg" src=${DEMO_IMG} name="Ana Bel">
        <lib-status-dot slot="status" variant="success" pulse></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Carlos M" tint="warm">
        <lib-status-dot slot="status" variant="warning"></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Davide R" tint="cool">
        <lib-status-dot slot="status" variant="danger" pulse></lib-status-dot>
      </lib-avatar>
      <lib-avatar size="lg" name="Eva P" tint="inverse">
        <lib-status-dot slot="status" variant="neutral"></lib-status-dot>
      </lib-avatar>
    </div>
  `,
};

/* ── Icon fallback ── */
export const IconFallback: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; align-items:center; gap:24px; padding:24px; background:#F2EDE6;">
      <lib-avatar size="xl" tint="neutral"></lib-avatar>
      <lib-avatar size="xl" tint="warm"></lib-avatar>
      <lib-avatar size="xl" tint="cool"></lib-avatar>
      <lib-avatar size="xl" tint="inverse"></lib-avatar>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-avatar usa tint attr para fondos de iniciales —
   el contexto katachi adapta el entorno contenedor (bg-base,
   border-subtle) mientras los avatares mantienen su identidad.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;">
      <lib-avatar name="Sora K" size="xs" tint="neutral"></lib-avatar>
      <lib-avatar name="Sora K" size="sm" tint="neutral"></lib-avatar>
      <lib-avatar name="Sora K" size="md" tint="neutral"></lib-avatar>
      <lib-avatar name="Sora K" size="lg" tint="neutral"></lib-avatar>
      <lib-avatar name="Sora K" size="xl" tint="neutral"></lib-avatar>
      <lib-avatar name="Sora K" size="2xl" tint="neutral"></lib-avatar>
    </div>
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;">
      <lib-avatar name="Ana B" size="md" tint="neutral" shape="circle"></lib-avatar>
      <lib-avatar name="Ana B" size="md" tint="warm" shape="squircle"></lib-avatar>
      <lib-avatar name="Ana B" size="md" tint="cool" shape="square"></lib-avatar>
      <lib-avatar name="Ana B" size="md" tint="inverse" shape="circle"></lib-avatar>
    </div>
    <div style="display:flex;gap:var(--lib-space-md);align-items:center;">
      <lib-avatar size="md" tint="neutral"></lib-avatar>
      <lib-avatar size="md" tint="warm"></lib-avatar>
      <lib-avatar size="md" tint="cool"></lib-avatar>
      <lib-avatar size="md" tint="inverse"></lib-avatar>
      <lib-avatar src=${DEMO_IMG} name="AB" size="md" shape="circle"></lib-avatar>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
