import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-progress.component';
import type { ProgressSegment } from './lib-progress.types';

interface ProgressArgs {
  value:         number;
  max:           number;
  size:          'xs' | 'sm' | 'md' | 'lg' | 'xl';
  tone:          'default' | 'kaki' | 'celadon' | 'error';
  indeterminate: boolean;
  striped:       boolean;
  square:        boolean;
  label:         string;
  valueLabel:    string;
  sub:           string;
  showValue:     boolean;
  segments:      string;
}

const meta: Meta<ProgressArgs> = {
  title: 'Components/Atoms/Progress',
  tags:['autodocs'],
  component: 'lib-progress',
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    tone: {
      control: 'select',
      options: ['default', 'kaki', 'celadon', 'error'],
    },
    indeterminate: { control: 'boolean' },
    striped:       { control: 'boolean' },
    square:        { control: 'boolean' },
    showValue:     { control: 'boolean' },
    label:         { control: 'text' },
    valueLabel:    { control: 'text' },
    sub:           { control: 'text' },
    segments:      { control: 'text', description: 'JSON: ProgressSegment[]' },
  },
};

export default meta;
type Story = StoryObj<ProgressArgs>;

/* ─────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    value:         65,
    max:           100,
    size:          'md',
    tone:          'default',
    indeterminate: false,
    striped:       false,
    square:        false,
    label:         'Completado',
    valueLabel:    '',
    sub:           '',
    showValue:     true,
    segments:      '',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 32px; max-width: 480px; background: var(--bg-surface);">
      <lib-progress
        value="${args.value}"
        max="${args.max}"
        size="${args.size}"
        tone="${args.tone}"
        ?indeterminate="${args.indeterminate}"
        ?striped="${args.striped}"
        ?square="${args.square}"
        label="${args.label}"
        value-label="${args.valueLabel}"
        sub="${args.sub}"
        ?show-value="${args.showValue}"
        segments="${args.segments}"
      ></lib-progress>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   SIZES
───────────────────────────────────────────────────────── */
export const Sizes: Story = {
  name: 'Sizes — XS · SM · MD · LG · XL',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 32px; background: var(--bg-surface);">

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 28px; text-transform: uppercase;">XS</span>
        <lib-progress size="xs" value="65" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">2px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 28px; text-transform: uppercase;">SM</span>
        <lib-progress size="sm" value="65" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">4px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 28px; text-transform: uppercase;">MD</span>
        <lib-progress size="md" value="65" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">8px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 28px; text-transform: uppercase;">LG</span>
        <lib-progress size="lg" value="65" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">12px</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 28px; text-transform: uppercase;">XL</span>
        <lib-progress size="xl" value="65" show-value style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">20px</span>
      </div>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   TONES
───────────────────────────────────────────────────────── */
export const Tones: Story = {
  name: 'Tones — Default · Kaki · Celadón · Error',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 32px; background: var(--bg-surface);">

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 64px; text-transform: uppercase;">Default</span>
        <lib-progress value="72" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">72%</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 64px; text-transform: uppercase;">Kaki</span>
        <lib-progress tone="kaki" value="48" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">48%</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 64px; text-transform: uppercase;">Celadón</span>
        <lib-progress tone="celadon" value="88" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 32px; text-align: right;">88%</span>
      </div>

      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); width: 64px; text-transform: uppercase;">Error</span>
        <lib-progress tone="error" value="103" max="100" style="flex: 1;"></lib-progress>
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--color-error); width: 32px; text-align: right;">103%</span>
      </div>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   VARIANTS
───────────────────────────────────────────────────────── */
export const Variants: Story = {
  name: 'Variants — Striped · Indeterminate · Square',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 32px; padding: 32px; background: var(--bg-surface);">

      <div>
        <p style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Striped</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lib-progress value="58" striped></lib-progress>
          <lib-progress value="74" tone="kaki" striped></lib-progress>
          <lib-progress value="42" tone="celadon" striped></lib-progress>
        </div>
      </div>

      <div>
        <p style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Indeterminate</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lib-progress indeterminate></lib-progress>
          <lib-progress tone="kaki" size="sm" indeterminate></lib-progress>
          <lib-progress tone="celadon" size="xs" indeterminate></lib-progress>
        </div>
      </div>

      <div>
        <p style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 12px;">Square</p>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lib-progress value="67" square></lib-progress>
          <lib-progress value="45" tone="kaki" size="lg" square></lib-progress>
        </div>
      </div>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   CON META
───────────────────────────────────────────────────────── */
export const WithMeta: Story = {
  name: 'With label + value + sub',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 28px; padding: 32px; max-width: 480px; background: var(--bg-surface);">

      <lib-progress
        label="Completado"
        value="72"
        show-value
      ></lib-progress>

      <lib-progress
        tone="kaki"
        size="sm"
        label="Subida de fichero"
        value="48"
        value-label="3.4 MB / 7 MB"
        sub="Tiempo restante estimado · 12s"
      ></lib-progress>

      <lib-progress
        tone="celadon"
        size="sm"
        label="Procesando"
        value-label="Analizando…"
        indeterminate
      ></lib-progress>

      <lib-progress
        tone="error"
        label="Límite de almacenamiento"
        value="98"
        value-label="98 GB / 100 GB"
        sub="Quedan 2 GB — amplía tu plan"
      ></lib-progress>

    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   MULTI-SEGMENTO
───────────────────────────────────────────────────────── */
export const MultiSegment: Story = {
  name: 'Multi-segmento — distribución',
  render: (): TemplateResult => {

    const storageSegments: ProgressSegment[] = [
      { percent: 38, tone: 'default', label: 'Docs · 38 GB' },
      { percent: 22, tone: 'kaki',    label: 'Media · 22 GB' },
      { percent: 16, tone: 'celadon', label: 'Backups · 16 GB' },
      { percent: 24, tone: 'muted',   label: 'Libre · 24 GB' },
    ];

    const sprintSegments: ProgressSegment[] = [
      { percent: 52, tone: 'celadon', label: 'Done · 22' },
      { percent: 24, tone: 'kaki',    label: 'In progress · 10' },
      { percent: 14, tone: 'error',   label: 'Blocked · 6' },
      { percent: 10, tone: 'muted',   label: 'Backlog · 4' },
    ];

    return html`
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 32px; max-width: 560px; background: var(--bg-surface);">

        <lib-progress
          label="Uso de almacenamiento"
          value-label="76 GB / 100 GB"
          size="lg"
          segments="${JSON.stringify(storageSegments)}"
        ></lib-progress>

        <lib-progress
          label="Distribución de tareas del sprint"
          value-label="42 issues"
          segments="${JSON.stringify(sprintSegments)}"
        ></lib-progress>

      </div>
    `;
  },
};