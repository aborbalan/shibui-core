import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-line-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { LineChartMode }   from './lib-line-chart.types';
import type { ChartPointSeries, ChartSeries } from '../../../../models/ui/charts';

/* ── Args ── */
interface LineChartArgs {
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

const SERIES_VISITAS:    ChartSeries = { name: 'Visitas',    values: [120, 145, 132, 178, 165, 198] };
const SERIES_CONVERS:    ChartSeries = { name: 'Conversión', values: [ 40,  58,  52,  70,  66,  84] };

const SERIES_DESKTOP: ChartSeries = { name: 'Desktop', values: [50, 62, 58, 75] };
const SERIES_MOBILE:  ChartSeries = { name: 'Mobile',  values: [30, 45, 52, 60] };
const SERIES_TABLET:  ChartSeries = { name: 'Tablet',  values: [12, 18, 22, 20] };

const POINTS_SENSOR_A: ChartPointSeries = {
  name: 'Sensor A',
  points: [{ x: 0, y: 2 }, { x: 1, y: 4 }, { x: 2.5, y: 3 }, { x: 4, y: 7 }, { x: 6, y: 5 }],
};
const POINTS_SENSOR_B: ChartPointSeries = {
  name: 'Sensor B',
  points: [{ x: 0, y: 5 }, { x: 1.5, y: 3 }, { x: 3, y: 6 }, { x: 5, y: 4 }, { x: 6, y: 8 }],
};

/* ── Meta ── */
const meta: Meta<LineChartArgs> = {
  title:     'Universal/Charts/Line Chart',
  component: 'lib-line-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-line-chart** · Organismo · \`app/data-viz\`

Gráfica de líneas / áreas SVG nativa con dos modos de eje X:

- **banda** → \`.series\` + \`.categories\` (series temporales discretas).
- **lineal** → \`.pointSeries\` con puntos \`{ x, y }\` y eje X numérico.

Trazado en \`line\`, \`area\` o \`stacked-area\` (este último solo en banda),
con opción de curva suave (\`smooth\`) y puntos sobre la línea (\`show-dots\`).
Katachi-aware: ejes, rejilla y etiquetas se adaptan a cada contexto.

\`\`\`html
<lib-line-chart
  .series=\${misSeries}
  .categories=\${['Q1','Q2','Q3','Q4']}
  mode="area"
  smooth
  show-dots
></lib-line-chart>
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
      options: ['line', 'area', 'stacked-area'],
      description: 'Modo de trazado',
    },
    height: { control: { type: 'number', min: 200, max: 600, step: 20 } },
  },

  args: {
    series:      [SERIES_VISITAS, SERIES_CONVERS],
    categories:  CATS_MONTH,
    pointSeries: [],
    xLabel:      'Mes',
    yLabel:      'Sesiones (k)',
    showGrid:    true,
    showLegend:  true,
    showDots:    true,
    smooth:      false,
    mode:        'line',
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
type Story = StoryObj<LineChartArgs>;

/* ─────────────────────────────────────────────────────────────
   1 · PLAYGROUND
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/* ─────────────────────────────────────────────────────────────
   2 · API
───────────────────────────────────────────────────────────── */

/** Una sola serie, línea simple. */
export const SingleSeries: Story = {
  name: 'Una serie',
  args: {
    series:     [SERIES_VISITAS],
    showLegend: false,
  },
};

/** Modo área con relleno bajo la línea. */
export const Area: Story = {
  name: 'Modo área',
  args: { mode: 'area' },
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
    height:     340,
  },
};

/** Curva suave (smooth). */
export const Smooth: Story = {
  name: 'Curva suave',
  args: { smooth: true, mode: 'area' },
};

/** Eje X numérico — series de puntos {x,y} con espaciado no uniforme. */
export const LinearAxis: Story = {
  name: 'Eje X numérico',
  args: {
    series:      [],
    categories:  [],
    pointSeries: [POINTS_SENSOR_A, POINTS_SENSOR_B],
    xLabel:      'Tiempo (s)',
    yLabel:      'Lectura',
    smooth:      true,
  },
};

/** Estado vacío — sin datos. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: {
    series:      [],
    categories:  [],
    pointSeries: [],
  },
};

/** Sin rejilla ni puntos — línea limpia. */
export const Minimal: Story = {
  name: 'Sin rejilla ni puntos',
  args: {
    series:   [SERIES_VISITAS, SERIES_CONVERS],
    showGrid: false,
    showDots: false,
  },
};

/* ─────────────────────────────────────────────────────────────
   3 · KATACHI — gráfica en cada contexto estético
───────────────────────────────────────────────────────────── */
const _katachi = createKatachiStories<LineChartArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <!-- Line — 2 series -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">line · 2 series</p>
      <lib-line-chart
        .series=${[SERIES_VISITAS, SERIES_CONVERS]}
        .categories=${CATS_MONTH}
        x-label="Mes"
        y-label="Sesiones (k)"
        show-grid
        show-legend
        show-dots
        .height=${200}
      ></lib-line-chart>
    </div>

    <!-- Stacked-area — 3 series -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">stacked-area · smooth</p>
      <lib-line-chart
        .series=${[SERIES_DESKTOP, SERIES_MOBILE, SERIES_TABLET]}
        .categories=${CATS_Q}
        x-label="Trimestre"
        y-label="Usuarios (k)"
        mode="stacked-area"
        smooth
        show-grid
        show-legend
        .height=${200}
      ></lib-line-chart>
    </div>

    <!-- Linear axis — eje X numérico -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">eje numérico · área</p>
      <lib-line-chart
        .pointSeries=${[POINTS_SENSOR_A]}
        x-label="Tiempo (s)"
        y-label="Lectura"
        mode="area"
        smooth
        .height=${160}
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

/* ─────────────────────────────────────────────────────────────
   4 · TESTS
───────────────────────────────────────────────────────────── */

/** Verifica que se renderiza una line-path por serie. */
export const TestRendersPaths: Story = {
  name: 'Test · una línea por serie',
  tags: ['test'],
  args: {
    series:     [SERIES_DESKTOP, SERIES_MOBILE, SERIES_TABLET],
    categories: CATS_Q,
  },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-line-chart');
    await chart?.updateComplete;
    const paths = chart?.shadowRoot?.querySelectorAll('.line-path');
    expect(paths?.length).toBe(3);
  },
};

/** Verifica que el modo área añade un area-path. */
export const TestAreaFill: Story = {
  name: 'Test · el modo área pinta relleno',
  tags: ['test'],
  args: {
    series:     [SERIES_VISITAS],
    categories: CATS_MONTH,
    mode:       'area',
    showLegend: false,
  },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-line-chart');
    await chart?.updateComplete;
    const area = chart?.shadowRoot?.querySelector('.area-path');
    expect(area).toBeTruthy();
  },
};
