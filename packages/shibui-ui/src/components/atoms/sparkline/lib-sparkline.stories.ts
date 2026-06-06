import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-sparkline.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { SparklineType, SparklineTone } from './lib-sparkline.types';

/* ── Args ── */
interface SparklineArgs {
  values:     number[];
  type:       SparklineType;
  tone:       SparklineTone;
  width:      number;
  height:     number;
  smooth:     boolean;
  showEndDot: boolean;
}

/* ── Datos de ejemplo ── */
const TREND_UP   = [3, 5, 4, 6, 5, 8, 7, 10, 12];
const TREND_DOWN = [12, 10, 11, 8, 9, 6, 5, 4, 2];
const VOLATILE   = [5, 9, 3, 8, 2, 10, 4, 7, 1, 6];

/* ── Meta ── */
const meta: Meta<SparklineArgs> = {
  title:     'Universal/Charts/Sparkline',
  component: 'lib-sparkline',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-sparkline** · Átomo · \`app/data-viz\`

Mini-gráfica inline sin ejes ni leyenda, para incrustar en texto, celdas de
tabla, \`lib-counter\` o \`lib-metric-bar\`. Tipos \`line\` · \`area\` · \`bar\`,
con suavizado y punto final opcionales. El color sale de \`currentColor\`; el
atributo \`tone\` lo mapea a tokens semánticos (katachi-aware).

\`\`\`html
<lib-sparkline .values=\${[3,5,2,8,6,9]} type="area" tone="success" show-end-dot></lib-sparkline>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    type: { control: 'inline-radio', options: ['line', 'area', 'bar'] },
    tone: { control: 'select', options: ['default', 'accent', 'info', 'success', 'warning', 'error'] },
    width:      { control: { type: 'number', min: 40, max: 320, step: 10 } },
    height:     { control: { type: 'number', min: 16, max: 120, step: 4 } },
    smooth:     { control: 'boolean' },
    showEndDot: { control: 'boolean', name: 'show-end-dot' },
  },

  args: {
    values:     TREND_UP,
    type:       'line',
    tone:       'default',
    width:      120,
    height:     32,
    smooth:     false,
    showEndDot: true,
  },

  render: (args) => html`
    <div style="padding: var(--lib-space-lg); color: var(--text-primary);">
      <lib-sparkline
        .values=${args.values}
        type=${args.type}
        tone=${args.tone}
        .width=${args.width}
        .height=${args.height}
        ?smooth=${args.smooth}
        ?show-end-dot=${args.showEndDot}
      ></lib-sparkline>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SparklineArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Los tres tipos de trazado. */
export const Types: Story = {
  name: 'Tipos',
  render: () => html`
    <div style="display:flex;gap:var(--lib-space-xl);align-items:center;padding:var(--lib-space-lg);color:var(--text-primary);">
      ${(['line', 'area', 'bar'] as const).map(t => html`
        <div style="display:flex;flex-direction:column;gap:var(--lib-space-xs);align-items:center;">
          <lib-sparkline .values=${TREND_UP} type=${t} .width=${120} .height=${36} show-end-dot></lib-sparkline>
          <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">${t}</span>
        </div>
      `)}
    </div>
  `,
};

/** Tonos semánticos. */
export const Tones: Story = {
  name: 'Tonos',
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);padding:var(--lib-space-lg);">
      ${(['default', 'accent', 'info', 'success', 'warning', 'error'] as const).map(tone => html`
        <div style="display:flex;gap:var(--lib-space-md);align-items:center;">
          <lib-sparkline .values=${VOLATILE} type="area" tone=${tone} .width=${140} .height=${28} show-end-dot></lib-sparkline>
          <span style="font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">${tone}</span>
        </div>
      `)}
    </div>
  `,
};

/** Suavizado vs recto. */
export const Smooth: Story = {
  name: 'Suavizado',
  render: () => html`
    <div style="display:flex;gap:var(--lib-space-xl);padding:var(--lib-space-lg);color:var(--text-primary);">
      <lib-sparkline .values=${VOLATILE} type="line" .width=${160} .height=${40}></lib-sparkline>
      <lib-sparkline .values=${VOLATILE} type="line" .width=${160} .height=${40} smooth></lib-sparkline>
    </div>
  `,
};

/** Tendencia: subida en verde, bajada en rojo (uso típico en KPIs). */
export const Trends: Story = {
  name: 'Tendencias',
  render: () => html`
    <div style="display:flex;gap:var(--lib-space-xl);padding:var(--lib-space-lg);">
      <span style="display:inline-flex;gap:var(--lib-space-sm);align-items:center;color:var(--text-primary);font-family:var(--lib-font-mono);">
        Ingresos <lib-sparkline .values=${TREND_UP} type="line" tone="success" .width=${90} .height=${24} show-end-dot></lib-sparkline> +18%
      </span>
      <span style="display:inline-flex;gap:var(--lib-space-sm);align-items:center;color:var(--text-primary);font-family:var(--lib-font-mono);">
        Churn <lib-sparkline .values=${TREND_DOWN} type="line" tone="error" .width=${90} .height=${24} show-end-dot></lib-sparkline> −9%
      </span>
    </div>
  `,
};

/** Estado vacío — sin valores. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { values: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<SparklineArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:360px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);color:var(--text-primary);">

    <div style="display:flex;gap:var(--lib-space-lg);align-items:center;">
      <lib-sparkline .values=${TREND_UP} type="line" .width=${110} .height=${32} show-end-dot></lib-sparkline>
      <lib-sparkline .values=${VOLATILE} type="area" .width=${110} .height=${32}></lib-sparkline>
      <lib-sparkline .values=${TREND_UP} type="bar"  .width=${110} .height=${32}></lib-sparkline>
    </div>

    <div style="display:flex;gap:var(--lib-space-lg);align-items:center;">
      <lib-sparkline .values=${VOLATILE} type="area" tone="success" .width=${110} .height=${28} show-end-dot></lib-sparkline>
      <lib-sparkline .values=${TREND_DOWN} type="area" tone="error" .width=${110} .height=${28} show-end-dot></lib-sparkline>
      <lib-sparkline .values=${VOLATILE} type="line" tone="accent" .width=${110} .height=${28} smooth show-end-dot></lib-sparkline>
    </div>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4 · TESTS ── */

/** Verifica que line dibuja un path. */
export const TestLinePath: Story = {
  name: 'Test · line dibuja un path',
  tags: ['test'],
  args: { values: TREND_UP, type: 'line' },
  play: async ({ canvasElement }): Promise<void> => {
    const spark = canvasElement.querySelector('lib-sparkline');
    await spark?.updateComplete;
    const path = spark?.shadowRoot?.querySelector('.spark-line');
    expect(path).toBeTruthy();
  },
};

/** Verifica que bar dibuja una barra por valor. */
export const TestBarCount: Story = {
  name: 'Test · bar dibuja una barra por valor',
  tags: ['test'],
  args: { values: [1, 2, 3, 4], type: 'bar' },
  play: async ({ canvasElement }): Promise<void> => {
    const spark = canvasElement.querySelector('lib-sparkline');
    await spark?.updateComplete;
    const bars = spark?.shadowRoot?.querySelectorAll('.spark-bar');
    expect(bars?.length).toBe(4);
  },
};
