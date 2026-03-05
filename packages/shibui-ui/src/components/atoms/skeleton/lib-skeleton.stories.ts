import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-skeleton.component';
import type { LibSkeleton } from './lib-skeleton.component';

type LibSkeletonStoryArgs = Pick<LibSkeleton, 'shape' | 'animation' | 'surface' | 'width' | 'height'>;

const preview = (bg: string, content: TemplateResult): TemplateResult => html`
  <div style="background:${bg}; padding:32px; border:1px solid var(--border-subtle);">
    ${content}
  </div>
`;

const meta: Meta<LibSkeletonStoryArgs> = {
  title: 'Components/Atoms/Skeleton',
  component: 'lib-skeleton',

  argTypes: {
    shape: {
      control: 'select',
      options: ['line', 'title', 'h1', 'avatar', 'icon', 'btn', 'badge', 'pill', 'img', 'rect'],
    },
    animation: {
      control: 'select',
      options: ['shimmer', 'wave', 'pulse'],
    },
    surface: {
      control: 'select',
      options: ['light', 'dark', 'kaki'],
    },
    width:  { control: 'text' },
    height: { control: 'text' },
  },

  render: (args): TemplateResult => preview('var(--bg-surface)', html`
    <lib-skeleton
      shape=${args.shape}
      animation=${args.animation}
      surface=${args.surface}
      width=${args.width}
      height=${args.height || ''}
    ></lib-skeleton>
  `),
};

export default meta;
type Story = StoryObj<LibSkeletonStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: { shape: 'line', animation: 'shimmer', surface: 'light', width: '80%', height: '' },
};

/* ── Todos los primitivos — light ── */
export const Primitives: Story = {
  name: 'Primitivos — light',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="display:flex; flex-direction:column; gap:24px; max-width:520px;">

      ${[
        { label: 'sk-line',  shape: 'line',  w: '100%', h: '' },
        { label: 'sk-title', shape: 'title', w: '60%',  h: '' },
        { label: 'sk-h1',    shape: 'h1',    w: '45%',  h: '' },
        { label: 'sk-btn',   shape: 'btn',   w: '120px',h: '' },
        { label: 'sk-badge', shape: 'badge', w: '64px', h: '' },
        { label: 'sk-pill',  shape: 'pill',  w: '80px', h: '' },
        { label: 'sk-img',   shape: 'img',   w: '100%', h: '80px' },
        { label: 'sk-rect',  shape: 'rect',  w: '120px',h: '48px' },
      ].map(({ label, shape, w, h }) => html`
        <div style="display:flex; align-items:center; gap:24px;">
          <span style="font-family:monospace; font-size:10px; color:var(--text-muted); width:72px; flex-shrink:0;">${label}</span>
          <lib-skeleton shape=${shape} width=${w} height=${h} style="flex:1;"></lib-skeleton>
        </div>
      `)}

      <!-- avatar: tamaños -->
      <div style="display:flex; align-items:center; gap:24px;">
        <span style="font-family:monospace; font-size:10px; color:var(--text-muted); width:72px; flex-shrink:0;">sk-avatar</span>
        <div style="display:flex; gap:16px;">
          <lib-skeleton shape="avatar" width="28px" height="28px"></lib-skeleton>
          <lib-skeleton shape="avatar" width="40px" height="40px"></lib-skeleton>
          <lib-skeleton shape="avatar" width="56px" height="56px"></lib-skeleton>
        </div>
      </div>

      <!-- icon: tamaños -->
      <div style="display:flex; align-items:center; gap:24px;">
        <span style="font-family:monospace; font-size:10px; color:var(--text-muted); width:72px; flex-shrink:0;">sk-icon</span>
        <div style="display:flex; gap:12px;">
          <lib-skeleton shape="icon" width="16px" height="16px"></lib-skeleton>
          <lib-skeleton shape="icon" width="20px" height="20px"></lib-skeleton>
          <lib-skeleton shape="icon" width="24px" height="24px"></lib-skeleton>
        </div>
      </div>

    </div>
  `),
};

/* ── Las tres animaciones ── */
export const Animations: Story = {
  name: 'Animations — shimmer · wave · pulse',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="display:flex; gap:32px; flex-wrap:wrap; align-items:flex-start;">

      ${(['shimmer', 'wave', 'pulse'] as const).map(anim => html`
        <div style="flex:1; min-width:180px; display:flex; flex-direction:column; gap:16px;">
          <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${anim}</span>
          <lib-skeleton shape="title"  animation=${anim} width="70%"></lib-skeleton>
          <lib-skeleton shape="line"   animation=${anim} width="100%"></lib-skeleton>
          <lib-skeleton shape="line"   animation=${anim} width="85%"></lib-skeleton>
          <lib-skeleton shape="line"   animation=${anim} width="65%"></lib-skeleton>
        </div>
      `)}

    </div>
  `),
};

