import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-form-field.component';
// Asegúrate de que la ruta a tu lib-input sea correcta
import '../../molecules/input/lib-input.component'; 

const meta: Meta = {
  title: 'Forms/Form Field',
  component: 'lib-form-field',
  argTypes: {
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorText: { control: 'text' },
    error: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

export default meta;

export const Default: StoryObj = {
  render: (args) => html`
    <lib-form-field 
      .label=${args.label} 
      .helperText=${args.helperText} 
      .errorText=${args.errorText} 
      ?error=${args.error} 
      ?required=${args.required}
    >
      <lib-input placeholder="Escribe algo..."></lib-input>
    </lib-form-field>
  `,
  args: {
    label: 'Nombre de usuario',
    helperText: 'El nombre que verán los demás usuarios',
    errorText: 'Este nombre ya está en uso',
    error: false,
    required: true,
  },
};

export const WithError: StoryObj = {
  render: () => html`
    <lib-form-field 
      label="Email" 
      error 
      error-text="El formato del correo no es válido"
      required
    >
      <lib-input type="email" value="correo-incorrecto@"></lib-input>
    </lib-form-field>
  `,
};

export const ComplexForm: StoryObj = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
      <lib-form-field label="Nombre completo" required>
        <lib-input placeholder="Juan Pérez"></lib-input>
      </lib-form-field>

      <lib-form-field label="Biografía" helper-text="Cuéntanos un poco sobre ti (máx. 200 caracteres)">
        <lib-input placeholder="Soy desarrollador..."></lib-input>
      </lib-form-field>

      <lib-form-field label="Código promocional" error error-text="Código expirado">
        <lib-input value="PROMO2023"></lib-input>
      </lib-form-field>
    </div>
  `,
};