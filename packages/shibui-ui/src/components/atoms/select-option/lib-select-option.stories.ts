import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-select-option.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

interface SelectOptionArgs {
  value:    string;
  selected: boolean;
  disabled: boolean;
  content:  string;
}

const meta: Meta<SelectOptionArgs> = {
  title: 'Universal/Forms/Select Option',
  tags:['autodocs'],
  component: 'lib-select-option',
  argTypes: {
    value:    { control: 'text' },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    content:  { control: 'text', name: 'Slot Content' },
  },
  render: (args): TemplateResult => html`
    <div style="background: var(--bg-elevated); padding: 8px; width: 300px; border: 1px solid var(--border-subtle);">
      <lib-select-option
        value="${args.value}"
        ?selected="${args.selected}"
        ?disabled="${args.disabled}"
      >
        ${args.content}
      </lib-select-option>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SelectOptionArgs>;

export const Playground: Story = {
  args: {
    value:    'opcion-1',
    content:  'Opción de ejemplo',
    selected: false,
    disabled: false,
  },
};

export const AllStates: Story = {
  render: (): TemplateResult => html`
    <div style="background: var(--bg-elevated); width: 300px; border: 1px solid var(--border-subtle);">
      <lib-select-option value="a">Default</lib-select-option>
      <lib-select-option value="b" selected>Selected</lib-select-option>
      <lib-select-option value="c" disabled>Disabled</lib-select-option>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-select-option usa tokens semánticos de superficie y texto
   (bg-elevated, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;gap:var(--lib-space-lg);padding:var(--lib-space-lg);flex-wrap:wrap;align-items:flex-start;">
    <!-- Default state spectrum -->
    <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);width:220px;">
      <lib-select-option value="wabi">Wabi · Imperfección serena</lib-select-option>
      <lib-select-option value="kintsugi" selected>Kintsugi · Cicatrices de oro</lib-select-option>
      <lib-select-option value="shizen">Shizen · Naturaleza orgánica</lib-select-option>
      <lib-select-option value="sabi" disabled>Sabi · No disponible</lib-select-option>
    </div>
    <!-- Second list without selection -->
    <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);width:220px;">
      <lib-select-option value="a">Default</lib-select-option>
      <lib-select-option value="b">Otra opción</lib-select-option>
      <lib-select-option value="c">Tercera opción</lib-select-option>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