/* ── Superficies dark y kaki ── */
export const Surfaces: Story = {
  name: 'Surfaces — dark · kaki',
  render: (): TemplateResult => html`
    <div style="display:flex; gap:24px; flex-wrap:wrap;">

      <!-- dark -->
      <div style="flex:1; min-width:220px; background:var(--color-washi-900); border:1px solid var(--color-washi-800); padding:24px; display:flex; flex-direction:column; gap:16px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <lib-skeleton shape="avatar" surface="dark" width="40px" height="40px"></lib-skeleton>
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <lib-skeleton shape="title" surface="dark" width="55%"></lib-skeleton>
            <lib-skeleton shape="line"  surface="dark" width="35%"></lib-skeleton>
          </div>
        </div>
        <lib-skeleton shape="line" surface="dark" width="100%"></lib-skeleton>
        <lib-skeleton shape="line" surface="dark" width="80%"></lib-skeleton>
        <lib-skeleton shape="btn"  surface="dark" width="100%"></lib-skeleton>
        <span style="font-family:monospace; font-size:10px; color:var(--color-washi-600); text-transform:uppercase; letter-spacing:0.25em; margin-top:4px;">Dark</span>
      </div>

      <!-- kaki -->
      <div style="flex:1; min-width:220px; background:var(--color-kaki-50); border:1px solid var(--color-kaki-200); padding:24px; display:flex; flex-direction:column; gap:16px;">
        <lib-skeleton shape="img"   surface="kaki" width="100%"></lib-skeleton>
        <lib-skeleton shape="title" surface="kaki" width="65%"></lib-skeleton>
        <lib-skeleton shape="line"  surface="kaki" width="100%"></lib-skeleton>
        <lib-skeleton shape="line"  surface="kaki" width="75%"></lib-skeleton>
        <lib-skeleton shape="btn"   surface="kaki" width="96px"></lib-skeleton>
        <span style="font-family:monospace; font-size:10px; color:var(--color-kaki-500); text-transform:uppercase; letter-spacing:0.25em; margin-top:4px;">Kaki</span>
      </div>

    </div>
  `,
};

/* ── Pattern: artículo editorial ── */
export const PatternArticle: Story = {
  name: 'Pattern — Artículo editorial',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="max-width:560px; display:flex; flex-direction:column; gap:20px;">
      <lib-skeleton shape="badge"  width="72px"></lib-skeleton>
      <lib-skeleton shape="h1"     width="80%"></lib-skeleton>
      <lib-skeleton shape="h1"     width="55%"></lib-skeleton>
      <div style="display:flex; align-items:center; gap:16px; margin-top:8px;">
        <lib-skeleton shape="avatar" width="36px" height="36px"></lib-skeleton>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <lib-skeleton shape="line" width="120px"></lib-skeleton>
          <lib-skeleton shape="line" width="80px"  height="11px"></lib-skeleton>
        </div>
      </div>
      <lib-skeleton shape="img" width="100%" style="margin-top:8px;"></lib-skeleton>
      <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
        <lib-skeleton shape="line" width="100%"></lib-skeleton>
        <lib-skeleton shape="line" width="95%"></lib-skeleton>
        <lib-skeleton shape="line" width="88%"></lib-skeleton>
        <lib-skeleton shape="line" width="72%"></lib-skeleton>
      </div>
    </div>
  `),
};

/* ── Pattern: grid de producto ── */
export const PatternProductGrid: Story = {
  name: 'Pattern — Grid de producto',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:20px; width:100%;">
      ${[80, 65, 72].map(w => html`
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); padding:24px; display:flex; flex-direction:column; gap:12px;">
          <lib-skeleton shape="img"   width="100%" height="140px"></lib-skeleton>
          <lib-skeleton shape="badge" width="56px"></lib-skeleton>
          <lib-skeleton shape="title" width="${w}%"></lib-skeleton>
          <lib-skeleton shape="line"  width="100%"></lib-skeleton>
          <lib-skeleton shape="line"  width="70%"></lib-skeleton>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px;">
            <lib-skeleton shape="title" width="64px"></lib-skeleton>
            <lib-skeleton shape="btn"   width="80px" height="32px"></lib-skeleton>
          </div>
        </div>
      `)}
    </div>
  `),
};

