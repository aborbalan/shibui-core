import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-range-slider.component';
import type { LibRangeSlider } from './lib-range-slider.component';

type RsArgs = Pick<LibRangeSlider,
  'min' | 'max' | 'step' | 'value' | 'valueMin' | 'valueMax' |
  'size' | 'tone' | 'dual' | 'vertical' | 'disabled' |
  'label' | 'unit' | 'showLimits' | 'tooltip'
>;

const meta: Meta<RsArgs> = {
  title: 'Components/Molecules/RangeSlider',
  component: 'lib-range-slider',
  argTypes: {
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    tone:     { control: 'select', options: ['default', 'kaki', 'celadon', 'error', 'washi', 'dark'] },
    dual:     { control: 'boolean' },
    vertical: { control: 'boolean' },
    disabled: { control: 'boolean' },
    tooltip:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<RsArgs>;

/* shared wrappers */
const wrap     = 'padding: 40px; max-width: 560px; display: flex; flex-direction: column; gap: 40px;';
const wrapDark = 'padding: 40px; max-width: 560px; display: flex; flex-direction: column; gap: 40px; background: var(--color-washi-950);';

/* ── Playground ────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    label: 'Volumen', value: 48, min: 0, max: 100, step: 1,
    unit: '%', size: 'md', tone: 'default', showLimits: true,
    disabled: false, dual: false, vertical: false, tooltip: false,
  },
  render: (args): TemplateResult => html`
    <div style=${wrap}>
      <lib-range-slider
        label=${args.label}
        .value=${args.value}
        min=${args.min}
        max=${args.max}
        step=${args.step}
        unit=${args.unit}
        size=${args.size}
        tone=${args.tone}
        ?show-limits=${args.showLimits}
        ?disabled=${args.disabled}
        ?dual=${args.dual}
        ?vertical=${args.vertical}
        ?tooltip=${args.tooltip}
        @ui-lib-change=${(e: CustomEvent): void => console.log('change', e.detail)}
      ></lib-range-slider>
    </div>
  `,
};

/* ── Sizes ─────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style=${wrap}>

      <lib-range-slider
        label="Opacidad" value="72" unit="%" size="sm" show-limits
      ></lib-range-slider>

      <lib-range-slider
        label="Volumen" value="48" unit="%" size="md" show-limits
      ></lib-range-slider>

      <lib-range-slider
        label="Zoom" value="130" min="50" max="200" unit="%" size="lg" show-limits
      ></lib-range-slider>

    </div>
  `,
};

/* ── Tones ─────────────────────────────────────────────── */
export const Tones: Story = {
  name: 'Tones — Default · Kaki · Celadón · Error · Washi · Disabled',
  render: (): TemplateResult => html`
    <div style=${wrap}>

      <lib-range-slider label="Contraste"  value="65" unit="%" tone="washi"></lib-range-slider>

      <lib-range-slider
        label="Temperatura" value="3800" min="2200" max="6500" unit="K"
        tone="kaki" show-limits limit-min="2200K" limit-max="6500K"
      ></lib-range-slider>

      <lib-range-slider label="Energía renovable" value="82" unit="%" tone="celadon"></lib-range-slider>

      <lib-range-slider
        label="Nivel de riesgo" value="34" unit="/100" tone="error"
        show-limits limit-min="Bajo" limit-max="Alto"
      ></lib-range-slider>

      <lib-range-slider
        label="Saturación (bloqueado)" value="50" unit="%" disabled
      ></lib-range-slider>

    </div>
  `,
};

/* ── Tooltip ────────────────────────────────────────────── */
export const WithTooltip: Story = {
  name: 'Con tooltip flotante',
  render: (): TemplateResult => html`
    <div style=${wrap}>
      <lib-range-slider
        label="Tamaño de fuente"
        value="16" min="8" max="72" unit="px"
        tooltip show-limits limit-min="8px" limit-max="72px"
      ></lib-range-slider>
    </div>
  `,
};

/* ── Dual range ─────────────────────────────────────────── */
export const DualRange: Story = {
  name: 'Dual range — min / max',
  render: (): TemplateResult => html`
    <div style=${wrap}>

      <lib-range-slider
        dual label="Precio"
        value-min="120" value-max="480"
        min="0" max="500"
        unit="€" tone="kaki"
        show-limits limit-min="0 €" limit-max="500 €"
      ></lib-range-slider>

      <lib-range-slider
        dual label="Rango de edad"
        value-min="25" value-max="45"
        min="0" max="100"
        unit=" años" tone="celadon"
        show-limits
      ></lib-range-slider>

    </div>
  `,
};

/* ── With marks / steps ─────────────────────────────────── */
export const WithSteps: Story = {
  name: 'Steps y marcas',
  render: (): TemplateResult => {
    const sizeMks = JSON.stringify([
      { pct: 0,   label: 'XS' },
      { pct: 25,  label: 'S'  },
      { pct: 50,  label: 'M'  },
      { pct: 75,  label: 'L'  },
      { pct: 100, label: 'XL' },
    ]);

    const yearMks = JSON.stringify([
      { pct: 0,           label: '2015' },
      { pct: 45.45,       label: '2020' },
      { pct: 100,         label: '2026' },
    ]);

    const ratingMks = JSON.stringify([
      { pct: 0,   label: '0'  },
      { pct: 20,  label: '2'  },
      { pct: 40,  label: '4'  },
      { pct: 60,  label: '6'  },
      { pct: 80,  label: '8'  },
      { pct: 100, label: '10' },
    ]);

    return html`
      <div style=${wrap}>

        <lib-range-slider
          label="Talla" value="2" min="0" max="4" step="1"
          size="lg" tone="kaki" marks=${sizeMks}
        ></lib-range-slider>

        <lib-range-slider
          label="Valoración" value="7" min="0" max="10" step="1"
          tone="celadon" marks=${ratingMks}
          show-limits limit-min="0" limit-max="10"
        ></lib-range-slider>

        <lib-range-slider
          label="Año" value="2020" min="2015" max="2026" step="1"
          marks=${yearMks}
        ></lib-range-slider>

      </div>
    `;
  },
};

/* ── Vertical ───────────────────────────────────────────── */
export const Vertical: Story = {
  name: 'Vertical — mezclador de canales',
  render: (): TemplateResult => html`
    <div style="padding: 40px; display: flex; align-items: flex-end; gap: 32px; min-height: 280px;">

      <lib-range-slider vertical tone="kaki"    label="Bajo"       value="80"></lib-range-slider>
      <lib-range-slider vertical                label="Medio"      value="55"></lib-range-slider>
      <lib-range-slider vertical tone="celadon" label="Alto"       value="35"></lib-range-slider>
      <lib-range-slider vertical size="sm"      label="Presencia"  value="92"></lib-range-slider>
      <lib-range-slider vertical tone="error"   label="Distorsión" value="20"></lib-range-slider>
      <lib-range-slider vertical disabled        label="Reverb"    value="50"></lib-range-slider>

    </div>
  `,
};

/* ── Dark surface ───────────────────────────────────────── */
export const DarkSurface: Story = {
  name: 'Dark — superficie oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style=${wrapDark}>

      <lib-range-slider tone="dark" label="Volumen master" value="78" unit="%"></lib-range-slider>

      <lib-range-slider
        tone="dark" label="Temperatura" value="4200"
        min="2200" max="6500" unit="K"
        show-limits limit-min="2200K" limit-max="6500K"
      ></lib-range-slider>

      <lib-range-slider tone="dark" label="Saturación" value="110" min="0" max="200" unit="%"></lib-range-slider>

      <lib-range-slider
        dual tone="dark" label="Rango de frecuencia"
        value-min="200" value-max="8000"
        min="20" max="20000" unit=" Hz"
        show-limits limit-min="20 Hz" limit-max="20k Hz"
      ></lib-range-slider>

    </div>
  `,
};