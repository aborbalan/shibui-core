import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-divider-kintsugi.component';
import type { LibDividerKintsugi } from './lib-divider-kintsugi.component';

type KintsugiStoryArgs = Pick<
  LibDividerKintsugi,
  'orientation' | 'weight' | 'align' | 'ornament' | 'labelStyle'
> & { slotContent?: string };

/* Fondos oscuros para que el oro sea visible */
const DARK = 'padding:32px; background:#120E0A; border:1px solid #221C16; display:flex; flex-direction:column; gap:28px;';
//const DARK_ROW = 'padding:32px; background:#120E0A; border:1px solid #221C16; display:flex; align-items:center; gap:32px;';

const meta: Meta<KintsugiStoryArgs> = {
  title: 'Components/Atoms/DividerKintsugi',
  component: 'lib-divider-kintsugi',

  parameters: {
    backgrounds: { default: 'dark' },
  },

  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    weight: {
      control: 'select',
      options: ['base', 'thick', 'full'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    ornament: {
      control: 'select',
      options: ['none', 'dot', 'diamond', 'ring', 'kanji-label'],
    },
    labelStyle: {
      control: 'select',
      options: ['mono', 'display'],
      name: 'label-style',
    },
    slotContent: {
      control: 'text',
      description: 'Texto del slot (label o kanji)',
    },
  },

  render: (args): TemplateResult => html`
    <div style="${DARK}">
      <lib-divider-kintsugi
        orientation=${args.orientation}
        weight=${args.weight}
        align=${args.align}
        ornament=${args.ornament}
        label-style=${args.labelStyle}
      >${args.slotContent ?? ''}</lib-divider-kintsugi>
    </div>
  `,
};

export default meta;
type Story = StoryObj<KintsugiStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    weight: 'base',
    align: 'center',
    ornament: 'none',
    labelStyle: 'mono',
    slotContent: '',
  },
};

/* ── Lines — tres pesos ── */
export const Lines: Story = {
  render: (): TemplateResult => html`
    <div style="${DARK}">
      <div>
        <p style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Base — fade en extremos · 1px shimmer</p>
        <lib-divider-kintsugi weight="base"></lib-divider-kintsugi>
      </div>
      <div>
        <p style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Thick — 2px · glow pulsante</p>
        <lib-divider-kintsugi weight="thick"></lib-divider-kintsugi>
      </div>
      <div>
        <p style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Full — sin fade · borde a borde</p>
        <lib-divider-kintsugi weight="full"></lib-divider-kintsugi>
      </div>
    </div>
  `,
};

/* ── Ornaments ── */
export const Ornaments: Story = {
  render: (): TemplateResult => html`
    <div style="${DARK}">
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-divider-kintsugi ornament="dot"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.15em;">Dot</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-divider-kintsugi ornament="diamond"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.15em;">Diamond</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-divider-kintsugi ornament="ring"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.15em;">Ring</span>
      </div>
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
        <lib-divider-kintsugi ornament="kanji-label" weight="thick">間</lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.15em;">Kanji-label</span>
      </div>
    </div>
  `,
};

/* ── Labels ── */
export const Labels: Story = {
  render: (): TemplateResult => html`
    <div style="${DARK}">
      <lib-divider-kintsugi>O</lib-divider-kintsugi>
      <lib-divider-kintsugi align="left">Sección premium</lib-divider-kintsugi>
      <lib-divider-kintsugi align="right">Fin</lib-divider-kintsugi>
      <lib-divider-kintsugi label-style="display">o bien</lib-divider-kintsugi>
      <lib-divider-kintsugi ornament="kanji-label">金</lib-divider-kintsugi>
      <lib-divider-kintsugi ornament="kanji-label">美</lib-divider-kintsugi>
    </div>
  `,
};

/* ── Vertical ── */
export const Vertical: Story = {
  render: (): TemplateResult => html`
    <div style="padding:32px; background:#120E0A; border:1px solid #221C16; display:flex; flex-direction:column; gap:24px;">

      <p style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.25em;">Vertical base · dot · diamond · kanji</p>
      <div style="display:flex; align-items:stretch; gap:48px; height:120px;">
        <lib-divider-kintsugi orientation="vertical" style="height:100%;"></lib-divider-kintsugi>
        <lib-divider-kintsugi orientation="vertical" ornament="dot" style="height:100%;"></lib-divider-kintsugi>
        <lib-divider-kintsugi orientation="vertical" ornament="diamond" style="height:100%;"></lib-divider-kintsugi>
        <lib-divider-kintsugi orientation="vertical" ornament="kanji-label" style="height:100%;">金</lib-divider-kintsugi>
      </div>

      <p style="font-family:monospace; font-size:10px; color:#5C4E42; text-transform:uppercase; letter-spacing:0.25em; margin-top:8px;">En metadatos inline</p>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.08em;">v0.1.0</span>
        <lib-divider-kintsugi orientation="vertical" style="height:14px;"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.08em;">MIT</span>
        <lib-divider-kintsugi orientation="vertical" style="height:14px;"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:#5C4E42; letter-spacing:0.08em;">16 componentes</span>
        <lib-divider-kintsugi orientation="vertical" style="height:14px;"></lib-divider-kintsugi>
        <span style="font-family:monospace; font-size:10px; color:oklch(48% 0.04 55); letter-spacing:0.08em;">Premium</span>
      </div>

    </div>
  `,
};

