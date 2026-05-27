import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import './lib-scatter-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { ScatterSeries }   from './lib-scatter-chart.types';

/* ── Args ── */
interface ScatterChartArgs {
  series:     ScatterSeries[];
  xLabel:     string;
  yLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  dotRadius:  number;
  height:     number;
}

/* ── Datos de ejemplo ── */
const SERIES_A: ScatterSeries = {
  name: 'Grupo A',
  points: [
    { x: 10, y: 30 }, { x: 20, y: 55 }, { x: 35, y: 40 },
    { x: 50, y: 75 }, { x: 65, y: 50 }, { x: 80, y: 90 },
    { x: 90, y: 65 },
  ],
};

const SERIES_B: ScatterSeries = {
  name: 'Grupo B',
  points: [
    { x: 5,  y: 80 }, { x: 25, y: 60 }, { x: 40, y: 85 },
    { x: 55, y: 45 }, { x: 70, y: 70 }, { x: 85, y: 30 },
  ],
};

const SERIES_C: ScatterSeries = {
  name: 'Grupo C',
  points: [
    { x: 15, y: 10 }, { x: 30, y: 20 }, { x: 45, y: 15 },
    { x: 60, y: 35 }, { x: 75, y: 25 }, { x: 88, y: 40 },
  ],
};

const SERIES_LABELED: ScatterSeries = {
  name: 'Ciudades',
  points: [
    { x: 22, y: 58, label: 'Madrid'    },
    { x: 41, y: 47, label: 'Barcelona' },
    { x: 12, y: 71, label: 'Bilbao'    },
    { x: 55, y: 36, label: 'Valencia'  },
    { x: 30, y: 62, label: 'Sevilla'   },
    { x: 70, y: 20, label: 'Zaragoza'  },
  ],
};

/* ── Meta ── */
const meta: Meta<ScatterChartArgs> = {
  title:     'Universal/Charts/Scatter Chart',
  component: 'lib-scatter-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-scatter-chart** · Organismo · \`app/data-viz\`

Gráfica de dispersión SVG nativa. Soporta múltiples series de datos,
tooltip interactivo al pasar el cursor sobre cada punto, leyenda automática
y rejilla configurable.

Katachi-aware: los ejes, rejilla y etiquetas consumen tokens semánticos,
por lo que se adaptan visualmente a cada contexto sin configuración adicional.

\`\`\`html
<lib-scatter-chart
  .series=\${misSeries}
  x-label="Temperatura"
  y-label="Presión"
  show-grid
  show-legend
></lib-scatter-chart>
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
    dotRadius:  { control: { type: 'number', min: 2, max: 16, step: 1 } },
    height:     { control: { type: 'number', min: 200, max: 600, step: 20 } },
  },

  args: {
    series:     [SERIES_A, SERIES_B],
    xLabel:     'Variable X',
    yLabel:     'Variable Y',
    showGrid:   true,
    showLegend: true,
    dotRadius:  5,
    height:     320,
  },

  render: (args) => html`
    <div style="width: 560px; padding: var(--lib-space-lg);">
      <lib-scatter-chart
        .series=${args.series}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        .dotRadius=${args.dotRadius}
        .height=${args.height}
      ></lib-scatter-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScatterChartArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/** Una sola serie de datos. */
export const SingleSeries: Story = {
  name: 'Una serie',
  args: {
    series:     [SERIES_A],
    xLabel:     'Temperatura (°C)',
    yLabel:     'Presión (Pa)',
    showLegend: false,
  },
};

/** Tres series simultáneas con leyenda. */
export const MultiSeries: Story = {
  name: 'Múltiples series',
  args: {
    series:  [SERIES_A, SERIES_B, SERIES_C],
    xLabel:  'Eje X',
    yLabel:  'Eje Y',
    height:  360,
  },
};

/** Puntos con etiqueta — visible en el tooltip y en el title nativo. */
export const PointsWithLabels: Story = {
  name: 'Puntos con etiquetas',
  args: {
    series:     [SERIES_LABELED],
    xLabel:     'Longitud',
    yLabel:     'Latitud',
    showLegend: false,
    dotRadius:  7,
  },
};

/** Estado vacío — sin series ni puntos. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: {
    series:  [],
    xLabel:  'X',
    yLabel:  'Y',
  },
};

/** Sin rejilla de fondo. */
export const NoGrid: Story = {
  name: 'Sin rejilla',
  args: {
    series:   [SERIES_A, SERIES_B],
    showGrid: false,
  },
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — gráfica en cada contexto estético
───────────────────────────────────────────────────────────── */
const _katachi = createKatachiStories<ScatterChartArgs>(() => html`
  <div
    style="
      width: 520px;
      padding: var(--lib-space-lg);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
    "
  >
    <lib-scatter-chart
      .series=${[SERIES_A, SERIES_B]}
      x-label="Eje X"
      y-label="Eje Y"
      show-grid
      show-legend
      .height=${280}
    ></lib-scatter-chart>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
