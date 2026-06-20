import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import { html }                 from 'lit';
import { expect }               from 'storybook/test';
import './lib-gauge.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { GaugeTone, GaugeZone } from './lib-gauge.types';

/* ── Args ── */
interface GaugeArgs {
  value:     number;
  min:       number;
  max:       number;
  tone:      GaugeTone;
  zones:     GaugeZone[];
  showValue: boolean;
  unit:      string;
  label:     string;
  height:    number;
}

/* ── Datos de ejemplo ── */
const SLA_ZONES: GaugeZone[] = [
  { from: 0,  to: 60,  tone: 'success' },
  { from: 60, to: 85,  tone: 'warning' },
  { from: 85, to: 100, tone: 'error'   },
];

/* ── Meta ── */
const meta: Meta<GaugeArgs> = {
  title:     'Universal/Charts/Gauge',
  component: 'lib-gauge',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-gauge** · Organismo · \`app/data-viz\`

Indicador radial en semicírculo 180° para un KPI. En modo simple pinta el
arco de valor en un \`tone\`; si pasas \`zones\`, dibuja bandas de color por
umbrales y una aguja que apunta al valor (su color refleja la zona activa).
Katachi-aware: los tonos consumen tokens semánticos.

\`\`\`html
<lib-gauge .value=\${72} unit="%" tone="success" label="Uptime"></lib-gauge>
<lib-gauge .value=\${88} unit="%" .zones=\${slaZones}></lib-gauge>
\`\`\`
        `,
      },
    },
  },

  argTypes: {
    tone: { control: 'select', options: ['default', 'accent', 'info', 'success', 'warning', 'error'] },
    showValue: { control: 'boolean', name: 'show-value' },
    unit:   { control: 'text' },
    label:  { control: 'text' },
    value:  { control: { type: 'range', min: 0, max: 100, step: 1 } },
    height: { control: { type: 'number', min: 120, max: 360, step: 20 } },
  },

  args: {
    value:     72,
    min:       0,
    max:       100,
    tone:      'info',
    zones:     [],
    showValue: true,
    unit:      '%',
    label:     '',
    height:    180,
  },

  render: (args) => html`
    <div style="width: 280px; padding: var(--lib-space-lg);">
      <lib-gauge
        .value=${args.value}
        .min=${args.min}
        .max=${args.max}
        tone=${args.tone}
        .zones=${args.zones}
        ?show-value=${args.showValue}
        unit=${args.unit}
        label=${args.label}
        .height=${args.height}
      ></lib-gauge>
    </div>
  `,
};

export default meta;
type Story = StoryObj<GaugeArgs>;

/* ── 1 · PLAYGROUND ── */
export const Playground: Story = {};

/* ── 2 · API ── */

/** Arco de un solo tono. */
export const SingleTone: Story = {
  name: 'Tono único',
  args: { value: 64, tone: 'success', label: 'Uptime' },
};

/** Zonas por umbrales con aguja (SLA). */
export const Zones: Story = {
  name: 'Zonas por umbrales',
  args: { value: 88, zones: SLA_ZONES, label: 'Carga CPU' },
};

/** Todos los tonos. */
export const Tones: Story = {
  name: 'Tonos',
  render: () => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-lg);padding:var(--lib-space-lg);">
      ${(['default', 'accent', 'info', 'success', 'warning', 'error'] as const).map(tone => html`
        <div style="width:200px;">
          <lib-gauge .value=${68} tone=${tone} unit="%" label=${tone} .height=${150}></lib-gauge>
        </div>
      `)}
    </div>
  `,
};

/** Rango y unidad personalizados (no 0–100). */
export const CustomRange: Story = {
  name: 'Rango personalizado',
  args: { value: 3200, min: 0, max: 5000, unit: ' rpm', tone: 'accent', label: 'Motor' },
};

/** Sin número central. */
export const NoValue: Story = {
  name: 'Sin valor',
  args: { value: 45, showValue: false, zones: SLA_ZONES },
};

/* ── 3 · KATACHI ── */
const _katachi = createKatachiStories<GaugeArgs>(() => html`
  <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-lg);width:520px;padding:var(--lib-space-lg);background:var(--bg-surface);border:1px solid var(--border-subtle);">

    <div style="width:230px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">tono único</p>
      <lib-gauge .value=${72} tone="success" unit="%" label="Uptime" .height=${160}></lib-gauge>
    </div>

    <div style="width:230px;">
      <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-xs);">zonas + aguja</p>
      <lib-gauge .value=${88} unit="%" .zones=${SLA_ZONES} label="CPU" .height=${160}></lib-gauge>
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

/** Verifica que el modo simple dibuja el arco de valor. */
export const TestValueArc: Story = {
  name: 'Test · modo simple dibuja arco de valor',
  tags: ['test'],
  args: { value: 50, zones: [] },
  play: async ({ canvasElement }): Promise<void> => {
    const gauge = canvasElement.querySelector('lib-gauge');
    await gauge?.updateComplete;
    const arc = gauge?.shadowRoot?.querySelector('.gauge-value');
    expect(arc).toBeTruthy();
  },
};

/** Verifica que el modo zonas dibuja bandas y aguja. */
export const TestZones: Story = {
  name: 'Test · modo zonas dibuja bandas y aguja',
  tags: ['test'],
  args: { value: 88, zones: SLA_ZONES },
  play: async ({ canvasElement }): Promise<void> => {
    const gauge = canvasElement.querySelector('lib-gauge');
    await gauge?.updateComplete;
    const bands  = gauge?.shadowRoot?.querySelectorAll('.gauge-band');
    const needle = gauge?.shadowRoot?.querySelector('.gauge-needle');
    expect(bands?.length).toBe(3);
    expect(needle).toBeTruthy();
  },
};
