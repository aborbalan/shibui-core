import { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect, fireEvent } from 'storybook/test';
import { html, TemplateResult } from 'lit';
import './lib-switch.component';
import type { LibSwitch } from './lib-switch.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

type SwitchArgs = Pick<LibSwitch, 'checked' | 'disabled' | 'variant' | 'size' | 'label' | 'sub'>;

const meta: Meta<SwitchArgs> = {
  title: 'Universal/Forms/Switch',
  tags:['autodocs'],
  component: 'lib-switch',
  argTypes: {
    variant:  { control: 'select', options: ['default', 'inverse'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
    sub:      { control: 'text' },
  },
  render: (args): TemplateResult => html`
    <div style="padding:40px; background:${args.variant === 'inverse' ? 'var(--color-washi-950)' : 'var(--bg-surface)'}; border:1px solid var(--border-subtle);">
      <lib-switch
        variant=${args.variant}
        size=${args.size}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        label=${args.label}
        sub=${args.sub}
        @ui-lib-change=${(e: CustomEvent<{ checked: boolean }>):void => console.log('ui-lib-change', e.detail)}
      ></lib-switch>
    </div>
  `,
};

export default meta;
type Story = StoryObj<SwitchArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    variant: 'default', size: 'md',
    checked: false, disabled: false,
    label: 'Notificaciones', sub: '',
  },
};

/* ── Default: estados ── */
export const DefaultStates: Story = {
  name: 'Default — Off · On · Disabled',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:24px;">
      <lib-switch label="Notificaciones" sub="Recibir avisos del sistema"></lib-switch>
      <lib-switch label="Modo avión" ?checked=${true}></lib-switch>
      <lib-switch label="Opción bloqueada" sub="Requiere permisos" ?disabled=${true}></lib-switch>
      <lib-switch label="Bloqueada activa" ?checked=${true} ?disabled=${true}></lib-switch>
    </div>
  `,
};

/* ── Default: tamaños ── */
export const DefaultSizes: Story = {
  name: 'Default — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; align-items:center; gap:40px; flex-wrap:wrap;">
      ${(['sm', 'md', 'lg'] as const).map(size => html`
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          <lib-switch size=${size} ?checked=${true}></lib-switch>
          <lib-switch size=${size}></lib-switch>
          <span style="font-family:monospace; font-size:10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.25em;">${size}</span>
        </div>
      `)}
    </div>
  `,
};

/* ── Kintsugi: estados ── */
export const KintsugiStates: Story = {
  name: 'Kintsugi — Off · On · Disabled',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--color-washi-950); border:1px solid oklch(16% 0.02 45); display:flex; flex-direction:column; gap:24px;">
      <lib-switch variant="inverse" label="Cerámica oscura" sub="Off — venas sutiles"></lib-switch>
      <lib-switch variant="inverse" label="Thumb dorado" sub="On — halo pulsante" ?checked=${true}></lib-switch>
      <lib-switch variant="inverse" label="Exportación avanzada" sub="Requiere plan Enterprise" ?disabled=${true}></lib-switch>
      <lib-switch variant="inverse" label="Disabled activado" ?checked=${true} ?disabled=${true}></lib-switch>
    </div>
  `,
};

/* ── Kintsugi: tamaños ── */
export const KintsugiSizes: Story = {
  name: 'Kintsugi — SM · MD · LG',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--color-washi-950); border:1px solid oklch(16% 0.02 45); display:flex; align-items:center; gap:48px; flex-wrap:wrap;">
      ${(['sm', 'md', 'lg'] as const).map(size => html`
        <div style="display:flex; flex-direction:column; align-items:center; gap:16px;">
          <lib-switch variant="inverse" size=${size} ?checked=${true}></lib-switch>
          <lib-switch variant="inverse" size=${size}></lib-switch>
          <span style="font-family:monospace; font-size:10px; color:oklch(35% 0.02 50); text-transform:uppercase; letter-spacing:0.25em;">${size}</span>
        </div>
      `)}
    </div>
  `,
};

/* ── Kintsugi: con label + sub ── */
export const KintsugiLabel: Story = {
  name: 'Kintsugi — Label y subtítulo',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--color-washi-950); border:1px solid oklch(16% 0.02 45); display:flex; flex-direction:column; gap:24px; max-width:480px;">
      <lib-switch variant="inverse" label="Acceso premium" sub="Funciones exclusivas desbloqueadas" ?checked=${true}></lib-switch>
      <lib-switch variant="inverse" label="Modo ceremonial" sub="Activa el tema inverse en toda la interfaz"></lib-switch>
      <lib-switch variant="inverse" label="Sincronización de perfil" sub="Última actualización · hace 2 min" ?checked=${true}></lib-switch>
      <lib-switch variant="inverse" label="Exportación avanzada" sub="Requiere plan Enterprise" ?disabled=${true}></lib-switch>
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-switch usa tokens semánticos de superficie y texto
   (bg-elevated, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-lg);background:var(--bg-elevated);border:1px solid var(--border-subtle);">
    <!-- States -->
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">states</span>
      <lib-switch label="Desactivado" sub="Estado por defecto"></lib-switch>
      <lib-switch label="Activado" sub="checked=true" ?checked=${true}></lib-switch>
      <lib-switch label="Bloqueado" ?disabled=${true}></lib-switch>
      <lib-switch label="Bloqueado activo" ?checked=${true} ?disabled=${true}></lib-switch>
    </div>
    <!-- Sizes -->
    <div style="display:flex;flex-direction:column;gap:var(--lib-space-sm);">
      <span style="font-family:monospace;font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:.15em;">sizes</span>
      ${(['sm','md','lg'] as const).map(size => html`
        <div style="display:flex;align-items:center;gap:var(--lib-space-sm);">
          <lib-switch size=${size} ?checked=${true}></lib-switch>
          <lib-switch size=${size}></lib-switch>
          <span style="font-family:monospace;font-size:10px;color:var(--text-muted);">${size}</span>
        </div>
      `)}
    </div>
  </div>
`);

/* ═══════════════════════════════════════════════════════════════
   TESTS · Interacción y eventos
   ═══════════════════════════════════════════════════════════════ */

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ═══════════════════════════════════════════════════════════════
   TESTS · Interacción y eventos
   ═══════════════════════════════════════════════════════════════ */

export const TestToggleEvent: Story = {
  name: 'Test · ui-lib-change se dispara al toggle',
  tags: ['test'],
  args: { label: 'Test switch', checked: false, disabled: false },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-switch') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;

    let detail: { checked: boolean } | null = null;
    canvasElement.addEventListener('ui-lib-change', (e) => {
      detail = (e as CustomEvent<{ checked: boolean }>).detail;
    }, { once: true });

    fireEvent.click(input);

    expect(detail).not.toBeNull();
    expect(detail!.checked).toBe(true);
  },
};

export const TestDisabledSwitch: Story = {
  name: 'Test · disabled bloquea el evento',
  tags: ['test'],
  args: { label: 'Disabled', disabled: true, checked: false },
  play: async ({ canvasElement }): Promise<void> => {
    const el = canvasElement.querySelector('lib-switch') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input[type="checkbox"]') as HTMLInputElement;

    expect(el.hasAttribute('disabled')).toBe(true);
    expect(input.disabled).toBe(true);
  },
};