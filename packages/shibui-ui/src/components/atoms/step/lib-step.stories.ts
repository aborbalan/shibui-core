import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-step.component';

interface StepArgs {
  label:       string;
  sub:         string;
  index:       number;
  status:      'pending' | 'active' | 'completed' | 'error';
  orientation: 'horizontal' | 'vertical';
  variant:     'default' | 'minimal' | 'kintsugi';
  size:        'sm' | 'md' | 'lg';
}

const meta: Meta<StepArgs> = {
  title: 'Components/Atoms/Step',
  tags:['autodocs'],
  component: 'lib-step',
  argTypes: {
    status:      { control: 'select', options: ['pending', 'active', 'completed', 'error'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    variant:     { control: 'select', options: ['default', 'minimal', 'kintsugi'] },
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