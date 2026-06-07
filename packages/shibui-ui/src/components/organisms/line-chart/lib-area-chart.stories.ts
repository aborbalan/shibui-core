import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-line-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { LineChartMode }   from './lib-line-chart.types';
import type { ChartPointSeries, ChartSeries } from '../../../../models/ui/charts';

/* ── Args ── */
interface AreaChartArgs {
  series:      ChartSeries[];
  categories:  string[];
  pointSeries: ChartPointSeries[];
  xLabel:      string;
  yLabel:      string;
  showGrid:    boolean;
  showLegend:  boolean;
  showDots:    boolean;
  smooth:      boolean;
  mode:        LineChartMode;
  height:      number;
}

/* ── Datos de ejemplo ── */
const CATS_MONTH = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const CATS_Q     = ['Q1', 'Q2', 'Q3', 'Q4'];

const SERIES_TRAFICO: ChartSeries = { name: 'Tráfico', values: [120, 145, 132, 178, 165, 198] };

const SERIES_DESKTOP: ChartSeries = { name: 'Desktop', values: [50, 62, 58, 75] };
const SERIES_MOBILE:  ChartSeries = { name: 'Mobile',  values: [30, 45, 52, 60] };
const SERIES_TABLET:  ChartSeries = { name: 'Tablet',  values: [12, 18, 22, 20] };

const POINTS_SIGNAL: ChartPointSeries = {
  name: 'Señal',
  points: [{ x: 0, y: 2 }, { x: 1, y: 4 }, { x: 2.5, y: 3 }, { x: 4, y: 7 }, { x: 6, y: 5 }],
};

/* ── Meta ──
   Area Chart no es un componente propio: es lib-line-chart en modo
   `area` / `stacked-area`. Esta entrada le da visibilidad en el sidebar. */
const meta: Meta<AreaChartArgs> = {
  title:     'Universal/Charts/Area Chart',
  component: 'lib-line-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**Area Chart** · Organismo · \`app/data-viz\`

No es un componente independiente: es **\`lib-line-chart\` en modo \`area\`**
(o \`stacked-area\`). Misma API, escalas y leyenda que Line Chart, con el
relleno bajo la curva. Para áreas apiladas, usa \`mode="stacked-area"\` con
eje de banda.

\`\`\`html
<lib-line-chart .series=\${s} .categories=\${cats} mode="area" smooth></lib-line-chart>
<lib-line-chart .series=\${s} .categories=\${cats} mode="stacked-area"></lib-line-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    xLabel:     { control: 'text',    description: 'Etiqueta del eje X' },
    yLabel:     { control: 'text',    description: 'Etiqueta del eje Y' },
    showGrid:   { control: 'boolean', name: 'show-grid'   },
    showLegend: { control: 'boolean', name: 'show-legend' },
    showDots:   { control: 'boolean', name: 'show-dots'   },
    smooth:     { control: 'boolean' },
    mode: {
      control: 'select',
      options: ['area', 'stacked-area', 'line'],
      description: 'Modo de trazado',
    },
    height: { control: { type: 'number', min: 200, max: 600, step: 20 } },
  },

  args: {
    series:      [SERIES_TRAFICO],
    categories:  CATS_MONTH,
    pointSeries: [],
    xLabel:      'Mes',
    yLabel:      'Sesiones (k)',
    showGrid:    true,
    showLegend:  false,
    showDots:    true,
    smooth:      true,
    mode:        'area',
    height:      320,
  },

  render: (args) => html`
    <div style="width: 560px; padding: var(--lib-space-lg);">
      <lib-line-chart
        .series=${args.series}
        .categories=${args.categories}
        .pointSeries=${args.pointSeries}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        ?show-dots=${args.showDots}
        ?smooth=${args.smooth}
        mode=${args.mode}
        .height=${args.height}
      ></lib-line-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<AreaChartArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Área simple con curva suave. */
export const SmoothArea: Story = {
  name: 'Área suave',
  args: { smooth: true },
};

/** Área recta (sin suavizado). */
export const SharpArea: Story = {
  name: 'Área recta',
  args: { smooth: false },
};

/** Áreas apiladas — composición por dispositivo. */
export const StackedArea: Story = {
  name: 'Áreas apiladas',
  args: {
    series:     [SERIES_DESKTOP, SERIES_MOBILE, SERIES_TABLET],
    categories: CATS_Q,
    xLabel:     'Trimestre',
    yLabel:     'Usuarios (k)',
    mode:       'stacked-area',
    showLegend: true,
    height:     340,
  },
};

/** Área sobre eje X numérico. */
export const LinearArea: Story = {
  name: 'Área · eje X numérico',
  args: {
    series:      [],
    categories:  [],
    pointSeries: [POINTS_SIGNAL],
    xLabel:      'Tiempo (s)',
    yLabel:      'Lectura',
  },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<AreaChartArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">área · suave</p>
      <lib-line-chart
        .series=${[SERIES_TRAFICO]}
        .categories=${CATS_MONTH}
        x-label="Mes"
        y-label="Sesiones (k)"
        mode="area"
        smooth
        show-grid
        .height=${200}
      ></lib-line-chart>
    </div>

    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">stacked-area · 3 series</p>
      <lib-line-chart
        .series=${[SERIES_DESKTOP, SERIES_MOBILE, SERIES_TABLET]}
        .categories=${CATS_Q}
        x-label="Trimestre"
        y-label="Usuarios (k)"
        mode="stacked-area"
        show-grid
        show-legend
        .height=${200}
      ></lib-line-chart>
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

/** Verifica que el modo área renderiza el relleno. */
export const TestAreaFill: Story = {
  name: 'Test · pinta relleno de área',
  tags: ['test'],
  args: { series: [SERIES_TRAFICO], categories: CATS_MONTH, mode: 'area' },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-line-chart');
    await chart?.updateComplete;
    const area = chart?.shadowRoot?.querySelector('.area-path');
    expect(area).toBeTruthy();
  },
};
