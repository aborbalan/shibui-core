import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-switch.component';
import type { LibSwitch } from './lib-switch.component';

type SwitchArgs = Pick<LibSwitch, 'checked' | 'disabled' | 'variant' | 'size' | 'label' | 'sub'>;

const meta: Meta<SwitchArgs> = {
  title: 'Components/Atoms/Switch',
  tags:['autodocs'],
  component: 'lib-switch',
  argTypes: {
    variant:  { control: 'select', options: ['default', 'kintsugi'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
    sub:      { control: 'text' },
  },
  render: (args): TemplateResult => html`
    <div style="padding:40px; background:${args.variant === 'kintsugi' ? 'var(--color-washi-950)' : 'var(--bg-surface)'}; border:1px solid var(--border-subtle);">
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
      <lib-switch variant="kintsugi" label="Cerámica oscura" sub="Off — venas sutiles"></lib-switch>
      <lib-switch variant="kintsugi" label="Thumb dorado" sub="On — halo pulsante" ?checked=${true}></lib-switch>
      <lib-switch variant="kintsugi" label="Exportación avanzada" sub="Requiere plan Enterprise" ?disabled=${true}></lib-switch>
      <lib-switch variant="kintsugi" label="Disabled activado" ?checked=${true} ?disabled=${true}></lib-switch>
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
          <lib-switch variant="kintsugi" size=${size} ?checked=${true}></lib-switch>
          <lib-switch variant="kintsugi" size=${size}></lib-switch>
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
      <lib-switch variant="kintsugi" label="Acceso premium" sub="Funciones exclusivas desbloqueadas" ?checked=${true}></lib-switch>
      <lib-switch variant="kintsugi" label="Modo ceremonial" sub="Activa el tema kintsugi en toda la interfaz"></lib-switch>
      <lib-switch variant="kintsugi" label="Sincronización de perfil" sub="Última actualización · hace 2 min" ?checked=${true}></lib-switch>
      <lib-switch variant="kintsugi" label="Exportación avanzada" sub="Requiere plan Enterprise" ?disabled=${true}></lib-switch>
    </div>
  `,
};