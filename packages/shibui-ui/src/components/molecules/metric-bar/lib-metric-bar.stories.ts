import type { Meta, StoryObj }   from '@storybook/web-components-vite';
import { html }                  from 'lit';
import './lib-metric-bar.component';
import { createKatachiStories }  from '../../../stories/katachi-stories.helper';

/* ── Args ── */
interface MetricBarArgs {
  label:     string;
  value:     number;
  max:       number;
  unit:      string;
  tone:      'default' | 'kaki' | 'celadon' | 'error';
  size:      'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showValue: boolean;
}

/* ── Meta ── */
const meta: Meta<MetricBarArgs> = {
  title:     'Desktop/Data/Metric Bar',
  component: 'lib-metric-bar',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-metric-bar** · Molécula · \`app/metric\`

Wrapper semántico sobre \`lib-progress\` que integra etiqueta, barra y valor
con formato de unidad. Diseñado para listas verticales de métricas en dashboards
(CPU, RAM, disco, red…).

Los tokens semánticos se propagan por herencia CSS hacia \`lib-progress\`,
por lo que el componente adapta su aspecto automáticamente con cada katachi.
        `,
      },
    },
  },

  argTypes: {
    label:     { control: 'text',   description: 'Nombre de la métrica' },
    value:     { control: { type: 'number', min: 0, max: 100, step: 1 } },
    max:       { control: { type: 'number', min: 1 } },
    unit:      { control: 'text',   description: 'Unidad ("%", "GB", "MB/s")' },
    tone: {
      control: 'select',
      options: ['default', 'kaki', 'celadon', 'error'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    showValue: { control: 'boolean', name: 'show-value' },
  },

  args: {
    label:     'CPU',
    value:     45,
    max:       100,
    unit:      '%',
    tone:      'default',
    size:      'sm',
    showValue: true,
  },

  render: (args) => html`
    <div style="width: 280px; padding: var(--lib-space-lg);">
      <lib-metric-bar
        label=${args.label}
        .value=${args.value}
        .max=${args.max}
        unit=${args.unit}
        tone=${args.tone}
        size=${args.size}
        ?show-value=${args.showValue}
      ></lib-metric-bar>
    </div>
  `,
};

export default meta;
type Story = StoryObj<MetricBarArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/** Panel realista de monitorización de sistema. */
export const SystemMonitor: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => html`
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md);
        width: 280px;
        padding: var(--lib-space-lg);
        background: var(--bg-elevated);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-lg);
      "
    >
      <lib-metric-bar label="CPU"    value="67"   max="100" unit="%"    size="sm" show-value></lib-metric-bar>
      <lib-metric-bar label="RAM"    value="12.4" max="32"  unit="GB"   size="sm" show-value tone="kaki"></lib-metric-bar>
      <lib-metric-bar label="Disco"  value="380"  max="512" unit="GB"   size="sm" show-value></lib-metric-bar>
      <lib-metric-bar label="Red ↑"  value="42"   max="100" unit="MB/s" size="sm" show-value tone="celadon"></lib-metric-bar>
      <lib-metric-bar label="Net ↓"  value="18"   max="100" unit="MB/s" size="sm" show-value tone="celadon"></lib-metric-bar>
    </div>
  `,
};

/** Todos los tonos disponibles. */
export const Tones: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => html`
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md);
        width: 280px;
        padding: var(--lib-space-lg);
      "
    >
      <lib-metric-bar label="default" value="60" unit="%" size="sm" show-value></lib-metric-bar>
      <lib-metric-bar label="kaki"    value="75" unit="%" size="sm" show-value tone="kaki"></lib-metric-bar>
      <lib-metric-bar label="celadon" value="45" unit="%" size="sm" show-value tone="celadon"></lib-metric-bar>
      <lib-metric-bar label="error"   value="92" unit="%" size="sm" show-value tone="error"></lib-metric-bar>
    </div>
  `,
};

/** Todas las alturas de barra. */
export const Sizes: Story = {
  parameters: { backgrounds: { default: 'dark' } },
  render: () => html`
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md);
        width: 280px;
        padding: var(--lib-space-lg);
      "
    >
      <lib-metric-bar label="xs" value="55" unit="%" size="xs" show-value></lib-metric-bar>
      <lib-metric-bar label="sm" value="55" unit="%" size="sm" show-value></lib-metric-bar>
      <lib-metric-bar label="md" value="55" unit="%" size="md" show-value></lib-metric-bar>
      <lib-metric-bar label="lg" value="55" unit="%" size="lg" show-value></lib-metric-bar>
      <lib-metric-bar label="xl" value="55" unit="%" size="xl" show-value></lib-metric-bar>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — panel de sistema en cada contexto estético
───────────────────────────────────────────────────────────── */
const _katachi = createKatachiStories<MetricBarArgs>(() => html`
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-md);
      width: 260px;
      padding: var(--lib-space-lg);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
    "
  >
    <lib-metric-bar label="CPU"   value="67"   max="100" unit="%"  size="sm" show-value></lib-metric-bar>
    <lib-metric-bar label="RAM"   value="12.4" max="32"  unit="GB" size="sm" show-value tone="kaki"></lib-metric-bar>
    <lib-metric-bar label="Disco" value="380"  max="512" unit="GB" size="sm" show-value></lib-metric-bar>
    <lib-metric-bar label="Red"   value="42"   max="100" unit="MB/s" size="sm" show-value tone="celadon"></lib-metric-bar>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
