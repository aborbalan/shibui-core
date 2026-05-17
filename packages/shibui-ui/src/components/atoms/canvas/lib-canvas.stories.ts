import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-canvas.component';
import '../card/lib-card.component';
import '../button/lib-button.component';
import '../badge/lib-badge.component';
import type { LibCanvas } from './lib-canvas.component';
import type { KatachiId } from '../../../../models/ui/common';

type LibCanvasStoryArgs = Pick<LibCanvas, 'katachi' | 'display' | 'pad' | 'minH'>;

const KATACHI: Array<{ id: KatachiId; kanji: string; label: string; tagline: string }> = [
  { id: 'wabi',     kanji: '侘び',   label: 'Wabi',     tagline: 'dark · glass atmosférico' },
  { id: 'kintsugi', kanji: '金継ぎ', label: 'Kintsugi', tagline: 'dorado · spotlight' },
  { id: 'sabi',     kanji: '寂び',   label: 'Sabi',     tagline: 'washi · shadow brutal' },
  { id: 'terminal', kanji: '_',      label: 'Terminal', tagline: 'CRT · digital duro' },
  { id: 'shizen',   kanji: '自然',   label: 'Shizen',   tagline: 'limpio · sin adorno' },
  { id: 'celadon',  kanji: '青磁',   label: 'Celadon',  tagline: 'jade · spotlight water' },
];

const meta: Meta<LibCanvasStoryArgs> = {
  title: 'Utilities/Canvas',
  component: 'lib-canvas',
  tags: ['autodocs'],
  argTypes: {
    katachi: {
      control: 'select',
      options: ['', 'wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'],
      description: 'Aesthetic context activo (se refleja como `data-katachi`).',
    },
    display: {
      control: 'select',
      options: ['contents', 'block', 'flex'],
      description: '`contents` = sin caja, solo contexto. `block`/`flex` = caja con superficie.',
    },
    pad: {
      control: 'select',
      options: ['', 'lg', 'xl', '2xl'],
      description: 'Padding shortcut. Solo aplica en `block`/`flex`.',
    },
    minH: {
      control: 'select',
      options: ['', 'screen'],
      description: 'Reservar viewport completo. Útil para demo pages.',
      name: 'min-h',
    },
  },
};

export default meta;
type Story = StoryObj<LibCanvasStoryArgs>;

const mockContent = (): TemplateResult => html`
  <lib-card style="display:block; padding:24px;">
    <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 8px;">
      Component
    </p>
    <h3 style="font-family:'Cormorant Garamond',serif; font-weight:300; font-size:28px; margin:0 0 12px;">
      Ambient context
    </h3>
    <p style="font-family:'Shippori Mincho',serif; line-height:1.7; margin:0 0 16px;">
      El katachi activo se propaga vía CSS custom properties — los hijos lo consumen sin saber su nombre.
    </p>
    <div style="display:flex; gap:12px; align-items:center;">
      <lib-button>Acción</lib-button>
      <lib-badge>Beta</lib-badge>
    </div>
  </lib-card>
`;

/* ── Playground ─────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    katachi: 'kintsugi',
    display: 'block',
    pad: 'xl',
    minH: '',
  },
  render: (args): TemplateResult => html`
    <lib-canvas
      katachi=${args.katachi || ''}
      display=${args.display}
      pad=${args.pad || ''}
      min-h=${args.minH || ''}
    >
      ${mockContent()}
    </lib-canvas>
  `,
};

/* ── Six katachi side-by-side ───────────────────────────────── */
export const SixKatachi: Story = {
  name: 'Los 6 Katachi',
  render: (): TemplateResult => html`
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:16px; padding:16px;">
      ${KATACHI.map((k) => html`
        <lib-canvas katachi=${k.id} display="block" pad="lg">
          <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:16px;">
            <div>
              <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0; opacity:0.6;">
                ${k.label}
              </p>
              <p style="font-family:'Shippori Mincho',serif; font-size:13px; margin:4px 0 0; opacity:0.75;">
                ${k.tagline}
              </p>
            </div>
            <span style="font-family:'Shippori Mincho',serif; font-size:32px; opacity:0.5;">${k.kanji}</span>
          </div>
          ${mockContent()}
        </lib-canvas>
      `)}
    </div>
  `,
};

/* ── Display modes ──────────────────────────────────────────── */
export const DisplayModes: Story = {
  name: 'Display: contents · block · flex',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:32px; padding:24px;">

      <div>
        <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 12px;">
          display="contents" — solo propaga contexto, no introduce caja
        </p>
        <div style="padding:16px; background:#FAF7F4; border:1px dashed #E5DDD3;">
          <lib-canvas katachi="kintsugi">
            ${mockContent()}
          </lib-canvas>
        </div>
      </div>

      <div>
        <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 12px;">
          display="block" pad="xl" — reserva una caja con superficie
        </p>
        <lib-canvas katachi="sabi" display="block" pad="xl">
          ${mockContent()}
        </lib-canvas>
      </div>

      <div>
        <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 12px;">
          display="flex" pad="lg" — caja flex column con gap-md
        </p>
        <lib-canvas katachi="celadon" display="flex" pad="lg">
          ${mockContent()}
          ${mockContent()}
        </lib-canvas>
      </div>

    </div>
  `,
};

/* ── Nesting (override) ─────────────────────────────────────── */
export const NestedOverride: Story = {
  name: 'Nested · katachi anidados',
  render: (): TemplateResult => html`
    <lib-canvas katachi="kintsugi" display="block" pad="2xl">
      <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 16px;">
        Outer · kintsugi
      </p>
      ${mockContent()}

      <div style="margin-top:24px;">
        <lib-canvas katachi="terminal" display="block" pad="lg">
          <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 16px;">
            Inner · terminal (override)
          </p>
          ${mockContent()}
        </lib-canvas>
      </div>
    </lib-canvas>
  `,
};

/* ── Default (no katachi) ───────────────────────────────────── */
export const NoKatachi: Story = {
  name: 'Sin katachi (default light)',
  render: (): TemplateResult => html`
    <lib-canvas display="block" pad="xl">
      <p style="font-family:monospace; font-size:10px; letter-spacing:0.25em; text-transform:uppercase; margin:0 0 16px;">
        Sin atributo katachi
      </p>
      ${mockContent()}
    </lib-canvas>
  `,
};
