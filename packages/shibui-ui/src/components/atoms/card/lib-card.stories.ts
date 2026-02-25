import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-card.component';
// Importamos otros componentes para vitaminar la historia
import '../../atoms/button/lib-button.component'; 

const meta: Meta = {
  title: 'Surfaces/Card',
  component: 'lib-card',
};

export default meta;

export const Default: StoryObj = {
  render: () => html`
    <lib-card>
      <h2 slot="header">Título de la Tarjeta</h2>
      <p>Este es el contenido principal de la tarjeta. Puedes meter cualquier cosa aquí dentro gracias al slot por defecto.</p>
    </lib-card>
  `,
};

export const WithInteractiveContent: StoryObj = {
  render: () => html`
    <lib-card>
      <h3 slot="header" style="margin: 0; font-family: var(--lib-font-family);">Configuración de Usuario</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <p style="margin: 0; font-family: var(--lib-font-family); color: var(--lib-color-neutral-40);">
          Gestiona los permisos y la visibilidad de tu perfil público.
        </p>
        <div style="display: flex; gap: 8px;">
          <lib-button variant="primary">Guardar cambios</lib-button>
          <lib-button variant="secondary">Cancelar</lib-button>
        </div>
      </div>
    </lib-card>
  `,
};

export const Empty: StoryObj = {
  render: () => html`
    <lib-card>
      <p>Una tarjeta simple sin header, solo con contenido base.</p>
    </lib-card>
  `,
};