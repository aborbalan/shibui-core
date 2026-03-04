import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-divider.component';
import type { LibDivider } from './lib-divider.component';

type LibDividerStoryArgs = Pick<
  LibDivider,
  'orientation' | 'styleVariant' | 'color' | 'align' | 'ornament' | 'labelStyle'
> & { slotContent?: string };

const PREVIEW_H = 'padding:24px; background:#F2EDE6; border:1px solid #E5DDD3; display:flex; flex-direction:column; gap:24px;';
const PREVIEW_DARK = 'padding:24px; background:#120E0A; border:1px solid #221C16; display:flex; flex-direction:column; gap:24px;';

const meta: Meta<LibDividerStoryArgs> = {
  title: 'Components/Atoms/Divider',
  component: 'lib-divider',

  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    styleVariant: {
      control: 'select',
      options: ['hairline', 'default', 'strong', 'heavy', 'dashed', 'dotted', 'gradient'],
      name: 'style-variant',
    },
    color: {
      control: 'select',
      options: ['default', 'kaki', 'celadon'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    ornament: {
      control: 'select',
      options: ['none', 'dot', 'diamond'],
    },
    labelStyle: {
      control: 'select',
      options: ['mono', 'display', 'kanji'],
      name: 'label-style',
    },
    slotContent: {
      control: 'text',
      description: 'Texto del slot (label)',
    },
  },

  render: (args): TemplateResult => html`
    <div style="${PREVIEW_H}">
      <lib-divider
        orientation=${args.orientation}
        style-variant=${args.styleVariant}
        color=${args.color}
        align=${args.align}
        ornament=${args.ornament}
        label-style=${args.labelStyle}
      >${args.slotContent ?? ''}</lib-divider>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibDividerStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    orientation: 'horizontal',
    styleVariant: 'default',
    color: 'default',
    align: 'center',
    ornament: 'none',
    labelStyle: 'mono',
    slotContent: '',
  },
};

/* ── Styles ── */
export const LineStyles: Story = {
  name: 'Line Styles',
  render: (): TemplateResult => html`
    <div style="${PREVIEW_H}">
      ${(['hairline', 'default', 'strong', 'heavy', 'dashed', 'dotted', 'gradient'] as const).map(s => html`
        <div>
          <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:12px;">${s}</p>
          <lib-divider style-variant=${s}></lib-divider>
        </div>
      `)}
    </div>
  `,
};

/* ── Labels ── */
export const Labels: Story = {
  render: (): TemplateResult => html`
    <div style="${PREVIEW_H}">
      <lib-divider style-variant="default">O</lib-divider>
      <lib-divider style-variant="default">Continúa más abajo</lib-divider>
      <lib-divider style-variant="default" align="left">Sección A</lib-divider>
      <lib-divider style-variant="default" align="right">Fin de sección</lib-divider>
      <lib-divider style-variant="hairline" label-style="display">o bien</lib-divider>
      <lib-divider style-variant="hairline" label-style="kanji">間</lib-divider>
      <lib-divider style-variant="hairline" label-style="kanji">美</lib-divider>
    </div>
  `,
};

/* ── Ornamentos ── */
export const Ornaments: Story = {
  render: (): TemplateResult => html`
    <div style="${PREVIEW_H}">
      <lib-divider style-variant="default"  ornament="dot"></lib-divider>
      <lib-divider style-variant="default"  ornament="diamond"></lib-divider>
      <lib-divider style-variant="gradient" ornament="dot"></lib-divider>
      <lib-divider style-variant="gradient" ornament="diamond"></lib-divider>
    </div>
  `,
};

/* ── Color ── */
export const Colors: Story = {
  render: (): TemplateResult => html`
    <div style="${PREVIEW_H}">
      <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em;">Kaki</p>
      <lib-divider color="kaki"></lib-divider>
      <lib-divider color="kaki" ornament="dot"></lib-divider>
      <lib-divider color="kaki" ornament="diamond"></lib-divider>
      <lib-divider color="kaki">Nueva sección</lib-divider>

      <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em; margin-top:8px;">Celadón</p>
      <lib-divider color="celadon"></lib-divider>
      <lib-divider color="celadon" ornament="diamond"></lib-divider>
    </div>
  `,
};

/* ── Vertical ── */
export const Vertical: Story = {
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3; display:flex; flex-direction:column; gap:24px;">

      <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em;">Styles</p>
      <div style="display:flex; align-items:stretch; gap:32px; height:80px;">
        ${(['hairline', 'default', 'strong', 'dashed', 'gradient'] as const).map(s => html`
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <lib-divider orientation="vertical" style-variant=${s} style="height:100%;"></lib-divider>
            <span style="font-family:monospace; font-size:9px; color:#9A8878;">${s}</span>
          </div>
        `)}
      </div>

      <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em;">En nav / breadcrumb</p>
      <div style="display:flex; align-items:center; gap:16px;">
        <span style="font-family:monospace; font-size:11px; color:#9A8878; letter-spacing:0.15em;">Inicio</span>
        <lib-divider orientation="vertical" style-variant="default" style="height:14px;"></lib-divider>
        <span style="font-family:monospace; font-size:11px; color:#9A8878; letter-spacing:0.15em;">Componentes</span>
        <lib-divider orientation="vertical" style-variant="default" style="height:14px;"></lib-divider>
        <span style="font-family:monospace; font-size:11px; color:#221C16; letter-spacing:0.15em;">Divider</span>
      </div>

      <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em;">En metadatos inline</p>
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-family:monospace; font-size:10px; color:#9A8878; letter-spacing:0.08em;">v0.1.0</span>
        <lib-divider orientation="vertical" style="height:12px;"></lib-divider>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; letter-spacing:0.08em;">MIT</span>
        <lib-divider orientation="vertical" style="height:12px;"></lib-divider>
        <span style="font-family:monospace; font-size:10px; color:#9A8878; letter-spacing:0.08em;">Actualizado hace 2 días</span>
        <lib-divider orientation="vertical" style="height:12px;"></lib-divider>
        <span style="font-family:monospace; font-size:10px; color:#B85A1E; letter-spacing:0.08em;">16 componentes</span>
      </div>

    </div>
  `,
};

/* ── On dark ── */
export const OnDark: Story = {
  name: 'On Dark Surface',
  render: (): TemplateResult => html`
    <div style="${PREVIEW_DARK}">
      <lib-divider style-variant="default"></lib-divider>
      <lib-divider style-variant="gradient"></lib-divider>
      <lib-divider style-variant="default" ornament="dot"></lib-divider>
      <lib-divider style-variant="default">Sección</lib-divider>
    </div>
  `,
};

/* ── Context: en prosa ── */
export const ContextProse: Story = {
  name: 'Context — Prose',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:#FFFFFF; border:1px solid #E5DDD3; max-width:600px;">
      <h3 style="font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:300; color:#221C16; letter-spacing:-0.02em; margin-bottom:12px;">
        Wabi-sabi en el diseño de sistemas
      </h3>
      <p style="font-family:'Shippori Mincho',serif; font-size:15px; color:#7A6A5C; line-height:1.8;">
        La imperfección no es un defecto a corregir, sino una cualidad a preservar. En los sistemas de diseño, la tensión entre consistencia y carácter define la madurez del equipo.
      </p>

      <lib-divider style-variant="gradient" ornament="diamond" style="margin:32px 0;"></lib-divider>

      <p style="font-family:'Shippori Mincho',serif; font-size:15px; color:#7A6A5C; line-height:1.8;">
        Los tokens no son solo variables CSS. Son el vocabulario de una cultura de diseño. Cuando un equipo comparte ese vocabulario, la comunicación se vuelve precisa.
      </p>

      <lib-divider style="margin:32px 0;"></lib-divider>

      <p style="font-family:monospace; font-size:11px; color:#B8A99A; letter-spacing:0.08em;">
        Publicado en Shibui Journal · Marzo 2026
      </p>
    </div>
  `,
};

/* ── Context: en card ── */
export const ContextCard: Story = {
  name: 'Context — Card',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3;">
      <div style="border:1px solid #E5DDD3; background:#FFFFFF; max-width:360px;">
        <div style="padding:20px 24px;">
          <p style="font-family:monospace; font-size:10px; color:#9A8878; text-transform:uppercase; letter-spacing:0.25em; margin-bottom:8px;">Resumen</p>
          <p style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:#221C16; letter-spacing:-0.02em;">16 componentes</p>
        </div>
        <lib-divider></lib-divider>
        <div style="padding:20px 24px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between;">
            <span style="font-family:monospace; font-size:11px; color:#9A8878; letter-spacing:0.08em;">Completados</span>
            <span style="font-family:monospace; font-size:11px; color:#221C16;">12</span>
          </div>
          <lib-divider style-variant="dotted"></lib-divider>
          <div style="display:flex; justify-content:space-between;">
            <span style="font-family:monospace; font-size:11px; color:#9A8878; letter-spacing:0.08em;">En progreso</span>
            <span style="font-family:monospace; font-size:11px; color:#B85A1E;">4</span>
          </div>
        </div>
      </div>
    </div>
  `,
};

/* ── Context: formulario ── */
export const ContextForm: Story = {
  name: 'Context — Form',
  render: (): TemplateResult => html`
    <div style="padding:24px; background:#F2EDE6; border:1px solid #E5DDD3;">
      <div style="max-width:360px; display:flex; flex-direction:column; gap:20px;">
        <button style="width:100%; padding:12px; background:#221C16; color:#FAF7F4; font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; border:none; cursor:pointer;">
          Continuar con email
        </button>
        <lib-divider style-variant="default">O</lib-divider>
        <button style="width:100%; padding:12px; background:transparent; color:#7A6A5C; font-family:monospace; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; border:1px solid #D3C8BC; cursor:pointer;">
          Continuar con Google
        </button>
      </div>
    </div>
  `,
};