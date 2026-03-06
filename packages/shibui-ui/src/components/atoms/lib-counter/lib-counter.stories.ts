import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-counter.component';
import type { LibCounter } from './lib-counter.component';

type CounterArgs = Pick<LibCounter,
  'value' | 'prefix' | 'suffix' | 'thousands' | 'decimals' |
  'size' | 'tone' | 'label' | 'delta' | 'deltaDir' | 'playOnVisible'
>;

const meta: Meta<CounterArgs> = {
  title: 'Components/Atoms/Counter',
  component: 'lib-counter',
  argTypes: {
    value:          { control: 'number' },
    prefix:         { control: 'text' },
    suffix:         { control: 'text' },
    thousands:      { control: 'text' },
    decimals:       { control: 'number' },
    size:           { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
    tone:           { control: 'select', options: ['default', 'kaki', 'celadon', 'error', 'muted', 'on-dark'] },
    label:          { control: 'text' },
    delta:          { control: 'text' },
    deltaDir:       { control: 'select', options: ['up', 'down', 'flat'] },
    playOnVisible:  { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<CounterArgs>;

/* ── Shared stage styles ── */
const stage     = 'padding: 40px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 40px; background: var(--bg-surface);';
const stageDark = 'padding: 40px; display: flex; flex-wrap: wrap; align-items: flex-end; gap: 40px; background: var(--color-washi-950);';

/* ── Playground ── */
export const Playground: Story = {
  args: {
    value:         8302,
    prefix:        '',
    suffix:        '',
    thousands:     '.',
    size:          'lg',
    tone:          'default',
    label:         'Usuarios activos',
    delta:         '',
    deltaDir:      'up',
    playOnVisible: true,
  },
  render: (args): TemplateResult => html`
    <div style=${stage}>
      <lib-counter
        value=${args.value}
        prefix=${args.prefix}
        suffix=${args.suffix}
        thousands=${args.thousands}
        size=${args.size}
        tone=${args.tone}
        label=${args.label}
        delta=${args.delta}
        delta-dir=${args.deltaDir}
        ?play-on-visible=${args.playOnVisible}
      ></lib-counter>
    </div>
  `,
};

/* ── Digit flip — mecánica ── */
export const DigitFlip: Story = {
  name: 'Digit flip — mecánica',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); display:flex; flex-direction:column; gap:32px;">
      <lib-counter
        id="demo"
        value="8302"
        size="lg"
        label="Usuarios activos"
        play-on-visible
      ></lib-counter>

      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${[0, 1247, 8302, 24819, 100000].map(v => html`
          <button
            style="font-family:var(--lib-font-mono);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-secondary);background:transparent;border:1px solid var(--border-default);padding:6px 16px;cursor:pointer;"
            @click=${(): void => {
              const el = document.querySelector<LibCounter>('#demo');
              if (el) el.value = v;
            }}
          >${v.toLocaleString('es-ES')}</button>
        `)}
      </div>
    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  name: 'Sizes — SM · MD · LG · XL',
  render: (): TemplateResult => html`
    <div style=${stage}>
      ${(['sm', 'md', 'lg', 'xl'] as const).map((s, i) => html`
        <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start;">
          <lib-counter value="4829" size=${s} play-on-visible></lib-counter>
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
            ${s.toUpperCase()} · ${['2rem','3.5rem','5rem','7rem'][i]}
          </span>
        </div>
      `)}
    </div>
  `,
};

/* ── Formats ── */
export const Formats: Story = {
  name: 'Formats — Moneda · Porcentaje · Decimal',
  render: (): TemplateResult => html`
    <div style=${stage}>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <lib-counter value="84291" size="md" play-on-visible></lib-counter>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Sin formato</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <lib-counter value="24750" prefix="€" size="md" tone="kaki" play-on-visible></lib-counter>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Moneda</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <lib-counter value="87" suffix="%" thousands="" size="md" tone="celadon" play-on-visible></lib-counter>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Porcentaje</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <lib-counter value="4" decimals="73" size="md" play-on-visible></lib-counter>
        <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Decimal</span>
      </div>
    </div>
  `,
};

/* ── Delta ── */
export const WithDelta: Story = {
  name: 'Delta — Up · Down · Flat',
  render: (): TemplateResult => html`
    <div style=${stage}>
      <lib-counter
        value="184200" prefix="€" size="md" tone="kaki"
        label="Ingresos" delta="+14,7%" delta-dir="up" play-on-visible>
      </lib-counter>
      <lib-counter
        value="1243" size="md"
        label="Devoluciones" delta="-8,2%" delta-dir="down" play-on-visible>
      </lib-counter>
      <lib-counter
        value="38492" size="md"
        label="Visitas" delta="+0,1%" delta-dir="flat" play-on-visible>
      </lib-counter>
    </div>
  `,
};

/* ── Stat cards ── */
export const StatCards: Story = {
  name: 'Contexto — Stat cards',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface);">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
        <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);padding:24px;display:flex;flex-direction:column;gap:16px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Usuarios</p>
          <lib-counter value="24819" size="md" label="vs mes anterior" delta="+12,4%" delta-dir="up" play-on-visible></lib-counter>
        </div>
        <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);padding:24px;display:flex;flex-direction:column;gap:16px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Ingresos</p>
          <lib-counter value="18540" prefix="€" size="md" tone="kaki" label="vs mes anterior" delta="+14,7%" delta-dir="up" play-on-visible></lib-counter>
        </div>
        <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);padding:24px;display:flex;flex-direction:column;gap:16px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Conversión</p>
          <lib-counter value="7" suffix="%" thousands="" size="md" tone="celadon" label="vs mes anterior" delta="+0,1%" delta-dir="flat" play-on-visible></lib-counter>
        </div>
        <div style="border:1px solid var(--border-subtle);background:var(--bg-elevated);padding:24px;display:flex;flex-direction:column;gap:16px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Churn</p>
          <lib-counter value="3" suffix="%" thousands="" size="md" tone="error" label="vs mes anterior" delta="+2,3%" delta-dir="down" play-on-visible></lib-counter>
        </div>
      </div>
    </div>
  `,
};

/* ── Dark surface ── */
export const DarkSurface: Story = {
  name: 'Dark surface — KPI hero',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style=${stageDark}>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;width:100%;">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:oklch(30% 0.02 50);text-transform:uppercase;">Componentes</p>
          <lib-counter value="22" thousands="" size="lg" tone="on-dark" label="En el sistema" play-on-visible></lib-counter>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:oklch(30% 0.02 50);text-transform:uppercase;">Design tokens</p>
          <lib-counter value="148" thousands="" size="lg" tone="on-dark" label="Variables CSS" play-on-visible></lib-counter>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:oklch(30% 0.02 50);text-transform:uppercase;">Kintsugi</p>
          <lib-counter value="5" thousands="" size="lg" tone="on-dark" label="Variantes" play-on-visible></lib-counter>
        </div>
      </div>
    </div>
  `,
};