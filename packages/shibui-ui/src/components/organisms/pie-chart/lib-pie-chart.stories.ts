import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-pie-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { PieSlice }        from './lib-pie-chart.types';

/* ── Args ── */
interface PieChartArgs {
  slices:      PieSlice[];
  innerRatio:  number;
  showLegend:  boolean;
  showLabels:  boolean;
  centerLabel: string;
  height:      number;
}

/* ── Datos de ejemplo ── */
const BROWSERS: PieSlice[] = [
  { label: 'Chrome',  value: 64 },
  { label: 'Safari',  value: 19 },
  { label: 'Edge',    value: 9  },
  { label: 'Firefox', value: 5  },
  { label: 'Otros',   value: 3  },
];

const OS: PieSlice[] = [
  { label: 'Windows', value: 72 },
  { label: 'macOS',   value: 16 },
  { label: 'Linux',   value: 12 },
];

const SINGLE: PieSlice[] = [{ label: 'Completado', value: 100 }];

/* ── Meta ── */
const meta: Meta<PieChartArgs> = {
  title:     'Universal/Charts/Pie Chart',
  component: 'lib-pie-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-pie-chart** · Organismo · \`app/data-viz\`

Gráfica circular SVG nativa para proporciones (parte del todo). Con
\`inner-ratio > 0\` se convierte en **donut**, cuyo hueco admite un
\`center-label\` o contenido vía slot \`center\` (ideal para un KPI).
Tooltip por porción, leyenda y etiquetas de porcentaje opcionales.

\`\`\`html
<lib-pie-chart .slices=\${slices} inner-ratio="0.6" center-label="92%"></lib-pie-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    innerRatio:  { control: { type: 'range', min: 0, max: 0.9, step: 0.05 }, name: 'inner-ratio' },
    showLegend:  { control: 'boolean', name: 'show-legend' },
    showLabels:  { control: 'boolean', name: 'show-labels' },
    centerLabel: { control: 'text',    name: 'center-label' },
    height:      { control: { type: 'number', min: 200, max: 600, step: 20 } },
  },

  args: {
    slices:      BROWSERS,
    innerRatio:  0,
    showLegend:  true,
    showLabels:  false,
    centerLabel: '',
    height:      320,
  },

  render: (args) => html`
    <div style="width: 420px; padding: var(--lib-space-lg);">
      <lib-pie-chart
        .slices=${args.slices}
        .innerRatio=${args.innerRatio}
        ?show-legend=${args.showLegend}
        ?show-labels=${args.showLabels}
        center-label=${args.centerLabel}
        .height=${args.height}
      ></lib-pie-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<PieChartArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Tarta con etiquetas de porcentaje. */
export const WithLabels: Story = {
  name: 'Con porcentajes',
  args: { showLabels: true },
};

/** Donut — hueco central vacío. */
export const Donut: Story = {
  name: 'Donut',
  args: { innerRatio: 0.6, slices: OS },
};

/** Donut con KPI en el centro. */
export const DonutWithKpi: Story = {
  name: 'Donut · KPI central',
  args: { innerRatio: 0.62, centerLabel: '92%', slices: OS },
};

/** Una sola porción al 100% (caso círculo completo). */
export const SingleSlice: Story = {
  name: 'Porción única (100%)',
  args: { slices: SINGLE, innerRatio: 0.5, centerLabel: '100%', showLegend: false },
};

/** Estado vacío — sin porciones. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { slices: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<PieChartArgs>(() => html`
  <div style="display:flex;gap:var(--lib-space-lg);flex-wrap:wrap;width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <div style="flex:1;min-width:220px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">tarta · % labels</p>
      <lib-pie-chart
        .slices=${BROWSERS}
        show-legend
        show-labels
        .height=${220}
      ></lib-pie-chart>
    </div>

    <div style="flex:1;min-width:220px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">donut · KPI</p>
      <lib-pie-chart
        .slices=${OS}
        .innerRatio=${0.62}
        center-label="72%"
        show-legend
        .height=${220}
      ></lib-pie-chart>
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

/** Verifica que se renderiza una porción por dato. */
export const TestSliceCount: Story = {
  name: 'Test · una porción por dato',
  tags: ['test'],
  args: { slices: OS },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-pie-chart');
    await chart?.updateComplete;
    const wedges = chart?.shadowRoot?.querySelectorAll('.slice');
    expect(wedges?.length).toBe(3);
  },
};

/** Verifica que el donut muestra el center-label. */
export const TestDonutCenter: Story = {
  name: 'Test · donut muestra center-label',
  tags: ['test'],
  args: { slices: OS, innerRatio: 0.6, centerLabel: '72%' },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-pie-chart');
    await chart?.updateComplete;
    const center = chart?.shadowRoot?.querySelector('.pie-center');
    expect(center?.textContent).toContain('72%');
  },
};
