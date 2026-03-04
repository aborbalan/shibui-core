import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-checkbox.component';
import type { LibCheckbox } from './lib-checkbox.component';

type LibCheckboxStoryArgs = Pick<
  LibCheckbox,
  'checked' | 'disabled' | 'indeterminate' | 'label' | 'sublabel' | 'size' | 'variant' | 'value'
>;

const meta: Meta<LibCheckboxStoryArgs> = {
  title: 'Components/Atoms/Checkbox',
  component: 'lib-checkbox',

  argTypes: {
    checked:       { control: 'boolean' },
    disabled:      { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label:         { control: 'text' },
    sublabel:      { control: 'text', description: 'Texto secundario bajo el label' },
    value:         { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['default', 'kaki', 'error'],
    },
  },

  render: (args): TemplateResult => html`
    <div style="padding:24px;">
      <lib-checkbox
        label=${args.label}
        sublabel=${args.sublabel}
        value=${args.value}
        size=${args.size}
        variant=${args.variant}
        ?checked=${args.checked}
        ?disabled=${args.disabled}
        ?indeterminate=${args.indeterminate}
      ></lib-checkbox>
    </div>
  `,
};

export default meta;
type Story = StoryObj<LibCheckboxStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    label: 'Aceptar terminos y condiciones',
    sublabel: '',
    value: 'terms',
    size: 'md',
    variant: 'default',
    checked: false,
    disabled: false,
    indeterminate: false,
  },
};

/* ── States ── */
export const States: Story = {
  name: 'States',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-checkbox
        label="Unchecked"
        sublabel="Estado por defecto"
      ></lib-checkbox>
      <lib-checkbox
        label="Checked"
        sublabel="Seleccionado — fondo washi-900"
        checked
      ></lib-checkbox>
      <lib-checkbox
        label="Indeterminate"
        sublabel="Seleccion parcial de grupo"
        indeterminate
      ></lib-checkbox>
      <lib-checkbox
        label="Disabled"
        sublabel="No interactivo"
        disabled
      ></lib-checkbox>
      <lib-checkbox
        label="Disabled checked"
        sublabel="No interactivo"
        disabled
        checked
      ></lib-checkbox>
      <lib-checkbox
        label="Error"
        sublabel="Campo requerido"
        variant="error"
      ></lib-checkbox>
    </div>
  `,
};

/* ── Sizes ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-checkbox size="sm" label="Small" sublabel="14px box" checked></lib-checkbox>
      <lib-checkbox size="md" label="Medium (default)" sublabel="18px box" checked></lib-checkbox>
      <lib-checkbox size="lg" label="Large" sublabel="22px box" checked></lib-checkbox>
    </div>
  `,
};

/* ── Variants ── */
export const Variants: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3;">
      <lib-checkbox variant="default" label="Default" sublabel="Fondo washi-900" checked></lib-checkbox>
      <lib-checkbox variant="kaki"    label="Kaki" sublabel="Fondo kaki-500" checked></lib-checkbox>
      <lib-checkbox variant="error"   label="Error" sublabel="Borde y label en color-error"></lib-checkbox>
    </div>
  `,
};

/* ── With sublabel ── */
export const WithSublabel: Story = {
  name: 'With Sublabel',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; max-width:400px;">
      <lib-checkbox
        label="Notificaciones por email"
        sublabel="Recibe actualizaciones en tu bandeja de entrada"
        checked
      ></lib-checkbox>
      <lib-checkbox
        label="Notificaciones push"
        sublabel="Requiere permiso del navegador"
      ></lib-checkbox>
      <lib-checkbox
        label="Webhook"
        sublabel="Disponible en plan Pro"
        disabled
      ></lib-checkbox>
    </div>
  `,
};

/* ── Indeterminate group ── */
export const IndeterminateGroup: Story = {
  name: 'Indeterminate Group',
  render: (): TemplateResult => html`
    <div style="display:flex; flex-direction:column; gap:20px; padding:24px; background:#FFFFFF; border:1px solid #E5DDD3; max-width:400px;">
      <p style="font-family:monospace; font-size:11px; color:#9A8878; text-transform:uppercase; letter-spacing:0.15em; margin-bottom:4px;">
        Seleccion parcial de grupo
      </p>
      <lib-checkbox
        label="Canales de notificacion"
        sublabel="2 de 3 activos"
        indeterminate
      ></lib-checkbox>
      <div style="padding-left:24px; display:flex; flex-direction:column; gap:16px;">
        <lib-checkbox label="Correo electronico" checked></lib-checkbox>
        <lib-checkbox label="SMS"></lib-checkbox>
        <lib-checkbox label="Push en app" checked></lib-checkbox>
      </div>
    </div>
  `,
};