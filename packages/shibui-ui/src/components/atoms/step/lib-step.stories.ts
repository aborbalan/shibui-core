import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-step.component';

interface StepArgs {
  label:       string;
  sub:         string;
  index:       number;
  status:      'pending' | 'active' | 'completed' | 'error';
  orientation: 'horizontal' | 'vertical';
  variant:     'default' | 'minimal' | 'kintsugi' | 'brutal';
  size:        'sm' | 'md' | 'lg';
}

const meta: Meta<StepArgs> = {
  title: 'Navigation/Step',
  tags:['autodocs'],
  component: 'lib-step',
  argTypes: {
    status:      { control: 'select', options: ['pending', 'active', 'completed', 'error'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant:     { control: 'select', options: ['default', 'minimal', 'kintsugi', 'brutal'] },
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
          variant="kintsugi"
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
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--lib-space-lg);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <div style="display:flex;justify-content:center;gap:var(--lib-space-md);padding:var(--lib-space-md) 0;">
            <lib-step label="Inicio"     index="1" status="completed"></lib-step>
            <lib-step label="En proceso" index="2" status="active"></lib-step>
            <lib-step label="Pendiente"  index="3" status="pending" last></lib-step>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};