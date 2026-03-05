import { html, TemplateResult } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';
import './lib-dropdown.component';

/**
 * Interfaz para los argumentos de la historia.
 * Esto ayuda a Storybook a generar los controles y a TS a validar tipos.
 */
interface DropdownArgs {
  label: string;
  open: boolean;
}

const meta: Meta<DropdownArgs> = {
  title: 'Navigation/Dropdown',
  component: 'lib-dropdown',
  argTypes: {
    label: { 
      control: 'text',
      description: 'Texto del botón activador'
    },
    open: { 
      control: 'boolean',
      description: 'Estado de apertura del menú'
    },
  },
};

export default meta;

type Story = StoryObj<DropdownArgs>;

/**
 * Render base para las historias estándar
 */
const renderTemplate = (args: DropdownArgs): TemplateResult => html`
  <div style="height: 300px; display: flex; justify-content: center; padding-top: 50px; background: var(--bg-base, #fff);">
    <lib-dropdown .label=${args.label} ?open=${args.open}>
      <button @click=${() => console.log('Edit clicked')}>Editar perfil</button>
      <button @click=${() => console.log('Settings clicked')}>Configuración</button>
      <hr>
      <button style="color: var(--color-kaki-600, #e53e3e);" @click=${() => console.log('Delete clicked')}>
        Eliminar cuenta
      </button>
    </lib-dropdown>
  </div>
`;

export const Default: Story = {
  args: {
    label: 'Mi Cuenta',
    open: false,
  },
  render: (args) => renderTemplate(args),
};

/**
 * Historia con el estilo refinado de la guía Shibui.
 * Muestra el uso de avatares y el efecto de cristal sobre fondo oscuro.
 */
export const ShibuiStyle: Story = {
  args: {
    label: 'Seleccionar Perfil',
    open: false,
  },
  render: (args) => html`
    <div style="height: 400px; background: #111; padding: 100px; display: flex; justify-content: center;">
      
      <lib-dropdown .label=${args.label} ?open=${args.open}>
        <button @click=${() => console.log('User: Kenshiro')}>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-kaki-500); margin-right: 12px; flex-shrink: 0;"></div>
          <span>Kenshiro Kasumi</span>
        </button>

        <button @click=${() => console.log('User: Hanako')}>
          <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--color-celadon-500); margin-right: 12px; flex-shrink: 0;"></div>
          <span>Muraoka Hanako</span>
        </button>

        <hr>

        <button style="color: var(--color-washi-400); font-style: italic;" @click=${() => console.log('Logout')}>
          Cerrar Sesión
        </button>
      </lib-dropdown>

    </div>
  `
};