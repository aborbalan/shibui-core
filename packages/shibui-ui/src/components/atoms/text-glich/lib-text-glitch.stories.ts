import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-text-glitch.component';
import type { LibTextGlitch } from './lib-text-glitch.component';

type LibTextGlitchArgs = Pick<LibTextGlitch, 'text' | 'variant' | 'trigger' | 'active'>;

const meta: Meta<LibTextGlitchArgs> = {
  title: 'Components/Atoms/Text Glitch',
  component: 'lib-text-glitch',
  argTypes: {
    variant: {
      control: 'select',
      options: ['slice', 'scan', 'shift', 'decode', 'redact', 'noise'],
      description: 'Variante de efecto visual',
    },
    trigger: {
      control: 'select',
      options: ['hover', 'always'],
      description: 'Modo de activación',
    },
    active: {
      control: 'boolean',
      description: 'Activa el efecto programáticamente',
    },
    text: {
      control: 'text',
      description: 'Texto a renderizar',
    },
  },
  render: (args): TemplateResult => html`
    <div style="padding:4rem;background:var(--bg-base);min-height:12rem;display:flex;align-items:center;">
      <span style="font-family:var(--lib-font-display);font-size:3.5rem;font-weight:300;letter-spacing:-0.02em;line-height:1.1;">
        <lib-text-glitch
          text=${args.text}
          variant=${args.variant}
          trigger=${args.trigger}
          ?active=${args.active}
        ></lib-text-glitch>
      </span>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibTextGlitchArgs>;


/* ══════════════════════════════════════
   PLAYGROUND
   ══════════════════════════════════════ */
export const Playground: Story = {
  args: {
    text:    'shibui',
    variant: 'slice',
    trigger: 'hover',
    active:  false,
  },
};


/* ══════════════════════════════════════
   ALL VARIANTS — visión general
   ══════════════════════════════════════ */
export const AllVariants: Story = {
  name: 'All Variants — hover to activate',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <!-- Light stage: slice · scan · shift · decode · redact -->
      <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:2.5rem;">
        ${(['slice', 'scan', 'shift', 'decode', 'redact'] as const).map(v => html`
          <div style="display:flex;align-items:baseline;gap:2rem;">
            <span style="
              font-family:var(--lib-font-mono);font-size:10px;
              letter-spacing:0.25em;color:var(--text-muted);
              text-transform:uppercase;width:56px;flex-shrink:0;">
              ${v}
            </span>
            <span style="font-family:var(--lib-font-display);font-size:2.75rem;font-weight:300;letter-spacing:-0.02em;line-height:1.1;">
              <lib-text-glitch text="shibui 渋い" variant="${v}"></lib-text-glitch>
            </span>
          </div>
        `)}
      </div>

      <!-- Dark stage: noise only -->
      <div style="padding:2.5rem 3rem;background:var(--color-washi-950);display:flex;align-items:baseline;gap:2rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--color-washi-600);text-transform:uppercase;width:56px;flex-shrink:0;">
          noise
        </span>
        <span style="font-family:var(--lib-font-display);font-size:2.75rem;font-weight:300;letter-spacing:-0.02em;color:oklch(82% 0.015 55);line-height:1.1;">
          <lib-text-glitch text="shibui 渋い" variant="noise"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   SLICE — RGB split
   ══════════════════════════════════════ */
export const Slice: Story = {
  name: 'Slice — RGB split',
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:3rem;">

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Display · 5xl</span>
        <span style="font-family:var(--lib-font-display);font-size:5rem;font-weight:300;letter-spacing:-0.02em;line-height:1;">
          <lib-text-glitch text="kintsugi" variant="slice"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;gap:3rem;align-items:flex-end;flex-wrap:wrap;">
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Italic accent</span>
          <span style="font-family:var(--lib-font-display);font-size:2.75rem;font-style:italic;color:var(--color-kaki-500);letter-spacing:-0.02em;">
            <lib-text-glitch text="渋い" variant="slice"></lib-text-glitch>
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Mono · nav link</span>
          <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted);">
            <lib-text-glitch text="ANATOMY" variant="slice"></lib-text-glitch>
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Mono · kaki</span>
          <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.25em;text-transform:uppercase;color:var(--color-kaki-500);">
            <lib-text-glitch text="← 42 PROGRESS" variant="slice"></lib-text-glitch>
          </span>
        </div>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   SCAN — barrido de lector óptico
   ══════════════════════════════════════ */
export const Scan: Story = {
  name: 'Scan — left-to-right sweep',
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:3rem;">

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Display · plays once per hover</span>
        <span style="font-family:var(--lib-font-display);font-size:3.5rem;font-weight:300;letter-spacing:-0.02em;">
          <lib-text-glitch text="diseño sutil" variant="scan"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Mono · versión · ideal para CTAs</span>
        <span style="font-family:var(--lib-font-mono);font-size:var(--text-sm);letter-spacing:0.08em;color:var(--text-secondary);">
          <lib-text-glitch text="v0.1.0 · 43 components" variant="scan"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">trigger="always" — scan en bucle</span>
        <span style="font-family:var(--lib-font-display);font-size:2rem;font-weight:300;letter-spacing:-0.02em;">
          <lib-text-glitch text="cargando sistema" variant="scan" trigger="always"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   SHIFT — imprenta desregistrada
   ══════════════════════════════════════ */
export const Shift: Story = {
  name: 'Shift — letterpress misalignment',
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:3rem;">

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Display · 4xl — intensidad baja</span>
        <span style="font-family:var(--lib-font-display);font-size:4rem;font-weight:300;letter-spacing:-0.02em;line-height:1.1;">
          <lib-text-glitch text="wabi-sabi" variant="shift"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Body text</span>
        <span style="font-family:var(--lib-font-body);font-size:var(--text-base);color:var(--text-secondary);line-height:1.6;">
          <lib-text-glitch text="La belleza de lo incompleto" variant="shift"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   DECODE — katakana scramble
   ══════════════════════════════════════ */
export const Decode: Story = {
  name: 'Decode — katakana scramble',
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:3rem;">

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Display · pasa el cursor</span>
        <span style="font-family:var(--lib-font-display);font-size:3.5rem;font-weight:300;letter-spacing:-0.02em;">
          <lib-text-glitch text="shibui" variant="decode"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;gap:3rem;flex-wrap:wrap;align-items:flex-end;">
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Italic accent</span>
          <span style="font-family:var(--lib-font-display);font-size:2.2rem;font-style:italic;color:var(--text-accent);">
            <lib-text-glitch text="wabi-sabi" variant="decode"></lib-text-glitch>
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Mono uppercase</span>
          <span style="font-family:var(--lib-font-mono);font-size:var(--text-sm);letter-spacing:0.15em;color:var(--text-secondary);">
            <lib-text-glitch text="DESIGN SYSTEM" variant="decode"></lib-text-glitch>
          </span>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Kanji</span>
          <span style="font-family:var(--lib-font-display);font-size:2.5rem;color:var(--color-washi-300);">
            <lib-text-glitch text="渋い美学" variant="decode"></lib-text-glitch>
          </span>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">trigger="always" — decodifica en bucle</span>
        <span style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;letter-spacing:-0.02em;">
          <lib-text-glitch text="kintsugi digital" variant="decode" trigger="always"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   REDACT — documento clasificado
   ══════════════════════════════════════ */
export const Redact: Story = {
  name: 'Redact — classified document',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;">

      <!-- Light stage -->
      <div style="padding:3rem;background:var(--bg-base);display:flex;flex-direction:column;gap:2.5rem;">
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Display · plays once per hover</span>
          <span style="font-family:var(--lib-font-display);font-size:3rem;font-weight:300;letter-spacing:-0.02em;">
            <lib-text-glitch text="kintsugi digital" variant="redact"></lib-text-glitch>
          </span>
        </div>
        <div style="display:flex;gap:2.5rem;flex-wrap:wrap;align-items:center;">
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Mono</span>
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-sm);letter-spacing:0.15em;text-transform:uppercase;">
              <lib-text-glitch text="CLASIFICADO" variant="redact"></lib-text-glitch>
            </span>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Body</span>
            <span style="font-family:var(--lib-font-body);font-size:var(--text-base);color:var(--text-secondary);">
              <lib-text-glitch text="La belleza de lo incompleto" variant="redact"></lib-text-glitch>
            </span>
          </div>
        </div>
      </div>

      <!-- Dark stage -->
      <div style="padding:3rem;background:var(--color-washi-950);display:flex;flex-direction:column;gap:2rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--color-washi-600);text-transform:uppercase;">Dark stage</span>
        <span style="font-family:var(--lib-font-display);font-size:2.8rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.75);">
          <lib-text-glitch text="sistema shibui" variant="redact"></lib-text-glitch>
        </span>
        <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.25em;text-transform:uppercase;color:oklch(30% 0.02 50);">
          <lib-text-glitch text="渋い · design system · v0.1.0" variant="redact"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   NOISE — señal analógica corrupta
   ══════════════════════════════════════ */
export const Noise: Story = {
  name: 'Noise — dark backgrounds only',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding:3rem;background:var(--color-washi-950);display:flex;flex-direction:column;gap:3rem;">

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--color-washi-700);text-transform:uppercase;">Display · dark</span>
        <span style="font-family:var(--lib-font-display);font-size:3.5rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.75);line-height:1;">
          <lib-text-glitch text="shibui" variant="noise"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--color-washi-700);text-transform:uppercase;">Kanji · italic</span>
        <span style="font-family:var(--lib-font-display);font-size:5rem;font-style:italic;letter-spacing:-0.02em;color:rgba(250,247,244,0.3);line-height:1;">
          <lib-text-glitch text="渋い" variant="noise"></lib-text-glitch>
        </span>
      </div>

      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--color-washi-700);text-transform:uppercase;">trigger="always"</span>
        <span style="font-family:var(--lib-font-display);font-size:2.5rem;font-weight:300;letter-spacing:-0.02em;color:rgba(250,247,244,0.6);line-height:1;">
          <lib-text-glitch text="乱れ" variant="noise" trigger="always"></lib-text-glitch>
        </span>
      </div>

    </div>
  `,
};


