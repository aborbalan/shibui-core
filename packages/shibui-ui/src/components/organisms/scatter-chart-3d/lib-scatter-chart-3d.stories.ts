import type { Meta, StoryObj }   from '@storybook/web-components-vite';
import { html }                  from 'lit';
import './lib-scatter-chart-3d.component';
import { createKatachiStories }  from '../../../stories/katachi-stories.helper';
import type { ScatterSeries3d }  from './lib-scatter-chart-3d.types';

/* ── Args ── */
interface ScatterChart3dArgs {
  series:     ScatterSeries3d[];
  xLabel:     string;
  yLabel:     string;
  zLabel:     string;
  showGrid:   boolean;
  showLegend: boolean;
  dotRadius:  number;
  height:     number;
}

/* ── Datos de ejemplo ── */
const SERIES_A: ScatterSeries3d = {
  name: 'Grupo A',
  points: [
    { x: 10, y: 20, z: 30 }, { x: 30, y: 50, z: 10 }, { x: 50, y: 30, z: 70 },
    { x: 70, y: 60, z: 40 }, { x: 40, y: 80, z: 55 }, { x: 85, y: 25, z: 65 },
    { x: 20, y: 45, z: 85 }, { x: 60, y: 10, z: 20 },
  ],
};

const SERIES_B: ScatterSeries3d = {
  name: 'Grupo B',
  points: [
    { x: 15, y: 70, z: 50 }, { x: 35, y: 15, z: 80 }, { x: 55, y: 55, z: 25 },
    { x: 75, y: 35, z: 60 }, { x: 25, y: 90, z: 35 }, { x: 65, y: 40, z: 90 },
    { x: 45, y: 65, z: 15 },
  ],
};

const SERIES_C: ScatterSeries3d = {
  name: 'Grupo C',
  points: [
    { x: 5,  y: 40, z: 60 }, { x: 45, y: 10, z: 45 }, { x: 80, y: 75, z: 30 },
    { x: 20, y: 55, z: 75 }, { x: 60, y: 85, z: 10 }, { x: 90, y: 20, z: 50 },
  ],
};

const SERIES_LABELED: ScatterSeries3d = {
  name: 'Ciudades',
  points: [
    { x: 22, y: 58, z: 60,  label: 'Madrid'    },
    { x: 41, y: 47, z: 30,  label: 'Barcelona' },
    { x: 12, y: 71, z: 50,  label: 'Bilbao'    },
    { x: 55, y: 36, z: 80,  label: 'Valencia'  },
    { x: 30, y: 62, z: 45,  label: 'Sevilla'   },
    { x: 70, y: 20, z: 70,  label: 'Zaragoza'  },
  ],
};

/* ── Meta ── */
const meta: Meta<ScatterChart3dArgs> = {
  title:     'Universal/Charts/Scatter Chart 3D',
  component: 'lib-scatter-chart-3d',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-scatter-chart-3d** · Organismo · \`app/data-viz\`

Gráfica de puntos con tres ejes (X, Y, Z) mediante proyección ortográfica rotable.
Arrastra el SVG para cambiar el ángulo de visión. Soporta múltiples series,
tooltip interactivo y rejilla en el plano Z = 0.

Katachi-aware: los ejes, rejilla y etiquetas consumen tokens semánticos.

\`\`\`html
<lib-scatter-chart-3d
  .series=\${misSeries}
  x-label="Temperatura"
  y-label="Presión"
  z-label="Densidad"
  show-grid
  show-legend
></lib-scatter-chart-3d>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    xLabel:     { control: 'text',    description: 'Etiqueta del eje X' },
    yLabel:     { control: 'text',    description: 'Etiqueta del eje Y' },
    zLabel:     { control: 'text',    description: 'Etiqueta del eje Z' },
    showGrid:   { control: 'boolean', name: 'show-grid'   },
    showLegend: { control: 'boolean', name: 'show-legend' },
    dotRadius:  { control: { type: 'number', min: 2, max: 16, step: 1 } },
    height:     { control: { type: 'number', min: 200, max: 700, step: 20 } },
  },

  args: {
    series:     [SERIES_A, SERIES_B],
    xLabel:     'Variable X',
    yLabel:     'Variable Y',
    zLabel:     'Variable Z',
    showGrid:   true,
    showLegend: true,
    dotRadius:  5,
    height:     420,
  },

  render: (args) => html`
    <div style="width: 600px; padding: var(--lib-space-lg);">
      <lib-scatter-chart-3d
        .series=${args.series}
        x-label=${args.xLabel}
        y-label=${args.yLabel}
        z-label=${args.zLabel}
        ?show-grid=${args.showGrid}
        ?show-legend=${args.showLegend}
        .dotRadius=${args.dotRadius}
        .height=${args.height}
      ></lib-scatter-chart-3d>
    </div>
  `,
};

export default meta;
type Story = StoryObj<ScatterChart3dArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. Arrastra para rotar. */
export const Playground: Story = {};

/** Una sola serie de datos. */
export const SingleSeries: Story = {
  name: 'Una serie',
  args: {
    series:     [SERIES_A],
    xLabel:     'Temperatura (°C)',
    yLabel:     'Presión (Pa)',
    zLabel:     'Densidad (g/cm³)',
    showLegend: false,
  },
};

/** Tres series simultáneas con leyenda. */
export const MultiSeries: Story = {
  name: 'Múltiples series',
  args: {
    series: [SERIES_A, SERIES_B, SERIES_C],
    xLabel: 'Eje X',
    yLabel: 'Eje Y',
    zLabel: 'Eje Z',
    height: 460,
  },
};

/** Puntos con etiqueta visible en el tooltip. */
export const WithLabels: Story = {
  name: 'Puntos con etiquetas',
  args: {
    series:     [SERIES_LABELED],
    xLabel:     'Longitud',
    yLabel:     'Latitud',
    zLabel:     'Altitud (m)',
    showLegend: false,
    dotRadius:  7,
  },
};

/** Estado vacío — sin series ni puntos. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: {
    series: [],
    xLabel: 'X',
    yLabel: 'Y',
    zLabel: 'Z',
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
   KATACHI — gráfica 3D en cada contexto estético
───────────────────────────────────────────────────────────── */
const _katachi = createKatachiStories<ScatterChart3dArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-lg);width:560px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <!-- 2 series · rejilla · leyenda -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">2 series · rejilla · leyenda · arrastrar para rotar</p>
      <lib-scatter-chart-3d
        .series=${[SERIES_A, SERIES_B]}
        x-label="Eje X"
        y-label="Eje Y"
        z-label="Eje Z"
        show-grid
        show-legend
        .height=${280}
      ></lib-scatter-chart-3d>
    </div>

    <!-- 3 series · sin rejilla -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">3 series · sin rejilla</p>
      <lib-scatter-chart-3d
        .series=${[SERIES_A, SERIES_B, SERIES_C]}
        x-label="X"
        y-label="Y"
        z-label="Z"
        show-legend
        .dotRadius=${4}
        .height=${200}
      ></lib-scatter-chart-3d>
    </div>

    <!-- Puntos etiquetados -->
    <div>
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">puntos etiquetados</p>
      <lib-scatter-chart-3d
        .series=${[SERIES_LABELED]}
        x-label="Longitud"
        y-label="Latitud"
        z-label="Altitud"
        show-grid
        .dotRadius=${7}
        .height=${180}
      ></lib-scatter-chart-3d>
    </div>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
