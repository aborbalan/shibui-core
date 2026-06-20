import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-burger-button.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

const meta: Meta = {
  title: 'Universal/Actions/Burger',
  tags:['autodocs'],
  component: 'lib-burger',
  argTypes: {
    theme:     { control: 'select', options: ['filled', 'kanji', 'neutral', 'framed', 'inverse', 'glitch'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    open:      { control: 'boolean' },
    label:     { control: 'text' },
    labelOpen: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj;

/* helper de label */
const lbl = (t: string): TemplateResult => html`
  <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
    text-transform:uppercase;color:var(--text-muted);">${t}</span>`;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    theme:     'filled',
    size:      'md',
    open:      false,
    label:     '',
    labelOpen: 'cerrar',
  },
  render: (args): TemplateResult => html`
    <div style="padding:3rem;">
      <lib-burger
        theme="${args.theme}"
        size="${args.size}"
        ?open="${args.open}"
        label="${args.label}"
        label-open="${args.labelOpen}"
        @ui-lib-burger-change="${(e: CustomEvent): void => console.log('burger', e.detail)}"
      ></lib-burger>
    </div>
  `,
};

/* ── Variantes — light ── */
export const Variants: Story = {
  name: 'Variantes — filled · kanji · neutral · framed',
  render: (): TemplateResult => html`
    <div style="padding:3rem;display:flex;align-items:center;gap:3rem;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled"></lib-burger>
        ${lbl('ink stroke')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="kanji"></lib-burger>
        ${lbl('kanji 三')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="neutral"></lib-burger>
        ${lbl('neutral fold')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="framed"></lib-burger>
        ${lbl('hanko frame')}
      </div>

    </div>
  `,
};

/* ── Kintsugi — dark ── */
export const Kintsugi: Story = {
  name: 'Kintsugi — surface oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--color-washi-950);
      display:flex;align-items:center;gap:3rem;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="inverse"></lib-burger>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
          text-transform:uppercase;color:var(--color-washi-700);">inverse</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="inverse" label="menú" label-open="cerrar"></lib-burger>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
          text-transform:uppercase;color:var(--color-washi-700);">con label</span>
      </div>

    </div>
  `,
};

/* ── Glitch ── */
export const Glitch: Story = {
  name: 'Glitch — RGB split + scramble',
  render: (): TemplateResult => html`
    <div style="padding:3rem;display:flex;align-items:center;gap:3rem;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="glitch"></lib-burger>
        ${lbl('glitch · light')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;
        background:var(--color-washi-950);padding:1.5rem;">
        <lib-burger theme="glitch"
          style="color:rgba(250,247,244,0.45);">
        </lib-burger>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
          text-transform:uppercase;color:var(--color-washi-700);">glitch · dark</span>
      </div>

    </div>
  `,
};

/* ── Tamaños ── */
export const Sizes: Story = {
  name: 'Tamaños — sm · md · lg',
  render: (): TemplateResult => html`
    <div style="padding:3rem;display:flex;align-items:center;gap:3rem;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled" size="sm"></lib-burger>
        ${lbl('sm')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled" size="md"></lib-burger>
        ${lbl('md')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled" size="lg"></lib-burger>
        ${lbl('lg')}
      </div>

    </div>
  `,
};

/* ── Con label ── */
export const WithLabel: Story = {
  name: 'Con label — texto animado',
  render: (): TemplateResult => html`
    <div style="padding:3rem;display:flex;align-items:center;gap:3rem;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled" label="menú" label-open="cerrar"></lib-burger>
        ${lbl('ink + label')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="neutral" label="menú" label-open="cerrar"></lib-burger>
        ${lbl('neutral + label')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="kanji" label="menú" label-open="cerrar"></lib-burger>
        ${lbl('kanji + label')}
      </div>

    </div>
  `,
};

/* ── Estado open ── */
export const OpenState: Story = {
  name: 'Estado abierto — todas las variantes',
  render: (): TemplateResult => html`
    <div style="padding:3rem;display:flex;align-items:center;gap:3rem;flex-wrap:wrap;">

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="filled" open></lib-burger>
        ${lbl('ink open')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="kanji" open></lib-burger>
        ${lbl('kanji open')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="neutral" open></lib-burger>
        ${lbl('neutral open')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="framed" open></lib-burger>
        ${lbl('framed open')}
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;
        background:var(--color-washi-950);padding:1rem;">
        <lib-burger theme="inverse" open></lib-burger>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
          text-transform:uppercase;color:var(--color-washi-700);">inverse open</span>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:1rem;">
        <lib-burger theme="glitch" open></lib-burger>
        ${lbl('glitch open')}
      </div>

    </div>
  `,
};

/* ── En contexto de nav ── */
export const InContext: Story = {
  name: 'En contexto — nav demo',
  render: (): TemplateResult => html`
    <div style="padding:2rem;max-width:640px;">

      <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
        text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">
        Nav · light
      </p>

      <div style="position:relative;">
        <div style="display:flex;align-items:center;justify-content:space-between;
          padding:1rem 2rem;background:#fff;border:1px solid var(--border-subtle);">
          <span style="font-family:var(--lib-font-display);font-size:1.5rem;
            font-weight:300;letter-spacing:0.15em;">
            shibui
            <span style="display:block;font-family:var(--lib-font-mono);
              font-size:10px;color:var(--text-muted);letter-spacing:0.25em;">
              渋い · design system
            </span>
          </span>
          <lib-burger
            theme="filled"
            label="menú"
            label-open="cerrar"
            @ui-lib-burger-change="${(e: CustomEvent): void => {
              const menu = document.getElementById('story-nav-menu');
              if (menu) menu.style.maxHeight = e.detail.open ? '300px' : '0';
            }}"
          ></lib-burger>
        </div>
        <div id="story-nav-menu" style="overflow:hidden;max-height:0;
          transition:max-height 350ms cubic-bezier(0,0,0.2,1);
          background:#fff;border:1px solid var(--border-subtle);border-top:none;">
          ${['Tokens · 01','Componentes · 02','Efectos · 03','Documentación · 04'].map(item => html`
            <a href="#" style="display:flex;justify-content:space-between;
              padding:1.25rem 2rem;font-family:var(--lib-font-display);
              font-size:1.4rem;font-weight:300;color:var(--text-primary);
              text-decoration:none;border-bottom:1px solid var(--border-subtle);"
              @click="${(e: Event): void => e.preventDefault()}"
            >${item}</a>
          `)}
        </div>
      </div>

    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-burger usa tokens semánticos (text-primary, text-muted)
   para sus líneas y label — adapta al contexto katachi ambient.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">
    <div style="display:flex;align-items:center;gap:var(--lib-space-lg);flex-wrap:wrap;">
      <lib-burger theme="filled"     size="md"></lib-burger>
      <lib-burger theme="kanji"   size="md"></lib-burger>
      <lib-burger theme="neutral"   size="md"></lib-burger>
      <lib-burger theme="framed"  size="md"></lib-burger>
      <lib-burger theme="glitch"  size="md"></lib-burger>
    </div>
    <div style="display:flex;align-items:center;gap:var(--lib-space-lg);flex-wrap:wrap;">
      <lib-burger theme="filled"     size="md" open></lib-burger>
      <lib-burger theme="kanji"   size="md" open></lib-burger>
      <lib-burger theme="neutral"   size="md" open></lib-burger>
      <lib-burger theme="framed"  size="md" open></lib-burger>
      <lib-burger theme="glitch"  size="md" open></lib-burger>
    </div>
    <div style="display:flex;align-items:center;gap:var(--lib-space-lg);">
      <lib-burger theme="filled" size="sm"></lib-burger>
      <lib-burger theme="filled" size="md"></lib-burger>
      <lib-burger theme="filled" size="lg"></lib-burger>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;