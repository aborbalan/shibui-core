import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-parallax-text-stack.component';

const meta: Meta = {
  title: 'Components/Motion/Parallax Text Stack',
  component: 'lib-parallax-text-stack',
  argTypes: {
    speed: { control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 } },
    size:  { control: 'select', options: ['sm', 'md', 'lg', 'xl', '2xl'] },
    color: { control: 'select', options: ['default', 'muted', 'kaki', 'celadon'] },
  },
};
export default meta;
type Story = StoryObj;

/*
  IMPORTANTE: el wrapper de cada story lleva overflow-x:hidden.
  El componente NO tiene overflow:hidden propio — si lo tuviera,
  el translateX quedaría clipado y el efecto sería invisible.
  El padre es quien controla el desbordamiento horizontal.
*/
const page = (content: TemplateResult): TemplateResult => html`
  <div style="overflow-x:hidden;">${content}</div>`;

const scrollHint = (): TemplateResult => html`
  <div style="height:60vh;display:flex;align-items:flex-end;justify-content:center;
    padding:var(--lib-space-xl);">
    <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
      letter-spacing:var(--tracking-widest);text-transform:uppercase;
      color:var(--text-muted);">↓ scroll para ver el efecto ↓</span>
  </div>`;

const spacer = (): TemplateResult => html`<div style="height:80vh;"></div>`;

/* ──────────────────────────────────────────────
   Playground
   ────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    lines: ['The beauty of', 'IMPERFECTION', 'Wabi Sabi', 'DESIGN SYSTEM'],
    speed: 0.15,
    size: 'lg',
    color: 'default',
  },
  render: (args): TemplateResult => page(html`
    ${scrollHint()}
    <lib-parallax-text-stack
      .lines=${args.lines}
      speed="${args.speed}"
      size="${args.size}"
      color="${args.color}"
    ></lib-parallax-text-stack>
    ${spacer()}
  `),
};

/* ──────────────────────────────────────────────
   Tamaños
   ────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — sm · md · lg · xl · 2xl',
  render: (): TemplateResult => page(html`
    ${scrollHint()}
    ${(['sm', 'md', 'lg', 'xl', '2xl'] as const).map(s => html`
      <div style="border-top:1px solid var(--border-subtle);
        padding:var(--lib-space-sm) var(--lib-space-xl);">
        <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:var(--tracking-widest);text-transform:uppercase;
          color:var(--text-muted);">${s}</span>
      </div>
      <lib-parallax-text-stack
        .lines=${['Shibui', '渋い']}
        speed="0.12"
        size="${s}"
      ></lib-parallax-text-stack>
    `)}
    ${spacer()}
  `),
};

/* ──────────────────────────────────────────────
   Colores
   ────────────────────────────────────────────── */
export const Colors: Story = {
  name: 'Colors — default · muted · kaki · celadon',
  render: (): TemplateResult => page(html`
    ${scrollHint()}
    <lib-parallax-text-stack .lines=${['Default', 'Color']}
      speed="0.12" size="xl" color="default"></lib-parallax-text-stack>
    <lib-parallax-text-stack .lines=${['Muted', 'Subtle']}
      speed="0.12" size="xl" color="muted"></lib-parallax-text-stack>
    <lib-parallax-text-stack .lines=${['Kaki', 'Terracota']}
      speed="0.12" size="xl" color="kaki"></lib-parallax-text-stack>
    <lib-parallax-text-stack .lines=${['Celadón', 'Verde']}
      speed="0.12" size="xl" color="celadon"></lib-parallax-text-stack>
    ${spacer()}
  `),
};

/* ──────────────────────────────────────────────
   Velocidades
   ────────────────────────────────────────────── */
export const Speeds: Story = {
  name: 'Speeds — sutil · pronunciado',
  render: (): TemplateResult => page(html`
    ${scrollHint()}
    <div style="padding:var(--lib-space-sm) var(--lib-space-xl);">
      <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
        letter-spacing:var(--tracking-widest);text-transform:uppercase;
        color:var(--text-muted);">speed 0.05 — sutil</span>
    </div>
    <lib-parallax-text-stack
      .lines=${['Lento', 'Sutil', 'Silencio']}
      speed="0.05" size="xl"
    ></lib-parallax-text-stack>

    <div style="padding:var(--lib-space-sm) var(--lib-space-xl);
      border-top:1px solid var(--border-subtle);">
      <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
        letter-spacing:var(--tracking-widest);text-transform:uppercase;
        color:var(--text-muted);">speed 0.25 — pronunciado</span>
    </div>
    <lib-parallax-text-stack
      .lines=${['Rápido', 'Dinámico', 'Energía']}
      speed="0.25" size="xl"
    ></lib-parallax-text-stack>
    ${spacer()}
  `),
};

/* ──────────────────────────────────────────────
   Contexto — hero de landing (fondo oscuro)
   ────────────────────────────────────────────── */
export const HeroLanding: Story = {
  name: 'Contexto — hero de landing',
  render: (): TemplateResult => html`
    <div style="overflow-x:hidden;background:var(--color-washi-950);min-height:100vh;
      display:flex;flex-direction:column;">

      <div style="padding:var(--lib-space-md) var(--lib-space-xl);
        display:flex;justify-content:space-between;align-items:center;
        border-bottom:1px solid rgba(255,255,255,.06);">
        <span style="font-family:var(--lib-font-display);font-size:var(--text-xl);
          font-weight:300;letter-spacing:var(--tracking-wider);
          color:var(--color-washi-100);">shibui</span>
        <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
          letter-spacing:var(--tracking-widest);text-transform:uppercase;
          color:var(--color-washi-600);">v0.1.0</span>
      </div>

      <lib-parallax-text-stack
        .lines=${['Design', 'SYSTEM', '渋い', 'SHIBUI']}
        speed="0.18"
        size="2xl"
        color="muted"
        style="flex:1;"
      ></lib-parallax-text-stack>

    </div>
    ${spacer()}
  `,
};