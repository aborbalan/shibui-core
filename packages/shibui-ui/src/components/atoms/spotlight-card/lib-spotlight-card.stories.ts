import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-spotlight-card.component';
import type { LibSpotlightCard } from './lib-spotlight-card.component';

type LibSpotlightCardStoryArgs = Pick<LibSpotlightCard, 'spotlight' | 'kintsugi'>;

/* Stage oscuro — el spotlight solo es visible sobre fondos oscuros */
const stage = (cols: number, content: TemplateResult): TemplateResult => html`
  <div style="
    background: #0f1923;
    padding: 48px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(${cols}, 1fr);
    gap: 24px;
  ">
    ${content}
  </div>
`;

const cardInner = (label: string, title: string, body: string, code: string): TemplateResult => html`
  <div style="padding:24px;">
    <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:oklch(60% 0 0); margin-bottom:12px;">${label}</p>
    <h3 style="font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:300; color:oklch(92% 0.01 60); margin-bottom:8px;">${title}</h3>
    <p style="font-size:13px; color:oklch(60% 0.01 220); line-height:1.8;">${body}</p>
    <div style="margin-top:16px; padding:12px 16px; background:oklch(100% 0 0 / 0.04); border-radius:4px; border:1px solid oklch(100% 0 0 / 0.06);">
      <code style="font-family:monospace; font-size:10px; color:oklch(45% 0.05 45);">${code}</code>
    </div>
  </div>
`;

const meta: Meta<LibSpotlightCardStoryArgs> = {
  title: 'Components/Atoms/SpotlightCard',
  component: 'lib-spotlight-card',
  tags:['autodocs'],
  parameters: {
    backgrounds: { default: 'dark' },
  },

  argTypes: {
    spotlight: {
      control: 'select',
      options: ['kaki', 'water', 'white'],
      description: 'Color del foco de luz reactivo al cursor',
    },
    kintsugi: {
      control: 'boolean',
      description: 'Activa el hilo de oro en el borde (--lib-kintsugi-border)',
    },
  },

  render: (args): TemplateResult => stage(1, html`
    <lib-spotlight-card
      spotlight=${args.spotlight}
      ?kintsugi=${args.kintsugi}
    >
      ${cardInner(
        `--lib-spotlight-gradient${args.spotlight !== 'kaki' ? '-' + args.spotlight : ''}`,
        `${args.spotlight.charAt(0).toUpperCase() + args.spotlight.slice(1)} Spotlight`,
        'Mueve el cursor sobre la card para ver el foco reactivo.',
        `oklch(${args.spotlight === 'kaki' ? '45% 0.05 45' : args.spotlight === 'water' ? '55% 0.06 210' : '100% 0 0'} / 0.12)`
      )}
    </lib-spotlight-card>
  `),
};

export default meta;
type Story = StoryObj<LibSpotlightCardStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    spotlight: 'kaki',
    kintsugi: false,
  },
};

/* ── Las tres variantes de spotlight ── */
export const SpotlightVariants: Story = {
  name: 'Spotlight Variants .',
  render: (): TemplateResult => stage(3, html`
    <lib-spotlight-card spotlight="kaki">
      ${cardInner(
        '--lib-spotlight-gradient',
        'Kaki Spotlight',
        'Foco cálido orgánico. Para cards de acento o CTAs destacados.',
        'oklch(45% 0.05 45 / 0.12)'
      )}
    </lib-spotlight-card>

    <lib-spotlight-card spotlight="water">
      ${cardInner(
        '--lib-spotlight-gradient-water',
        'Water Spotlight',
        'Foco azul sereno. Para acciones primary o elementos informativos.',
        'oklch(55% 0.06 210 / 0.12)'
      )}
    </lib-spotlight-card>

    <lib-spotlight-card spotlight="white">
      ${cardInner(
        '--lib-spotlight-gradient-white',
        'White Spotlight',
        'Foco neutro. Versátil, funciona sobre cualquier fondo oscuro.',
        'oklch(100% 0 0 / 0.10)'
      )}
    </lib-spotlight-card>
  `),
};

