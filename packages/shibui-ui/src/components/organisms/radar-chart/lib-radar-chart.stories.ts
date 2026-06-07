import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-radar-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { ChartSeries }     from '../../../../models/ui/charts';

/* ── Args ── */
interface RadarArgs {
  axes:        string[];
  series:      ChartSeries[];
  max:         number;
  levels:      number;
  showLegend:  boolean;
  showDots:    boolean;
  fillOpacity: number;
  height:      number;
}

/* ── Datos de ejemplo ── */
const SKILLS = ['Velocidad', 'Potencia', 'Alcance', 'Defensa', 'Magia', 'Sigilo'];

const HERO:    ChartSeries = { name: 'Héroe',    values: [8, 6, 7, 5, 9, 4] };
const RIVAL:   ChartSeries = { name: 'Rival',    values: [5, 9, 4, 8, 3, 6] };

const PROFILE_AXES = ['Frontend', 'Backend', 'DevOps', 'Diseño', 'Testing'];
const CANDIDATE: ChartSeries = { name: 'Candidato', values: [9, 7, 5, 8, 6] };
const ROLE:      ChartSeries = { name: 'Puesto',    values: [8, 8, 7, 4, 7] };

/* ── Meta ── */
const meta: Meta<RadarArgs> = {
  title:     'Universal/Charts/Radar',
  component: 'lib-radar-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-radar-chart** · Organismo · \`app/data-viz\`

Gráfica radar / spider para comparar series sobre ejes radiales compartidos
(skills, perfiles, scores). Rejilla de anillos concéntricos, polígonos con
relleno, vértices con tooltip y leyenda. Katachi-aware.

\`\`\`html
<lib-radar-chart
  .axes=\${['Velocidad','Potencia','Alcance','Defensa','Magia']}
  .series=\${[{ name: 'Héroe', values: [8,6,7,5,9] }]}
></lib-radar-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    max:         { control: { type: 'number', min: 0, max: 100, step: 1 } },
    levels:      { control: { type: 'number', min: 2, max: 8, step: 1 } },
    showLegend:  { control: 'boolean', name: 'show-legend' },
    showDots:    { control: 'boolean', name: 'show-dots' },
    fillOpacity: { control: { type: 'range', min: 0, max: 0.6, step: 0.05 }, name: 'fill-opacity' },
    height:      { control: { type: 'number', min: 220, max: 560, step: 20 } },
  },

  args: {
    axes:        SKILLS,
    series:      [HERO, RIVAL],
    max:         10,
    levels:      4,
    showLegend:  true,
    showDots:    true,
    fillOpacity: 0.15,
    height:      340,
  },

  render: (args) => html`
    <div style="width: 420px; padding: var(--lib-space-lg);">
      <lib-radar-chart
        .axes=${args.axes}
        .series=${args.series}
        .max=${args.max}
        .levels=${args.levels}
        ?show-legend=${args.showLegend}
        ?show-dots=${args.showDots}
        .fillOpacity=${args.fillOpacity}
        .height=${args.height}
      ></lib-radar-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<RadarArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Una sola serie. */
export const SingleSeries: Story = {
  name: 'Una serie',
  args: { series: [HERO], showLegend: false },
};

/** Comparativa candidato vs perfil del puesto (encaja con app-cv). */
export const ProfileMatch: Story = {
  name: 'Candidato vs puesto',
  args: { axes: PROFILE_AXES, series: [CANDIDATE, ROLE], max: 10 },
};

/** Auto-escala (max = 0). */
export const AutoScale: Story = {
  name: 'Escala automática',
  args: { series: [HERO, RIVAL], max: 0 },
};

/** Sin relleno — solo contorno. */
export const Outline: Story = {
  name: 'Solo contorno',
  args: { fillOpacity: 0 },
};

/** Estado vacío — menos de 3 ejes. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { axes: [], series: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<RadarArgs>(() => html`
  <div style="display:flex;gap:var(--lib-space-lg);flex-wrap:wrap;width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <div style="width:230px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">2 series · skills</p>
      <lib-radar-chart .axes=${SKILLS} .series=${[HERO, RIVAL]} .max=${10} show-legend show-dots .height=${230}></lib-radar-chart>
    </div>

    <div style="width:230px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">1 serie · contorno</p>
      <lib-radar-chart .axes=${PROFILE_AXES} .series=${[CANDIDATE]} .max=${10} .fillOpacity=${0} .height=${230}></lib-radar-chart>
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

/** Verifica que se dibuja un polígono por serie. */
export const TestPolygonCount: Story = {
  name: 'Test · un polígono por serie',
  tags: ['test'],
  args: { axes: SKILLS, series: [HERO, RIVAL] },
  play: async ({ canvasElement }): Promise<void> => {
    const radar = canvasElement.querySelector('lib-radar-chart');
    await radar?.updateComplete;
    const areas = radar?.shadowRoot?.querySelectorAll('.radar-area');
    expect(areas?.length).toBe(2);
  },
};

/** Verifica que se dibujan los anillos de rejilla. */
export const TestRings: Story = {
  name: 'Test · dibuja los anillos de rejilla',
  tags: ['test'],
  args: { axes: SKILLS, series: [HERO], levels: 4 },
  play: async ({ canvasElement }): Promise<void> => {
    const radar = canvasElement.querySelector('lib-radar-chart');
    await radar?.updateComplete;
    const rings = radar?.shadowRoot?.querySelectorAll('.radar-ring');
    expect(rings?.length).toBe(4);
  },
};