/* ══════════════════════════════════════
   CONTEXTO — nav con todas las variantes
   ══════════════════════════════════════ */
export const ContextNav: Story = {
  name: 'Contexto — nav con cada variante',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-direction:column;background:var(--bg-base);">

      <!-- Nav simulado -->
      <div style="
        background: rgba(250,247,244,0.97);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--border-subtle);
        padding: 0.75rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="font-family:var(--lib-font-display);font-size:var(--text-xl);letter-spacing:0.15em;font-weight:300;">
          shibui
          <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);letter-spacing:0.25em;display:block;">渋い · 43 glitch · base</span>
        </div>

        <!-- Links con distintas variantes -->
        <div style="display:flex;gap:1.5rem;">
          <a style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.08em;color:var(--text-muted);text-decoration:none;text-transform:uppercase;" href="#">
            <lib-text-glitch text="Slice" variant="slice"></lib-text-glitch>
          </a>
          <a style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.08em;color:var(--text-muted);text-decoration:none;text-transform:uppercase;" href="#">
            <lib-text-glitch text="Scan" variant="scan"></lib-text-glitch>
          </a>
          <a style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.08em;color:var(--text-muted);text-decoration:none;text-transform:uppercase;" href="#">
            <lib-text-glitch text="Decode" variant="decode"></lib-text-glitch>
          </a>
          <a style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.08em;color:var(--text-muted);text-decoration:none;text-transform:uppercase;" href="#">
            <lib-text-glitch text="Redact" variant="redact"></lib-text-glitch>
          </a>
        </div>

        <a style="font-family:var(--lib-font-mono);font-size:var(--text-xs);letter-spacing:0.08em;color:var(--color-kaki-500);text-decoration:none;text-transform:uppercase;opacity:0.6;" href="#">
          <lib-text-glitch text="← 42 Progress" variant="scan"></lib-text-glitch>
        </a>
      </div>

      <!-- Hint -->
      <div style="padding:2.5rem 2rem;font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
        ↑ hover over each nav item
      </div>

      <!-- Tabla resumen -->
      <div style="margin:0 2rem 3rem;border:1px solid var(--border-subtle);background:var(--bg-surface);">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;padding:0.75rem 1.5rem;border-bottom:1px solid var(--border-subtle);background:var(--color-washi-100);">
          ${(['Variante','Duración','Intensidad','Uso ideal'] as const).map(h => html`
            <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">${h}</span>
          `)}
        </div>
        ${([
          ['Slice',  '∞ durante hover',  'Media',  'Títulos, nav links'],
          ['Scan',   '600ms · una vez',  'Baja',   'CTAs, file nav'],
          ['Shift',  '∞ durante hover',  'Baja',   'Body, subtítulos'],
          ['Decode', '400–800ms · once', 'Alta',   'Heroes, logotipos'],
          ['Redact', '700ms · una vez',  'Alta',   'Classified, secreto'],
          ['Noise',  '∞ durante hover',  'Alta',   'Solo dark bg'],
        ] as const).map(([v, dur, int, use]) => html`
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;padding:0.75rem 1.5rem;border-bottom:1px solid var(--border-subtle);background:var(--bg-elevated);">
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-primary);">${v}</span>
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">${dur}</span>
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">${int}</span>
            <span style="font-family:var(--lib-font-mono);font-size:var(--text-xs);color:var(--text-muted);">${use}</span>
          </div>
        `)}
      </div>

    </div>
  `,
};