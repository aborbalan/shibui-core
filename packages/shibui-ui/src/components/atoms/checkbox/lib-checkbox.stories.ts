import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-checkbox.component';

const meta: Meta = {
  title: 'Forms/Checkbox',
  component: 'lib-checkbox',
  tags: ['autodocs'],
  argTypes: {
    icon: { 
      control: 'text',
      description: 'Nombre del icono de Phosphor para el estado checked' 
    },
  }
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args): TemplateResult => html`
    <lib-checkbox 
      label="${args.label}" 
      ?checked="${args.checked}" 
      ?disabled="${args.disabled}"
    ></lib-checkbox>
  `,
  args: {
    label: 'Aceptar términos',
    checked: false,
    disabled: false,
  },
};

// Nueva historia con ejemplos de diferentes iconos
export const CustomIcons: Story = {
    render: (): TemplateResult => html`
     <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
      <p style="margin: 0; font-family: sans-serif; font-size: 12px; color: #666;">
        Comparativa: Icono en Checkbox vs Icono independiente
      </p>
      
      <div style="display: flex; align-items: center; gap: 20px;">
        <lib-checkbox checked icon="check" label="Checkbox Check"></lib-checkbox>
        <div style="display: flex; align-items: center; gap: 8px;">
          <lib-icon name="check" style="color: #007aff;"></lib-icon>
          <span style="font-family: sans-serif; font-size: 14px;">Icono Suelto</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 20px;">
        <lib-checkbox checked icon="heart-fill" label="Checkbox Heart"></lib-checkbox>
        <div style="display: flex; align-items: center; gap: 8px;">
          <lib-icon name="heart-fill" style="color: #007aff;"></lib-icon>
          <span style="font-family: sans-serif; font-size: 14px;">Icono Suelto</span>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 20px;">
        <lib-checkbox checked icon="x" label="Checkbox X"></lib-checkbox>
        <div style="display: flex; align-items: center; gap: 8px;">
          <lib-icon name="x" style="color: #007aff;"></lib-icon>
          <span style="font-family: sans-serif; font-size: 14px;">Icono Suelto</span>
        </div>
      </div>
    </div>
    `,
  };