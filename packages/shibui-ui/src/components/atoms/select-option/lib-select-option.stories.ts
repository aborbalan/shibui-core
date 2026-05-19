import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-select-option.component';

interface SelectOptionArgs {
  value:    string;
  selected: boolean;
  disabled: boolean;
  content:  string;
}

const meta: Meta<SelectOptionArgs> = {
  title: 'Forms/Select Option',
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
  name: 'All States.',
  render: (): TemplateResult => html`
    <div style="background: var(--bg-elevated); width: 300px; border: 1px solid var(--border-subtle);">
      <lib-select-option value="a">Default</lib-select-option>
      <lib-select-option value="b" selected>Selected</lib-select-option>
      <lib-select-option value="c" disabled>Disabled</lib-select-option>
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
          <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);width:100%;">
            <lib-select-option value="wabi">Wabi · Imperfección serena</lib-select-option>
            <lib-select-option value="kintsugi" selected>Kintsugi · Cicatrices de oro</lib-select-option>
            <lib-select-option value="shizen">Shizen · Naturaleza orgánica</lib-select-option>
            <lib-select-option value="sabi" disabled>Sabi · No disponible</lib-select-option>
          </div>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};