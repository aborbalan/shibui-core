import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-bubble-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { BubbleSeries }    from './lib-bubble-chart.types';

/* ── Args ── */
interface BubbleArgs {
  series:     BubbleSeries[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  minRadius:  number;
  maxRadius:  number;
  height:     number;
}

/* ── Datos de ejemplo ── */
const COUNTRIES: BubbleSeries = {
  name: 'Países',
  points: [
    { x: 12, y: 78, size: 47,  label: 'ES' },
    { x: 22, y: 81, size: 67,  label: 'DE' },
    { x: 18, y: 82, size: 65,  label: 'FR' },
    { x: 25, y: 79, size: 331, label: 'US' },
    { x: 10, y: 77, size: 60,  label: 'IT' },
    { x: 8,  y: 76, size: 1412, label: 'CN' },
    { x: 6,  y: 70, size: 1380, label: 'IN' },
  ],
};

const PRODUCTS_A: BubbleSeries = {
  name: 'Línea A',
  points: [
    { x: 3, y: 4, size: 20 }, { x: 5, y: 7, size: 60 }, { x: 8, y: 3, size: 35 }, { x: 6, y: 9, size: 90 },
  ],
};
const PRODUCTS_B: BubbleSeries = {
  name: 'Línea B',
  points: [
    { x: 2, y: 6, size: 50 }, { x: 7, y: 5, size: 25 }, { x: 9, y: 8, size: 75 }, { x: 4, y: 2, size: 40 },
  ],
};

/* ── Meta ── */
const meta: Meta<BubbleArgs> = {
  title:     'Universal/Charts/Bubble',
  component: 'lib-bubble-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-bubble-chart** · Organismo · \`app/data-viz\`

Gráfica de burbujas: un scatter con una **3ª dimensión** (\`size\`) mapeada al
**área** del círculo (escala sqrt, perceptualmente correcta). Comparte ejes,
rejilla, tooltip y leyenda con el resto del módulo. Katachi-aware.

\`\`\`html
<lib-bubble-chart
  .series=\${[{ name: 'Países', points: [{ x: 12, y: 78, size: 47, label: 'ES' }] }]}
  x-label="PIB per cápita" y-label="Esperanza de vida"
></lib-bubble-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    xLabel:     { control: 'text' },
    yLabel:     { control: 'text' },
    showGrid:   { control: 'boolean', name: 'show-grid' },
    showLegend: { control: 'boolean', name: 'show-legend' },
    minRadius:  { control: { type: 'number', min: 2, max: 20, step: 1 }, name: 'min-radius' },
    maxRadius:  { control: { type: 'number', min: 10, max: 60, step: 2 }, name: 'max-radius' },
    height:     { control: { type: 'number', min: 240, max: 600, step: 20 } },
  },

  args: {
    series:     [COUNTRIES],
    xLabel:     'PIB per cápita (k$)',
    yLabel:     'Esperanza de vida',
    showGrid:   true,
    showLegend: false,
    minRadius:  5,
    maxRadius:  34,
    height:     360,
  },

  render: (args) => html`
    <div style="width: 520px; padding: var(--lib-space-lg);">
      <lib-bubble-chart
        .series=${args.series}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        .minRadius=${args.minRadius}
        .maxRadius=${args.maxRadius}
        .height=${args.height}
      ></lib-bubble-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<BubbleArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Varias series con leyenda. */
export const MultiSeries: Story = {
  name: 'Varias series',
  args: {
    series:     [PRODUCTS_A, PRODUCTS_B],
    xLabel:     'Precio',
    yLabel:     'Satisfacción',
    showLegend: true,
  },
};

/** Rango de radios amplio (acentúa la 3ª dimensión). */
export const LargeRange: Story = {
  name: 'Radios amplios',
  args: { minRadius: 4, maxRadius: 52 },
};

/** Sin rejilla. */
export const NoGrid: Story = {
  name: 'Sin rejilla',
  args: { showGrid: false },
};

/** Estado vacío — sin puntos. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { series: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<BubbleArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:480px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">
    <lib-bubble-chart
      .series=${[PRODUCTS_A, PRODUCTS_B]}
      x-label="Precio"
      y-label="Satisfacción"
      show-grid
      show-legend
      .minRadius=${5}
      .maxRadius=${30}
      .height=${260}
    ></lib-bubble-chart>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4 · TESTS ── */

/** Verifica que se dibuja una burbuja por punto. */
export const TestBubbleCount: Story = {
  name: 'Test · una burbuja por punto',
  tags: ['test'],
  args: { series: [PRODUCTS_A] },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-bubble-chart');
    await chart?.updateComplete;
    const bubbles = chart?.shadowRoot?.querySelectorAll('.bubble');
    expect(bubbles?.length).toBe(4);
  },
};
