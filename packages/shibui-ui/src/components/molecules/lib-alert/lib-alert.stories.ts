import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-alert.component';
import { LibAlert } from './lib-alert.component';

/**
 * Las Alertas se utilizan para proporcionar feedback contextual al usuario 
 * dentro del flujo de la interfaz. A diferencia de los Toasts, son estáticas 
 * y pertenecen a una sección específica del layout.
 */
const meta: Meta<LibAlert> = {
  title: 'Feedback/Alert',
  component: 'lib-alert',
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error'],
      description: 'Define la intención visual y el icono de la alerta',
    },
    glass: {
      control: 'boolean',
      description: 'Aplica un efecto de desenfoque de fondo (Glassmorphism)',
    },
    closable: {
      control: 'boolean',
      description: 'Muestra un botón de cierre que emite el evento lib-alert-close',
    },
  },
  args: {
    type: 'info',
    glass: false,
    closable: true,
  },
  parameters: {
    actions: {
      handles: ['lib-alert-close'],
    },
  },
};

export default meta;
type Story = StoryObj<LibAlert & { content: string }>;

export const Default: Story = {
  args: {
    content: 'Este es un mensaje informativo para el usuario.',
  },
  render: (args) => html`
    <lib-alert 
      type="${args.type}" 
      ?glass="${args.glass}" 
      ?closable="${args.closable}"
    >
      ${args.content}
    </lib-alert>
  `,
};

export const Success: Story = {
  args: {
    type: 'success',
    content: 'La operación se ha completado correctamente.',
  },
  render: (args) => html`
    <lib-alert type="${args.type}" ?closable="${args.closable}">
      ${args.content}
    </lib-alert>
  `,
};

export const GlassMode: Story = {
  args: {
    type: 'info',
    glass: true,
    content: 'Alerta con efecto glassmorphism sobre un fondo con color.',
  },
  render: (args) => html`
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 12px;">
      <lib-alert type="${args.type}" ?glass="${args.glass}">
        ${args.content}
      </lib-alert>
    </div>
  `,
};

export const MultiLine: Story = {
  args: {
    type: 'warning',
    content: 'Atención: Esta acción es irreversible. Asegúrese de haber realizado una copia de seguridad de todos sus datos antes de proceder con el borrado del servidor.',
  },
  render: (args) => html`
    <div style="max-width: 400px;">
      <lib-alert type="${args.type}" ?closable="${args.closable}">
        ${args.content}
      </lib-alert>
    </div>
  `,
};