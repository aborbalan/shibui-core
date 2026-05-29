import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing, TemplateResult } from 'lit';
import './lib-progress-circle.component';
import type { LibProgressCircle } from './lib-progress-circle.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type LibProgressCircleStoryArgs = Pick<
  LibProgressCircle,
  'value' | 'max' | 'size' | 'strokeWidth' | 'variant' | 'indeterminate' | 'bare' | 'sub' | 'icon'
>;

const preview = (bg: string, content: TemplateResult): TemplateResult => html`
  <div style="background:${bg}; padding:40px; border:1px solid var(--border-subtle); display:flex; flex-wrap:wrap; align-items:center; gap:48px;">
    ${content}
  </div>
`;

const withLabel = (label: string, content: TemplateResult): TemplateResult => html`
  <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
    ${content}
    <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${label}</span>
  </div>
`;

const meta: Meta<LibProgressCircleStoryArgs> = {
  title: 'Universal/Feedback/Progress Circle',
  tags:['autodocs'],
  component: 'lib-progress-circle',

  argTypes: {
    value:         { control: { type: 'range', min: 0, max: 100 } },
    max:           { control: 'number' },
    size:          { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant:       { control: 'select', options: ['default', 'accent', 'info', 'error'] },
    strokeWidth:   { control: 'number' },
    indeterminate: { control: 'boolean' },
    bare:          { control: 'boolean' },
    sub:           { control: 'text' },
    icon:          { control: 'select', options: [null, 'check'] },
  },

  render: (args): TemplateResult => preview('var(--bg-surface)', html`
    <lib-progress-circle
      value=${args.value}
      max=${args.max}
      size=${args.size}
      variant=${args.variant}
      ?indeterminate=${args.indeterminate}
      ?bare=${args.bare}
      sub=${args.sub}
      icon=${args.icon ?? nothing}
      stroke-width=${args.strokeWidth ?? nothing}
    ></lib-progress-circle>
  `),
};

export default meta;
type Story = StoryObj<LibProgressCircleStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: { value: 68, max: 100, size: 'md', variant: 'default', indeterminate: false, bare: false, sub: '', icon: null },
};

/* ── Cinco tamaños ── */
export const Sizes: Story = {
  name: 'Sizes — XS · SM · MD · LG · XL',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    ${([
      { size: 'xs', label: 'XS · 40px' },
      { size: 'sm', label: 'SM · 64px' },
      { size: 'md', label: 'MD · 96px' },
      { size: 'lg', label: 'LG · 128px' },
      { size: 'xl', label: 'XL · 176px' },
    ] as const).map(({ size, label }) => withLabel(label, html`
      <lib-progress-circle value="68" size=${size}></lib-progress-circle>
    `))}
  `),
};

/* ── Variantes de color ── */
export const Variants: Story = {
  name: 'Colour Variants',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    ${withLabel('Default', html`<lib-progress-circle value="72" size="md"></lib-progress-circle>`)}
    ${withLabel('Accent',  html`<lib-progress-circle value="48" size="md" variant="accent"></lib-progress-circle>`)}
    ${withLabel('Info',    html`<lib-progress-circle value="91" size="md" variant="info"></lib-progress-circle>`)}
    ${withLabel('Error',   html`<lib-progress-circle value="103" max="100" size="md" variant="error"></lib-progress-circle>`)}
  `),
};

