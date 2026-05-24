import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import './lib-bar-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { BarSeries, BarChartMode } from './lib-bar-chart.types';

/* ── Args ── */
interface BarChartArgs {
  series:     BarSeries[];
  categories: string[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  mode:       BarChartMode;
  height:     number;
}

/* ── Datos de ejemplo ── */
const CATS_Q = ['Q1', 'Q2', 'Q3', 'Q4'];
const CATS_MONTH = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
const CATS_DEPT  = ['Marketing', 'Ventas', 'IT', 'RRHH', 'Legal'];

const SERIES_2023: BarSeries = { name: '2023', values: [42, 68, 55, 81] };
const SERIES_2024: BarSeries = { name: '2024', values: [57, 45, 73, 60] };
const SERIES_2025: BarSeries = { name: '2025', values: [65, 52, 80, 74] };

const SERIES_INGRESOS: BarSeries = { name: 'Ingresos', values: [120, 145, 132, 160, 175, 190] };
const SERIES_GASTOS:   BarSeries = { name: 'Gastos',   values: [ 90, 105,  98, 120, 130, 140] };

const SERIES_STACK_A: BarSeries = { name: 'Producto A', values: [30, 50, 40, 60, 35] };
const SERIES_STACK_B: BarSeries = { name: 'Producto B', values: [25, 35, 45, 30, 55] };
const SERIES_STACK_C: BarSeries = { name: 'Producto C', values: [15, 20, 25, 20, 30] };

/* ── Meta ── */
const meta: Meta<BarChartArgs> = {
  title:     'Charts/Bar Chart',
  component: 'lib-bar-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-bar-chart** · Organismo · \`app/data-viz\`

Gráfica de barras SVG nativa. Soporta múltiples series en modo agrupado
(\`grouped\`) o apilado (\`stacked\`), tooltip interactivo al pasar el cursor
sobre cada barra y leyenda automática.

Katachi-aware: ejes, rejilla y etiquetas se adaptan visualmente a cada
contexto sin configuración adicional.

\`\`\`html
<lib-bar-chart
  .series=\${misSeries}
  .categories=\${['Q1','Q2','Q3','Q4']}
  x-label="Trimestre"
  y-label="Ventas (k€)"
  show-grid
  show-legend
></lib-bar-chart>
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
    mode: {
      control: 'select',
      options: ['grouped', 'stacked'],
      description: 'Modo de agrupación de barras',
    },
    height: { control: { type: 'number', min: 200, max: 600, step: 20 } },
  },

  args: {
    series:     [SERIES_2023, SERIES_2024],
    categories: CATS_Q,
    xLabel:     'Trimestre',
    yLabel:     'Ventas (k€)',
    showGrid:   true,
    showLegend: true,
    mode:       'grouped',
    height:     320,
  },

  render: (args) => html`
    <div style="width: 560px; padding: var(--lib-space-lg);">
      <lib-bar-chart
        .series=${args.series}
        .categories=${args.categories}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        mode=${args.mode}
        .height=${args.height}
      ></lib-bar-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<BarChartArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/** Una sola serie de datos. */
export const SingleSeries: Story = {
  name: 'Una serie',
  args: {
    series:     [SERIES_2024],
    categories: CATS_Q,
    xLabel:     'Trimestre',
    yLabel:     'Unidades',
    showLegend: false,
  },
};

/** Tres series agrupadas. */
export const ThreeSeries: Story = {
  name: 'Tres series agrupadas',
  args: {
    series:     [SERIES_2023, SERIES_2024, SERIES_2025],
    categories: CATS_Q,
    xLabel:     'Trimestre',
    yLabel:     'Ventas (k€)',
    height:     340,
  },
};

/** Ingresos vs gastos — 6 meses. */
export const IngresosVsGastos: Story = {
  name: 'Ingresos vs Gastos',
  args: {
    series:     [SERIES_INGRESOS, SERIES_GASTOS],
    categories: CATS_MONTH,
    xLabel:     'Mes',
    yLabel:     'Importe (k€)',
    height:     300,
  },
};

/** Modo apilado con 3 productos por departamento. */
export const Stacked: Story = {
  name: 'Modo apilado',
  args: {
    series:     [SERIES_STACK_A, SERIES_STACK_B, SERIES_STACK_C],
    categories: CATS_DEPT,
    xLabel:     'Departamento',
    yLabel:     'Unidades',
    mode:       'stacked',
    height:     340,
  },
};

/** Estado vacío — sin series ni categorías. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: {
    series:     [],
    categories: [],
    xLabel:     'X',
    yLabel:     'Y',
  },
};

/** Sin rejilla de fondo. */
export const NoGrid: Story = {
  name: 'Sin rejilla',
  args: {
    series:   [SERIES_2023, SERIES_2024],
    showGrid: false,
  },
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — gráfica en cada contexto estético
───────────────────────────────────────────────────────────── */
const _katachi = createKatachiStories<BarChartArgs>(() => html`
  <div
    style="
      width: 520px;
      padding: var(--lib-space-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
    "
  >
    <lib-bar-chart
      .series=${[SERIES_2023, SERIES_2024]}
      .categories=${CATS_Q}
      x-label="Trimestre"
      y-label="Ventas (k€)"
      show-grid
      show-legend
      .height=${260}
    ></lib-bar-chart>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
