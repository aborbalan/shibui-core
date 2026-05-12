import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-kbd.component';
import type { LibKbd } from './lib-kbd.component';

type KbdArgs = Pick<LibKbd, 'size' | 'variant' | 'pressed'>;

const meta: Meta<KbdArgs> = {
  title: 'Components/Atoms/Kbd',
  tags:['autodocs'],
  component: 'lib-kbd',
  argTypes: {
    size:    { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['default', 'dark', 'ghost', 'kaki', 'celadon'] },
    pressed: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<KbdArgs>;

/* ── Shared styles ── */
const stage  = 'padding:40px; display:flex; flex-wrap:wrap; align-items:flex-end; gap:24px; background:var(--bg-surface);';
const stageDk= 'padding:40px; display:flex; flex-wrap:wrap; align-items:flex-end; gap:16px; background:var(--color-washi-950);';
const sepStyle = 'font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);padding:0 2px;line-height:1;';

/* ── Playground ── */
export const Playground: Story = {
  args: { size: 'md', variant: 'default', pressed: false },
  render: (args): TemplateResult => html`
    <div style="padding:40px;">
      <lib-kbd size=${args.size} variant=${args.variant} ?pressed=${args.pressed}>⌘</lib-kbd>
    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  name: 'Sizes — XS · SM · MD · LG',
  render: (): TemplateResult => html`
    <div style=${stage}>
      ${(['xs', 'sm', 'md', 'lg'] as const).map((s, i) => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <div style="display:flex;align-items:flex-end;gap:8px;">
            <lib-kbd size=${s}>⌘</lib-kbd>
            <lib-kbd size=${s} pressed>K</lib-kbd>
          </div>
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">
            ${s.toUpperCase()} · ${['18px','22px','28px','36px'][i]}${s === 'md' ? ' (default)' : ''}
          </span>
        </div>
      `)}
    </div>
  `,
};

/* ── Modifier symbols ── */
export const ModifierSymbols: Story = {
  name: 'Modifier symbols',
  render: (): TemplateResult => html`
    <div style=${stage}>
      ${['⌘','⌃','⌥','⇧','⏎','⌫','⇥','Esc','Space','↑','↓','←','→','F1','Del'].map(k => html`
        <lib-kbd size="md">${k}</lib-kbd>
      `)}
    </div>
  `,
};

/* ── Variants ── */
export const Variants: Story = {
  name: 'Variants — Default · Dark · Ghost · Kaki · Celadón',
  render: (): TemplateResult => html`
    <div style=${stage}>
      ${(['default','dark','ghost','kaki','celadon'] as const).map(v => html`
        <div style="display:flex;flex-direction:column;align-items:center;gap:12px;">
          <div style="display:flex;align-items:center;gap:4px;">
            <lib-kbd size="md" variant=${v}>⌘</lib-kbd>
            <lib-kbd size="md" variant=${v}>K</lib-kbd>
          </div>
          <span style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">${v}</span>
        </div>
      `)}
    </div>
  `,
};

/* ── Dark surface ── */
export const DarkSurface: Story = {
  name: 'Dark — sobre superficie oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style=${stageDk}>
      <lib-kbd size="md" variant="dark">⌘</lib-kbd>
      <lib-kbd size="md" variant="dark">⇧</lib-kbd>
      <lib-kbd size="md" variant="dark">P</lib-kbd>
      <lib-kbd size="md" variant="dark" pressed>Esc</lib-kbd>
      <lib-kbd size="md" variant="dark">Space</lib-kbd>
    </div>
  `,
};

/* ── Combos ── */
export const Combos: Story = {
  name: 'Combos — secuencias con separador',
  render: (): TemplateResult => html`
    <div style=${stage}>

      <div style="display:flex;align-items:center;gap:4px;">
        <lib-kbd size="md">⌘</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">K</lib-kbd>
      </div>

      <div style="display:flex;align-items:center;gap:4px;">
        <lib-kbd size="md">⌘</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">⇧</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">P</lib-kbd>
      </div>

      <div style="display:flex;align-items:center;gap:4px;">
        <lib-kbd size="md">Ctrl</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">Alt</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">Del</lib-kbd>
      </div>

      <div style="display:flex;align-items:center;gap:4px;">
        <lib-kbd size="md">⌘</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">⌥</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">⇧</lib-kbd>
        <span style=${sepStyle}>+</span>
        <lib-kbd size="md">S</lib-kbd>
      </div>

      <!-- Secuencia "then" con separador › -->
      <div style="display:flex;align-items:center;gap:4px;">
        <lib-kbd size="md">G</lib-kbd>
        <span style="font-family:var(--lib-font-mono);font-size:14px;color:var(--text-muted);padding:0 3px;">›</span>
        <lib-kbd size="md">H</lib-kbd>
      </div>

    </div>
  `,
};

/* ── Shortcut table ── */
export const ShortcutTable: Story = {
  name: 'Contexto — Tabla de shortcuts',
  render: (): TemplateResult => html`
    <div style="padding:40px; max-width:600px;">
      <div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);">

        <div style="padding:12px 20px;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;color:var(--text-muted);text-transform:uppercase;">Atajos de teclado · Editor</p>
        </div>

        ${([
          { label: 'Command palette',   keys: [['⌘','K']] },
          { label: 'Buscar en archivos',keys: [['⌘','⇧','F']] },
          { label: 'Guardar todos',     keys: [['⌘','⌥','S']] },
          { label: 'Nuevo archivo',     keys: [['⌘','N']] },
          { label: 'Cerrar pestaña',    keys: [['⌘','W']] },
          { label: 'Deshacer',          keys: [['⌘','Z']] },
          { label: 'Rehacer',           keys: [['⌘','⇧','Z']] },
        ]).map(row => html`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid var(--border-subtle);">
            <span style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);">${row.label}</span>
            <div style="display:flex;align-items:center;gap:4px;">
              ${row.keys[0]!.map((k, i) => html`
                ${i > 0 ? html`<span style=${sepStyle}>+</span>` : ''}
                <lib-kbd size="sm">${k}</lib-kbd>
              `)}
            </div>
          </div>
        `)}

      </div>
    </div>
  `,
};

/* ── Inline en prosa ── */
export const InlineProse: Story = {
  name: 'Contexto — Inline en documentación',
  render: (): TemplateResult => html`
    <div style="padding:40px;max-width:560px;display:flex;flex-direction:column;gap:20px;background:var(--bg-surface);">

      <p style="font-family:var(--lib-font-body);font-size:var(--text-base);color:var(--text-secondary);line-height:1.8;">
        Para abrir el panel de componentes presiona
        <span style="display:inline-flex;align-items:center;gap:3px;vertical-align:middle;margin:0 4px 2px;">
          <lib-kbd size="sm">⌘</lib-kbd>
          <span style=${sepStyle}>+</span>
          <lib-kbd size="sm">K</lib-kbd>
        </span>
        o haz clic en el icono de la barra lateral.
      </p>

      <p style="font-family:var(--lib-font-body);font-size:var(--text-base);color:var(--text-secondary);line-height:1.8;">
        Usa
        <span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 3px;"><lib-kbd size="sm">↑</lib-kbd></span>
        y
        <span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 3px;"><lib-kbd size="sm">↓</lib-kbd></span>
        para navegar. Pulsa
        <span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 3px;"><lib-kbd size="sm">⏎</lib-kbd></span>
        para seleccionar o
        <span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 3px;"><lib-kbd size="sm">Esc</lib-kbd></span>
        para cerrar.
      </p>

    </div>
  `,
};