/* ── Pattern: dashboard stats ── */
export const PatternDashboard: Story = {
  name: 'Pattern — Dashboard stats',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; width:100%;">
      ${[60, 55, 70, 50].map(w => html`
        <div style="background:var(--bg-elevated); border:1px solid var(--border-subtle); padding:24px; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <lib-skeleton shape="line" width="${w}%" height="11px"></lib-skeleton>
            <lib-skeleton shape="icon" width="20px" height="20px"></lib-skeleton>
          </div>
          <lib-skeleton shape="h1"   width="65%"></lib-skeleton>
          <lib-skeleton shape="pill" width="80px"></lib-skeleton>
        </div>
      `)}
    </div>
  `),
};

/* ── Pattern: app layout dark (sidebar + main) ── */
export const PatternAppLayout: Story = {
  name: 'Pattern — App layout dark',
  render: (): TemplateResult => html`
    <div style="background:var(--color-washi-950); border:1px solid oklch(16% 0.02 45); display:grid; grid-template-columns:200px 1fr; min-height:320px; overflow:hidden;">

      <!-- sidebar -->
      <div style="background:oklch(10% 0.015 45); border-right:1px solid oklch(18% 0.02 45); padding:20px; display:flex; flex-direction:column; gap:20px;">
        <lib-skeleton shape="title" surface="dark" width="60%"></lib-skeleton>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:8px;">
          ${[60, 75, 50, 65].map(w => html`
            <div style="display:flex; align-items:center; gap:12px;">
              <lib-skeleton shape="icon" surface="dark" width="16px" height="16px" style="flex-shrink:0;"></lib-skeleton>
              <lib-skeleton shape="line" surface="dark" width="${w}%"></lib-skeleton>
            </div>
          `)}
        </div>
        <div style="margin-top:auto; display:flex; align-items:center; gap:12px;">
          <lib-skeleton shape="avatar" surface="dark" width="32px" height="32px" style="flex-shrink:0;"></lib-skeleton>
          <div style="flex:1; display:flex; flex-direction:column; gap:8px;">
            <lib-skeleton shape="line" surface="dark" width="80%" height="11px"></lib-skeleton>
            <lib-skeleton shape="line" surface="dark" width="55%" height="10px"></lib-skeleton>
          </div>
        </div>
      </div>

      <!-- main -->
      <div style="padding:24px; display:flex; flex-direction:column; gap:20px;">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <lib-skeleton shape="title" surface="dark" width="30%"></lib-skeleton>
          <lib-skeleton shape="btn"   surface="dark" width="96px" height="32px"></lib-skeleton>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
          <lib-skeleton shape="rect" surface="dark" width="100%" height="72px"></lib-skeleton>
          <lib-skeleton shape="rect" surface="dark" width="100%" height="72px"></lib-skeleton>
          <lib-skeleton shape="rect" surface="dark" width="100%" height="72px"></lib-skeleton>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${[[40, 20], [55, 15], [35, 20]].map(([a, b]) => html`
            <div style="display:flex; gap:16px; align-items:center; padding:12px 0; border-bottom:1px solid oklch(18% 0.02 45);">
              <lib-skeleton shape="avatar" surface="dark" width="28px" height="28px" style="flex-shrink:0;"></lib-skeleton>
              <lib-skeleton shape="line"   surface="dark" width="${a}%"></lib-skeleton>
              <lib-skeleton shape="line"   surface="dark" width="${b}%" style="margin-left:auto;"></lib-skeleton>
            </div>
          `)}
        </div>
      </div>

    </div>
  `,
};