/* ── Kintsugi border ── */
export const KintsugiVariant: Story = {
  name: 'Kintsugi Border',
  render: (): TemplateResult => html`
    <div style="background:#0f1923; padding:48px; border-radius:8px;">
      <lib-spotlight-card kintsugi style="max-width:100%;">
        <div style="padding:24px; display:grid; grid-template-columns:1fr 1fr; gap:32px; align-items:center;">
          <div>
            <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; color:oklch(60% 0 0); margin-bottom:12px;">--lib-kintsugi-border</p>
            <h3 style="font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:oklch(92% 0.01 60); margin-bottom:8px;">Kintsugi Border</h3>
            <p style="font-size:13px; color:oklch(60% 0.01 220); line-height:1.8;">
              El hilo de oro en las grietas. Gradiente diagonal en el borde que evoca el arte japonés de reparar cerámica con oro. Spotlight kaki activo al mover el cursor.
            </p>
          </div>
          <div style="padding:16px; background:oklch(100% 0 0 / 0.04); border-radius:4px; border:1px solid oklch(100% 0 0 / 0.06);">
            <code style="font-family:monospace; font-size:10px; color:oklch(45% 0.05 45); line-height:2; display:block;">
              --lib-kintsugi-border:<br>
              linear-gradient(<br>
              &nbsp;&nbsp;135deg,<br>
              &nbsp;&nbsp;oklch(45% 0.05 45 / 0.6) 0%,<br>
              &nbsp;&nbsp;oklch(45% 0.05 45 / 0) 40%,<br>
              &nbsp;&nbsp;oklch(45% 0.05 45 / 0.3) 100%<br>
              )
            </code>
          </div>
        </div>
      </lib-spotlight-card>
    </div>
  `,
};

/* ── Spotlight vs Kintsugi comparación ── */
export const Comparison: Story = {
  name: 'Spotlight vs Kintsugi',
  render: (): TemplateResult => stage(2, html`
    <lib-spotlight-card spotlight="kaki">
      ${cardInner('Sin kintsugi', 'Spotlight puro', 'Fondo neutro oscuro. Solo el foco de luz reacciona al cursor.', '--lib-spotlight-gradient')}
    </lib-spotlight-card>

    <lib-spotlight-card spotlight="kaki" ?kintsugi=${true}>
      ${cardInner('Con kintsugi', 'Spotlight + Border', 'Fondo cálido oscuro. Hilo de oro en el borde y foco reactivo.', '--lib-kintsugi-border')}
    </lib-spotlight-card>
  `),
};

/* ── Context: grid de cards de features ── */
export const ContextFeatureGrid: Story = {
  name: 'Context — Feature Grid',
  render: (): TemplateResult => stage(3, html`
    <lib-spotlight-card spotlight="kaki">
      <div style="padding:24px;">
        <p style="font-family:monospace; font-size:10px; color:oklch(50% 0 0); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Tokens</p>
        <h3 style="font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; color:oklch(90% 0.01 60); margin-bottom:8px;">Design Tokens</h3>
        <p style="font-size:12px; color:oklch(55% 0.01 220); line-height:1.8;">CSS custom properties en capas: primitivos → compuestos → semánticos.</p>
      </div>
    </lib-spotlight-card>

    <lib-spotlight-card spotlight="water">
      <div style="padding:24px;">
        <p style="font-family:monospace; font-size:10px; color:oklch(50% 0 0); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Componentes</p>
        <h3 style="font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; color:oklch(90% 0.01 60); margin-bottom:8px;">Web Components</h3>
        <p style="font-size:12px; color:oklch(55% 0.01 220); line-height:1.8;">Agnósticos de framework. Funcionan en React, Svelte, Angular y vanilla.</p>
      </div>
    </lib-spotlight-card>

    <lib-spotlight-card ?kintsugi=${true}>
      <div style="padding:24px;">
        <p style="font-family:monospace; font-size:10px; color:oklch(50% 0 0); text-transform:uppercase; letter-spacing:0.25em; margin-bottom:16px;">Efectos</p>
        <h3 style="font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:300; color:oklch(90% 0.01 60); margin-bottom:8px;">Kintsugi Digital</h3>
        <p style="font-size:12px; color:oklch(55% 0.01 220); line-height:1.8;">Glass, spotlight y kintsugi border como tokens opcionales del sistema.</p>
      </div>
    </lib-spotlight-card>
  `),
};