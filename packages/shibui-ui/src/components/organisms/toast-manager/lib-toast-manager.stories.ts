import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite'; // Cambiado a la base estable
import './lib-toast-manager.component';
import { LibToastManager } from './lib-toast-manager.component';

const meta: Meta<LibToastManager> = {
  title: 'Organisms/ToastManager',
  component: 'lib-toast-manager',
};

export default meta;

type Story = StoryObj<LibToastManager>;

export const Playground: Story = {
  render: (): TemplateResult => {
    const triggerToast = (type: 'success' | 'info' | 'warning' | 'error'): void => {
      // Cast explícito para que TS no se queje de que 'add' no existe en Element
      const manager = document.querySelector('lib-toast-manager') as LibToastManager | null;
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
        <button @click="${(): void => triggerToast('success')}">Lanzar Éxito</button>
        <button @click="${(): void => triggerToast('info')}">Lanzar Info</button>
        <button @click="${(): void => triggerToast('warning')}">Lanzar Aviso</button>
        <button @click="${(): void => triggerToast('error')}">Lanzar Error</button>

        <lib-toast-manager></lib-toast-manager>
      </div>
    `;
  },
};