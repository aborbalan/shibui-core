import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj }  from '@storybook/web-components-vite';
import './lib-color-scale.component';
import type { ColorStep } from './lib-color-scale.types';

/* ── Paletas del sistema ── */
const WASHI: ColorStep[] = [
  { step: 50,  hex: '#FAF7F4', oklch: 'oklch(97.77% 0.003 68.35deg)' },
  { step: 100, hex: '#F2EDE6', oklch: 'oklch(94.29% 0.007 72.91deg)' },
  { step: 200, hex: '#E5DDD3', oklch: 'oklch(88.59% 0.008 72.93deg)' },
  { step: 300, hex: '#D3C8BC', oklch: 'oklch(81.39% 0.01  74.43deg)' },
  { step: 400, hex: '#B8A99A', oklch: 'oklch(71.05% 0.013 74.74deg)' },
  { step: 500, hex: '#9A8878', oklch: 'oklch(59.45% 0.015 75.31deg)' },
  { step: 600, hex: '#7A6A5C', oklch: 'oklch(48.51% 0.014 76.22deg)' },
  { step: 700, hex: '#5C4E42', oklch: 'oklch(37.66% 0.013 77.58deg)' },
  { step: 800, hex: '#3D332A', oklch: 'oklch(26.83% 0.012 79.82deg)' },
  { step: 900, hex: '#221C16', oklch: 'oklch(17.39% 0.01  83.02deg)' },
  { step: 950, hex: '#120E0A', oklch: 'oklch(11.39% 0.009 84.7deg)'  },
];

const KAKI: ColorStep[] = [
  { step: 50,  hex: '#FDF3EC', oklch: 'oklch(96.88% 0.012 55.48deg)' },
  { step: 100, hex: '#FAE2CC', oklch: 'oklch(91.31% 0.038 65.52deg)' },
  { step: 200, hex: '#F4C099', oklch: 'oklch(81.87% 0.076 60.59deg)' },
  { step: 300, hex: '#EB9660', oklch: 'oklch(70.92% 0.125 52.88deg)' },
  { step: 400, hex: '#D97234', oklch: 'oklch(61.85% 0.149 48.72deg)' },
  { step: 500, hex: '#B85A1E', oklch: 'oklch(51.65% 0.134 46.13deg)' },
  { step: 600, hex: '#8C4115', oklch: 'oklch(40.5%  0.108 44.59deg)' },
  { step: 700, hex: '#602C0E', oklch: 'oklch(29.17% 0.08  44.25deg)' },
];

const CELADON: ColorStep[] = [
  { step: 50,  hex: '#EFF5F3', oklch: 'oklch(96.39% 0.007 172.9deg)'  },
  { step: 100, hex: '#D3E8E1', oklch: 'oklch(90.69% 0.021 169.15deg)' },
  { step: 200, hex: '#A8D0C4', oklch: 'oklch(81.25% 0.039 171.18deg)' },
  { step: 300, hex: '#79B5A3', oklch: 'oklch(70.21% 0.057 167.31deg)' },
  { step: 400, hex: '#4E9482', oklch: 'oklch(58.33% 0.068 171.21deg)' },
  { step: 500, hex: '#357164', oklch: 'oklch(45.54% 0.059 173.23deg)' },
  { step: 600, hex: '#245249', oklch: 'oklch(33.72% 0.046 173.86deg)' },
];

const meta: Meta = {
  title: 'Data Display/ColorScale',
  tags:['autodocs'],
  component: 'lib-color-scale',
  parameters: { layout: 'padded' },
  argTypes: {
    name:        { control: 'text' },
    showLabels:  { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj;

/* ── Playground ── */
export const Playground: Story = {
  args: { name: 'washi', showLabels: true },
  render: (args): TemplateResult => html`
    <div style="max-width:640px;padding:var(--lib-space-xl);">
      <lib-color-scale
        name="${args.name}"
        ?show-labels="${args.showLabels}"
        .steps="${WASHI}"
      ></lib-color-scale>
    </div>
  `,
};

/* ── Las 3 paletas del sistema ── */
export const SystemPalettes: Story = {
  name: 'System Palettes · Washi · Kaki · Celadón',
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: var(--lib-space-2xl, 2.5rem);
      padding: var(--lib-space-xl);
      max-width: 720px;
    ">
      <lib-color-scale name="washi"   .steps="${WASHI}"   show-labels></lib-color-scale>
      <lib-color-scale name="kaki"    .steps="${KAKI}"    show-labels></lib-color-scale>
      <lib-color-scale name="celadón" .steps="${CELADON}" show-labels></lib-color-scale>
    </div>
  `,
};

/* ── Sin labels ── */
export const NoLabels: Story = {
  name: 'Sin etiquetas extremos',
  render: (): TemplateResult => html`
    <div style="max-width:640px;padding:var(--lib-space-xl);">
      <lib-color-scale name="washi" .steps="${WASHI}"></lib-color-scale>
    </div>
  `,
};

/* ── Altura personalizada ── */
export const CustomHeight: Story = {
  name: 'Altura custom via CSS prop',
  render: (): TemplateResult => html`
    <div style="max-width:640px;padding:var(--lib-space-xl);">
      <lib-color-scale
        name="washi"
        .steps="${WASHI}"
        show-labels
        style="--lib-color-scale-height:96px;"
      ></lib-color-scale>
    </div>
  `,
};