/* ── Context: prosa oscura ── */
export const ContextProse: Story = {
  name: 'Context — Dark Prose',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:#0D0B08; border:1px solid #1A1410; max-width:600px;">
      <h3 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:oklch(75% 0.03 62); letter-spacing:-0.02em; margin-bottom:12px;">
        Kintsugi como filosofía de producto
      </h3>
      <p style="font-family:'Shippori Mincho',serif; font-size:15px; color:oklch(42% 0.02 50); line-height:1.8;">
        El oro no oculta la fractura. La exhibe. Un sistema de diseño maduro no teme mostrar sus cicatrices — las versiones anteriores, los cambios de criterio, las decisiones que no funcionaron.
      </p>

      <lib-divider-kintsugi ornament="diamond" style="margin:32px 0;"></lib-divider-kintsugi>

      <p style="font-family:'Shippori Mincho',serif; font-size:15px; color:oklch(42% 0.02 50); line-height:1.8;">
        La coherencia no viene de la perfección, sino del oro que une los fragmentos. Ese oro es el token, el componente compartido, el lenguaje común.
      </p>

      <lib-divider-kintsugi weight="thick" ornament="kanji-label" style="margin:32px 0;">間</lib-divider-kintsugi>

      <p style="font-family:monospace; font-size:11px; color:oklch(30% 0.02 50); letter-spacing:0.08em;">
        Shibui Journal · Marzo 2026
      </p>
    </div>
  `,
};

/* ── Context: formulario premium ── */
export const ContextForm: Story = {
  name: 'Context — Premium Form',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:#0D0B08; border:1px solid #1A1410;">
      <div style="max-width:340px; display:flex; flex-direction:column; gap:20px;">

        <button style="width:100%; padding:12px 16px; font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; border:none; cursor:pointer; font-weight:600; color:oklch(12% 0.02 45); background:linear-gradient(135deg, oklch(62% 0.05 60), oklch(72% 0.06 68), oklch(80% 0.09 78), oklch(72% 0.06 68), oklch(62% 0.05 60));">
          Acceso Premium
        </button>

        <lib-divider-kintsugi>O</lib-divider-kintsugi>

        <button style="width:100%; padding:12px 16px; font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; background:transparent; color:oklch(38% 0.02 50); border:1px solid oklch(22% 0.03 55);">
          Continuar sin cuenta
        </button>

      </div>
    </div>
  `,
};

/* ── Context: card premium ── */
export const ContextCard: Story = {
  name: 'Context — Premium Card',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:#0D0B08; border:1px solid #1A1410;">
      <div style="border:1px solid oklch(18% 0.02 45); background:oklch(10% 0.015 45); max-width:360px; position:relative; overflow:hidden;">
        <!-- Gold top accent — full weight sin wrapper -->
        <lib-divider-kintsugi weight="full" style="display:block; height:2px;"></lib-divider-kintsugi>

        <div style="padding:20px 24px;">
          <p style="font-family:monospace; font-size:10px; color:oklch(30% 0.02 50); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:8px;">Plan activo</p>
          <p style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:oklch(75% 0.03 62); letter-spacing:-0.02em;">Enterprise</p>
        </div>

        <lib-divider-kintsugi ornament="dot" style="padding:0 24px; display:block;"></lib-divider-kintsugi>

        <div style="padding:20px 24px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="font-family:monospace; font-size:11px; color:oklch(30% 0.02 50); letter-spacing:0.08em;">Componentes</span>
            <span style="font-family:monospace; font-size:11px; color:oklch(72% 0.06 68);">16 / 16</span>
          </div>
          <lib-divider-kintsugi style="opacity:0.4;"></lib-divider-kintsugi>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-family:monospace; font-size:11px; color:oklch(30% 0.02 50); letter-spacing:0.08em;">Kintsugi variants</span>
            <span style="font-family:monospace; font-size:11px; color:oklch(72% 0.06 68);">Activas</span>
          </div>
        </div>
      </div>
    </div>
  `,
};