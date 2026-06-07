import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-funnel-chart.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { FunnelStage }     from './lib-funnel-chart.types';

/* ── Args ── */
interface FunnelArgs {
  stages:     FunnelStage[];
  showValues: boolean;
  height:     number;
}

/* ── Datos de ejemplo ── */
const ACQUISITION: FunnelStage[] = [
  { label: 'Visitas',     value: 12000 },
  { label: 'Registros',   value: 4200 },
  { label: 'Activación',  value: 2100 },
  { label: 'Compra',      value: 980 },
  { label: 'Recurrencia', value: 410 },
];

const HIRING: FunnelStage[] = [
  { label: 'Candidaturas', value: 540 },
  { label: 'Cribado',      value: 180 },
  { label: 'Entrevista',   value: 64 },
  { label: 'Oferta',       value: 12 },
  { label: 'Contratado',   value: 5 },
];

/* ── Meta ── */
const meta: Meta<FunnelArgs> = {
  title:     'Universal/Charts/Funnel',
  component: 'lib-funnel-chart',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-funnel-chart** · Organismo · \`app/data-viz\`

Embudo de conversión: etapas como trapecios centrados cuya anchura es
proporcional al valor; al estrecharse muestra la caída entre etapas. El % se
calcula sobre la primera etapa. Tooltip por etapa. Katachi-aware.

\`\`\`html
<lib-funnel-chart
  .stages=\${[{ label: 'Visitas', value: 12000 }, { label: 'Compra', value: 980 }]}
></lib-funnel-chart>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    showValues: { control: 'boolean', name: 'show-values' },
    height:     { control: { type: 'number', min: 200, max: 560, step: 20 } },
  },

  args: {
    stages:     ACQUISITION,
    showValues: true,
    height:     340,
  },

  render: (args) => html`
    <div style="width: 420px; padding: var(--lib-space-lg);">
      <lib-funnel-chart
        .stages=${args.stages}
        ?show-values=${args.showValues}
        .height=${args.height}
      ></lib-funnel-chart>
    </div>
  `,
};

export default meta;
type Story = StoryObj<FunnelArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Embudo de contratación (caída fuerte). */
export const Hiring: Story = {
  name: 'Contratación',
  args: { stages: HIRING },
};

/** Sin valores — solo etiquetas. */
export const LabelsOnly: Story = {
  name: 'Solo etiquetas',
  args: { showValues: false },
};

/** Colores por etapa personalizados. */
export const CustomColors: Story = {
  name: 'Colores personalizados',
  args: {
    stages: [
      { label: 'Lead',        value: 1000, color: 'var(--text-info)' },
      { label: 'Cualificado', value: 620,  color: 'var(--text-accent)' },
      { label: 'Propuesta',   value: 280,  color: 'var(--text-warning)' },
      { label: 'Cierre',      value: 90,   color: 'var(--text-success)' },
    ],
  },
};

/** Estado vacío. */
export const EmptyState: Story = {
  name: 'Sin datos',
  args: { stages: [] },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<FunnelArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);width:360px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">
    <lib-funnel-chart .stages=${ACQUISITION} show-values .height=${300}></lib-funnel-chart>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── 4 · TESTS ── */

/** Verifica que dibuja una banda por etapa. */
export const TestStageCount: Story = {
  name: 'Test · una banda por etapa',
  tags: ['test'],
  args: { stages: HIRING },
  play: async ({ canvasElement }): Promise<void> => {
    const chart = canvasElement.querySelector('lib-funnel-chart');
    await chart?.updateComplete;
    const bands = chart?.shadowRoot?.querySelectorAll('.funnel-band');
    expect(bands?.length).toBe(5);
  },
};
