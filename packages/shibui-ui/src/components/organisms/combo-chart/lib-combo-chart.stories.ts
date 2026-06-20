import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-combo-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { ChartSeries }     from './lib-combo-chart.types';

/* ── Args ── */
interface ComboArgs {
  categories:  string[];
  barSeries:   ChartSeries[];
  lineSeries:  ChartSeries[];
  xLabel:      string;
  yLabel:      string;
  yLabelRight: string;
  dualAxis:    boolean;
  smooth:      boolean;
  showGrid:    boolean;
  showLegend:  boolean;
  height:      number;
}

/* ── Datos de ejemplo ── */
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

const VOLUMEN: ChartSeries = { name: 'Volumen', values: [1200, 1450, 1320, 1780, 1650, 1980] };
const PRECIO:  ChartSeries = { name: 'Precio',  values: [9.2, 9.8, 9.5, 11.2, 10.6, 12.4] };

const INGRESOS: ChartSeries = { name: 'Ingresos', values: [120, 145, 132, 160, 175, 190] };
const GASTOS:   ChartSeries = { name: 'Gastos',   values: [90, 105, 98, 120, 130, 140] };
const MARGEN:   ChartSeries = { name: 'Margen %', values: [25, 28, 26, 25, 26, 26] };

/* ── Meta ── */
const meta: Meta<ComboArgs> = {
  title:     'Universal/Charts/Combo',
  component: 'lib-combo-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-combo-chart** · Organismo · \`app/data-viz\`

Combina **barras + líneas** sobre un eje de banda compartido (p.ej. volumen
en barras + tendencia de precio en línea). Con \`dual-axis\` las líneas usan un
segundo eje Y a la derecha, para magnitudes de escala distinta. Katachi-aware.

\`\`\`html
<lib-combo-chart
  .categories=\${meses}
  .barSeries=\${[{ name: 'Volumen', values: [...] }]}
  .lineSeries=\${[{ name: 'Precio', values: [...] }]}
  dual-axis
></lib-combo-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    xLabel:      { control: 'text', name: 'x-label' },
    yLabel:      { control: 'text', name: 'y-label' },
    yLabelRight: { control: 'text', name: 'y-label-right' },
    dualAxis:    { control: 'boolean', name: 'dual-axis' },
    smooth:      { control: 'boolean' },
    showGrid:    { control: 'boolean', name: 'show-grid' },
    showLegend:  { control: 'boolean', name: 'show-legend' },
    height:      { control: { type: 'number', min: 220, max: 560, step: 20 } },
  },

  args: {
    categories:  MONTHS,
    barSeries:   [VOLUMEN],
    lineSeries:  [PRECIO],
    xLabel:      'Mes',
    yLabel:      'Volumen',
    yLabelRight: 'Precio (€)',
    dualAxis:    true,
    smooth:      false,
    showGrid:    true,
    showLegend:  true,
    height:      340,
  },

  render: (args) => html`
    <div style="width: 560px; padding: var(--lib-space-lg);">
      <lib-combo-chart
        .categories=${args.categories}
        .barSeries=${args.barSeries}
        .lineSeries=${args.lineSeries}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        y-label-right=${args.yLabelRight}
        ?dual-axis=${args.dualAxis}
        ?smooth=${args.smooth}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        .height=${args.height}
      ></lib-combo-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ComboArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Doble eje Y: volumen (barras, izq) + precio (línea, der). */
export const DualAxis: Story = {
  name: 'Doble eje Y',
  args: { dualAxis: true, smooth: true },
};

/** Eje único compartido (magnitudes comparables). */
export const SharedAxis: Story = {
  name: 'Eje único',
  args: {
    barSeries:   [INGRESOS, GASTOS],
    lineSeries:  [],
    categories:  MONTHS,
    dualAxis:    false,
    yLabel:      'k€',
    yLabelRight: '',
  },
};

/** Barras apilables de negocio + línea de margen en eje derecho. */
export const BusinessMix: Story = {
  name: 'Ingresos/Gastos + Margen',
  args: {
    barSeries:   [INGRESOS, GASTOS],
    lineSeries:  [MARGEN],
    categories:  MONTHS,
    dualAxis:    true,
    smooth:      true,
    yLabel:      'k€',
    yLabelRight: '%',
  },
};

/** Estado vacío. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { categories: [], barSeries: [], lineSeries: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<ComboArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">
    <lib-combo-chart
      .categories=${MONTHS}
      .barSeries=${[VOLUMEN]}
      .lineSeries=${[PRECIO]}
      x-label="Mes"
      y-label="Volumen"
      y-label-right="Precio (€)"
      dual-axis
      smooth
      show-grid
      show-legend
      .height=${260}
    ></lib-combo-chart>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4 · TESTS ── */

/** Verifica que dibuja barras y línea a la vez. */
export const TestBarsAndLine: Story = {
  name: 'Test · dibuja barras y línea',
  tags: ['test'],
  args: { categories: MONTHS, barSeries: [VOLUMEN], lineSeries: [PRECIO] },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-combo-chart');
    await chart?.updateComplete;
    const bars = chart?.shadowRoot?.querySelectorAll('.bar');
    const line = chart?.shadowRoot?.querySelector('.combo-line');
    expect(bars?.length).toBe(6);
    expect(line).toBeTruthy();
  },
};

/** Verifica que dual-axis añade ticks de eje derecho. */
export const TestDualAxis: Story = {
  name: 'Test · dual-axis pinta eje derecho',
  tags: ['test'],
  args: { categories: MONTHS, barSeries: [VOLUMEN], lineSeries: [PRECIO], dualAxis: true },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-combo-chart');
    await chart?.updateComplete;
    const yTickGroups = chart?.shadowRoot?.querySelectorAll('.y-ticks');
    expect((yTickGroups?.length ?? 0)).toBe(2);
  },
};
