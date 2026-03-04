import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-toast-manager.component';
import { LibToastManager } from './lib-toast-manager.component';

/**
 * El ToastManager es un Organismo encargado de orquestar la aparición y desaparición
 * de notificaciones efímeras. Debe existir una única instancia en el layout principal.
 */
const meta: Meta<LibToastManager> = {
  title: 'Organisms/ToastManager',
  component: 'lib-toast-manager',
};

export default meta;

type Story = StoryObj<LibToastManager>;

export const Playground: Story = {
  render: () => {
    // Función de ayuda para disparar toasts desde la Story
    const triggerToast = (type: 'success' | 'info' | 'warning' | 'error') => {
      const manager = document.querySelector('lib-toast-manager') as LibToastManager;
      if (manager) {
        manager.add({
          message: `Mensaje de ${type} generado a las ${new Date().toLocaleTimeString()}`,
          type: type,
          duration: 4000
        });
      }
    };

    return html`
      <div style="padding: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
        <button 
          @click="${() => triggerToast('success')}" 
          style="padding: 8px 16px; cursor: pointer; background: oklch(60% 0.15 150); color: white; border: none; border-radius: 4px;">
          Lanzar Éxito
        </button>
        
        <button 
          @click="${() => triggerToast('info')}" 
          style="padding: 8px 16px; cursor: pointer; background: oklch(60% 0.15 250); color: white; border: none; border-radius: 4px;">
          Lanzar Info
        </button>

        <button 
          @click="${() => triggerToast('warning')}" 
          style="padding: 8px 16px; cursor: pointer; background: oklch(60% 0.15 80); color: white; border: none; border-radius: 4px;">
          Lanzar Aviso
        </button>

        <button 
          @click="${() => triggerToast('error')}" 
          style="padding: 8px 16px; cursor: pointer; background: oklch(60% 0.15 30); color: white; border: none; border-radius: 4px;">
          Lanzar Error
        </button>

        <lib-toast-manager></lib-toast-manager>
      </div>
      
      <div style="margin-top: 100px; color: #666; font-size: 14px;">
        <p>💡 <strong>Tip de Arquitecto:</strong> Observa cómo los elementos se apilan 
        y se eliminan del DOM automáticamente tras 4 segundos.</p>
      </div>
    `;
  },
};