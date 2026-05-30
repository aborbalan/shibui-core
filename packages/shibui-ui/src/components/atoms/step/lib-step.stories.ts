import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-step.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

interface StepArgs {
  label:       string;
  sub:         string;
  index:       number;
  status:      'pending' | 'active' | 'completed' | 'error';
  orientation: 'horizontal' | 'vertical';
  variant:     'default' | 'minimal' | 'inverse' | 'brutal';
  size:        'sm' | 'md' | 'lg';
}

const meta: Meta<StepArgs> = {
  title: 'Universal/Navigation/Step',
  tags:['autodocs'],
  component: 'lib-step',
  argTypes: {
    status:      { control: 'select', options: ['pending', 'active', 'completed', 'error'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant:     { control: 'select', options: ['default', 'minimal', 'inverse', 'brutal'] },
    size:        { control: 'select', options: ['sm', 'md', 'lg'] },
    label:       { control: 'text' },
    sub:         { control: 'text' },
    index:       { control: 'number' },
  },
  render: (args): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:inline-flex;">
      <lib-step
        label=${args.label}
        sub=${args.sub}
        index=${args.index}
        status=${args.status}
        orientation=${args.orientation}
        variant=${args.variant}
        size=${args.size}
        ?last=${true}
      ></lib-step>
    </div>
  `,
};

export default meta;
type Story = StoryObj<StepArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    label: 'Información', sub: 'Datos personales',
    index: 1, status: 'pending',
    orientation: 'horizontal', variant: 'default', size: 'md',
  },
};

/* ── Kintsugi ── */
export const Kintsugi: Story = {
  name: 'Kintsugi ◈',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="display:flex; gap:0; padding:48px; background:var(--color-washi-950, #120E0A);">
      ${([
        { status: 'completed', index: 1, label: '金継ぎ', desc: '完了' },
        { status: 'active',    index: 2, label: '修復',   desc: '進行中' },
        { status: 'pending',   index: 3, label: '完成',   desc: '待機' },
      ] as const).map(({ status, index, label, desc }) => html`
        <lib-step
          variant="inverse"
          status=${status}
          index=${index}
          label=${label}
          sub=${desc}
          ?last=${index === 3}
        ></lib-step>
      `)}
    </div>
  `,
};

/* ── Brutal ── */
export const Brutal: Story = {
  name: 'Brutal ◼',
  parameters: { backgrounds: { default: 'light' } },
  render: (): TemplateResult => html`
    <div style="display:flex; gap:0; padding:48px; background:var(--color-washi-100, #F2EDE6);">
      ${([
        { status: 'completed', index: 1, label: 'INIT',   desc: 'Done' },
        { status: 'active',    index: 2, label: 'BUILD',  desc: 'Running' },
        { status: 'pending',   index: 3, label: 'DEPLOY', desc: 'Waiting' },
        { status: 'error',     index: 4, label: 'TEST',   desc: 'Failed' },
      ] as const).map(({ status, index, label, desc }) => html`
        <lib-step
          variant="brutal"
          status=${status}
          index=${index}
          label=${label}
          sub=${desc}
          ?last=${index === 4}
        ></lib-step>
      `)}
    </div>
  `,
};

/* ── Cuatro estados ── */
export const States: Story = {
  name: 'States — los cuatro estados',
  render: (): TemplateResult => html`
    <div style="display:flex; gap:48px; padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); flex-wrap:wrap;">
      ${(
        [
          { status: 'pending',   index: 1, label: 'Pendiente',  desc: 'Nodo borde default' },
          { status: 'active',    index: 2, label: 'Activo',     desc: 'Halo washi-100' },
          { status: 'completed', index: 3, label: 'Completado', desc: 'Checkmark washi-700' },
          { status: 'error',     index: 4, label: 'Error',      desc: 'Icono exclamación' },
        ] as const
      ).map(({ status, index, label, desc }) => html`
        <div style="display:flex; flex-direction:column; align-items:center; gap:12px;">
          <lib-step
            label=${label}
            sub=${desc}
            index=${index}
            status=${status}
            ?last=${true}
          ></lib-step>
        </div>
      `)}
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-step usa tokens semánticos de superficie y borde
   (bg-base, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-xl);padding:var(--lib-space-lg);background:var(--bg-base);border:1px solid var(--border-subtle);">
    <!-- default variant — 4 statuses -->
    <div style="display:inline-flex;flex-wrap:wrap;">
      <lib-step label="Completado" sub="Done"   index="1" status="completed" variant="default"></lib-step>
      <lib-step label="Activo"     sub="Now"    index="2" status="active"    variant="default"></lib-step>
      <lib-step label="Pendiente"  sub="Waiting"index="3" status="pending"   variant="default"></lib-step>
      <lib-step label="Error"      sub="Failed" index="4" status="error"     variant="default" last></lib-step>
    </div>
    <!-- minimal variant -->
    <div style="display:inline-flex;flex-wrap:wrap;">
      <lib-step label="Step 1" index="1" status="completed" variant="minimal"></lib-step>
      <lib-step label="Step 2" index="2" status="active"    variant="minimal"></lib-step>
      <lib-step label="Step 3" index="3" status="pending"   variant="minimal" last></lib-step>
    </div>
    <!-- sizes sm · md · lg -->
    <div style="display:flex;gap:var(--lib-space-xl);align-items:center;flex-wrap:wrap;">
      ${(['sm','md','lg'] as const).map(size => html`
        <div style="display:inline-flex;">
          <lib-step label="Paso" index="1" status="active" size=${size}></lib-step>
          <lib-step label="Paso" index="2" status="pending" size=${size} last></lib-step>
        </div>
      `)}
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;