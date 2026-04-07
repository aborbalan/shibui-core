import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-horizontal-scroll-section.component';

const meta: Meta = {
  title: 'Components/Organisms/HorizontalScrollSection',
  tags:['autodocs'],
  component: 'lib-horizontal-scroll-section',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Convierte scroll vertical en desplazamiento horizontal sticky.
La "duración" del efecto se controla con \`scroll-duration\` (número de vh).
El padding lateral con \`padding-inline\` (en vw). La barra de progreso es opcional.
        `,
      },
    },
  },
  argTypes: {
    scrollDuration: { control: { type: 'range', min: 2, max: 8, step: 0.5 } },
    paddingInline:  { control: { type: 'range', min: 4, max: 20, step: 1 } },
    showProgress:   { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── helpers estéticos ── */
const monoLabel = (text: string): string =>
  `font-family:var(--lib-font-mono);font-size:var(--text-xs);
   letter-spacing:var(--tracking-widest);text-transform:uppercase;
   color:var(--text-muted);${text}`;

/* ── Playground ── */
export const Playground: Story = {
  args: { scrollDuration: 3, paddingInline: 10, showProgress: true },
  render: (args): TemplateResult => html`
    <div>
      <section style="height:60vh;display:flex;align-items:center;justify-content:center;
        background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);">
        <div style="text-align:center;">
          <p style="${monoLabel('margin-bottom:.5rem;')}">Baja para descubrir</p>
          <h2 style="font-family:var(--lib-font-display);font-size:var(--text-3xl);
            font-weight:300;letter-spacing:var(--tracking-tight);">
            Colección horizontal
          </h2>
        </div>
      </section>

      <lib-horizontal-scroll-section
        scroll-duration="${args.scrollDuration}"
        padding-inline="${args.paddingInline}"
        ?show-progress="${args.showProgress}"
        @ui-lib-scroll-progress="${(e: CustomEvent): void =>
          console.log('progress', e.detail.percent + '%')}"
      >
        <div style="width:520px;height:380px;background:var(--color-washi-200);
          border:1px solid var(--border-default);display:flex;align-items:center;
          justify-content:center;">
          <span style="font-family:var(--lib-font-display);font-size:2rem;
            font-weight:300;color:var(--text-secondary);">01</span>
        </div>

        <div style="width:720px;height:480px;background:var(--color-washi-900);
          padding:var(--lib-space-xl);display:flex;flex-direction:column;
          justify-content:flex-end;gap:var(--lib-space-md);">
          <p style="${monoLabel('color:var(--color-washi-600);')}">Design system</p>
          <h3 style="font-family:var(--lib-font-display);font-size:var(--text-3xl);
            font-weight:300;color:var(--color-washi-100);line-height:1.2;">
            Filosofía<br><em style="color:var(--color-kaki-400);">Shibui</em>
          </h3>
          <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);
            color:var(--color-washi-500);max-width:380px;line-height:1.8;">
            La elegancia se encuentra en la simplicidad y en el paso del tiempo.
          </p>
        </div>

        <div style="width:440px;height:620px;background:var(--color-celadon-50);
          border:1px solid var(--color-celadon-100);"></div>

        <div style="width:560px;height:380px;background:var(--color-kaki-50);
          border:1px solid var(--color-kaki-100);display:flex;align-items:flex-end;
          padding:var(--lib-space-lg);">
          <p style="${monoLabel('color:var(--color-kaki-500);')}">04 · kaki</p>
        </div>

        <div style="width:400px;height:400px;background:var(--bg-elevated);
          border:1px solid var(--border-subtle);display:flex;align-items:center;
          justify-content:center;">
          <p style="${monoLabel('color:var(--text-muted);')}">fin</p>
        </div>
      </lib-horizontal-scroll-section>

      <section style="height:100vh;background:var(--color-washi-950);display:flex;
        align-items:center;justify-content:center;">
        <p style="font-family:var(--lib-font-display);font-size:var(--text-xl);
          font-weight:300;color:var(--color-washi-500);letter-spacing:var(--tracking-wider);">
          Fin de la experiencia
        </p>
      </section>
    </div>
  `,
};

/* ── Duración larga (galerías fotográficas) ── */
export const LongGallery: Story = {
  name: 'Galería larga — scroll-duration 5',
  render: (): TemplateResult => html`
    <div>
      <section style="height:50vh;display:flex;align-items:center;justify-content:center;
        background:var(--bg-surface);">
        <p style="font-family:var(--lib-font-display);font-size:var(--text-xl);
          font-weight:300;">Scroll lento · 500vh</p>
      </section>

      <lib-horizontal-scroll-section scroll-duration="5" padding-inline="8">
        ${[1,2,3,4,5,6,7].map(n => html`
          <div style="width:${280 + (n % 3) * 120}px;
            height:${320 + (n % 2) * 160}px;
            background:var(--color-washi-${100 + n * 100 > 900 ? 900 : 100 + n * 100});
            border:1px solid var(--border-subtle);
            display:flex;align-items:flex-end;padding:1rem;">
            <span style="${monoLabel('color:var(--text-muted);')}">0${n}</span>
          </div>
        `)}
      </lib-horizontal-scroll-section>

      <section style="height:60vh;background:var(--bg-base);"></section>
    </div>
  `,
};

/* ── Sin barra de progreso ── */
export const NoProgress: Story = {
  name: 'Sin barra de progreso',
  render: (): TemplateResult => html`
    <div>
      <section style="height:50vh;"></section>

      <lib-horizontal-scroll-section scroll-duration="3" ?show-progress="${false}">
        ${[1,2,3,4].map(n => html`
          <div style="width:600px;height:420px;
            background:var(--color-washi-${n * 100 + 100});
            border:1px solid var(--border-subtle);"></div>
        `)}
      </lib-horizontal-scroll-section>

      <section style="height:60vh;"></section>
    </div>
  `,
};