/* ── Labels ── */
export const Labels: Story = {
  name: 'Labels — valor · sub · icono · bare',
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    ${withLabel('Solo valor',    html`<lib-progress-circle value="74" size="lg"></lib-progress-circle>`)}
    ${withLabel('Valor + sub',   html`<lib-progress-circle value="74" size="lg" sub="Tareas"></lib-progress-circle>`)}
    ${withLabel('Completado',    html`<lib-progress-circle value="100" size="lg" variant="info" icon="check"></lib-progress-circle>`)}
    ${withLabel('Sin label',     html`<lib-progress-circle value="38" size="lg" variant="accent" ?bare=${true}></lib-progress-circle>`)}
  `),
};

/* ── Indeterminate ── */
export const Indeterminate: Story = {
  render: (): TemplateResult => preview('var(--bg-surface)', html`
    ${withLabel('MD · default',  html`<lib-progress-circle size="md" ?indeterminate=${true}></lib-progress-circle>`)}
    ${withLabel('MD · accent',   html`<lib-progress-circle size="md" variant="accent" ?indeterminate=${true}></lib-progress-circle>`)}
    ${withLabel('MD · info',     html`<lib-progress-circle size="md" variant="info" ?indeterminate=${true}></lib-progress-circle>`)}
    ${withLabel('SM · default',  html`<lib-progress-circle size="sm" ?indeterminate=${true}></lib-progress-circle>`)}
    ${withLabel('SM · accent',   html`<lib-progress-circle size="sm" variant="accent" ?indeterminate=${true}></lib-progress-circle>`)}
    ${withLabel('XS · default',  html`<lib-progress-circle size="xs" ?indeterminate=${true}></lib-progress-circle>`)}
  `),
};

/* ── Context: stat cards ── */
export const ContextStatCards: Story = {
  name: 'Context — Stat cards',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle); display:flex; flex-wrap:wrap; gap:20px;">

      ${[
        { title: 'Tareas completadas', variant: 'info', value: 83, sub: 'Sprint 4', big: '83%', detail: '20 / 24 issues' },
        { title: 'Uso de almacenamiento', variant: 'accent', value: 61, sub: '61 GB', big: '61%', detail: '61 / 100 GB' },
        { title: 'Límite de peticiones', variant: 'error', value: 96, sub: 'Crítico', big: '96%', detail: '9.600 / 10.000' },
      ].map(({ title, variant, value, sub, big, detail }) => html`
        <div style="border:1px solid var(--border-subtle); background:var(--bg-elevated); padding:24px; display:flex; flex-direction:column; gap:20px; min-width:200px;">
          <p style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${title}</p>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:16px;">
            <lib-progress-circle value=${value} size="md" variant=${variant} sub=${sub} stroke-width="6"></lib-progress-circle>
            <div style="display:flex; flex-direction:column; gap:8px; text-align:right;">
              <span style="font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; letter-spacing:-0.02em; line-height:1; color:var(--text-primary);">${big}</span>
              <span style="font-family:monospace; font-size:10px; color:var(--text-muted); letter-spacing:0.08em;">${detail}</span>
            </div>
          </div>
        </div>
      `)}

    </div>
  `,
};

/* ── Context: fila de métricas compacta ── */
export const ContextMetricsRow: Story = {
  name: 'Context — Fila de métricas SM',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle);">
      <div style="display:flex; align-items:center; gap:32px; flex-wrap:wrap;">
        ${[
          { label: 'Velocidad',      variant: 'info', value: 92, detail: '92 / 100' },
          { label: 'Accesibilidad',  variant: 'accent',    value: 74, detail: '74 / 100' },
          { label: 'SEO',            variant: 'default', value: 58, detail: '58 / 100' },
        ].map(({ label, variant, value, detail }) => html`
          <div style="display:flex; align-items:center; gap:12px;">
            <lib-progress-circle value=${value} size="sm" variant=${variant} stroke-width="4"></lib-progress-circle>
            <div>
              <p style="font-family:'Shippori Mincho',serif; font-size:13px; color:var(--text-primary);">${label}</p>
              <p style="font-family:monospace; font-size:10px; color:var(--text-muted); letter-spacing:0.08em;">${detail}</p>
            </div>
          </div>
        `)}
      </div>
    </div>
  `,
};

/* ── Context: hero perfil XL ── */
export const ContextHeroXL: Story = {
  name: 'Context — Hero perfil XL',
  render: (): TemplateResult => html`
    <div style="background:var(--bg-surface); padding:40px; border:1px solid var(--border-subtle); display:flex; align-items:center; gap:32px; flex-wrap:wrap;">
      <lib-progress-circle value="78" size="xl" sub="Completado" stroke-width="6"></lib-progress-circle>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <p style="font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; letter-spacing:-0.02em; color:var(--text-primary);">Perfil de diseñador</p>
        <p style="font-family:monospace; font-size:11px; color:var(--text-muted); letter-spacing:0.08em;">78% completado · 4 secciones pendientes</p>
        <p style="font-family:'Shippori Mincho',serif; font-size:13px; color:var(--text-secondary); max-width:340px; line-height:1.8;">Completa tu perfil para mejorar la visibilidad y acceder a proyectos exclusivos del sistema.</p>
      </div>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-progress-circle usa tokens semánticos de trazo y superficie
   (bg-base, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-lg);background:var(--bg-elevated);border:1px solid var(--border-subtle);align-items:center;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="65" size="xs"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">xs</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="65" size="sm"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">sm</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="65" size="md"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">md</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="48" size="md" variant="accent" sub="Accent"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">accent</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="91" size="md" variant="info" sub="Info"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">info</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle value="100" size="md" variant="info" icon="check"></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">100% ✓</span>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:var(--lib-space-sm);">
      <lib-progress-circle size="sm" ?indeterminate=${true}></lib-progress-circle>
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">∞</span>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
