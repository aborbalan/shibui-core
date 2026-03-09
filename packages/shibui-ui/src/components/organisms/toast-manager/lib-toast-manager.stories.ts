import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-toast-manager.component';
import type { LibToastManager } from './lib-toast-manager.component';

const meta: Meta = {
  title: 'Components/Organisms/ToastManager',
  component: 'lib-toast-manager',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Contenedor fijo de notificaciones efímeras. Usa \`lib-alert\` internamente.

**API pública:**
- \`manager.add({ type, message, heading?, duration? })\` — añade un toast
- \`manager.dismiss(id)\` — descarta por id
- \`manager.dismissAll()\` — descarta todos

El \`duration\` en ms controla el auto-dismiss (default 5000ms). \`duration: 0\` lo hace persistente.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/* Helper — obtiene la instancia del manager en el DOM de la story */
function getManager(): LibToastManager | null {
  return document.querySelector('lib-toast-manager') as LibToastManager | null;
}

/* ─────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────── */
export const Playground: Story = {
  name: 'Playground',
  render: (): TemplateResult => html`
    <div style="
      padding: 48px 40px;
      min-height: 300px;
      background: var(--bg-surface);
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    ">
      <p style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
        Lanza notificaciones →
      </p>

      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-celadon-500); color: white; border: none; cursor: pointer;"
          @click="${(): void => { getManager()?.add({ type: 'info', message: 'Componente actualizado. Revisa el changelog.', duration: 5000 }); }}"
        >Info</button>

        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-success); color: white; border: none; cursor: pointer;"
          @click="${(): void => { getManager()?.add({ type: 'success', message: 'Cambios guardados correctamente.', duration: 4000 }); }}"
        >Success</button>

        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-warning); color: white; border: none; cursor: pointer;"
          @click="${(): void => { getManager()?.add({ type: 'warning', message: 'Esta acción puede tener efectos secundarios.', duration: 6000 }); }}"
        >Warning</button>

        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-error); color: white; border: none; cursor: pointer;"
          @click="${(): void => { getManager()?.add({ type: 'error', message: 'No se pudo completar la operación.', duration: 7000 }); }}"
        >Error</button>

        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: var(--color-washi-900); color: var(--color-washi-50); border: none; cursor: pointer;"
          @click="${(): void => {
            getManager()?.add({
              type: 'warning',
              heading: 'Sesión a punto de expirar',
              message: 'Guarda tu trabajo. Tu sesión expira en 5 minutos.',
              duration: 0,   /* persistente */
            });
          }}"
        >Persistente</button>

        <button
          style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 16px; background: transparent; color: var(--text-secondary); border: 1px solid var(--border-default); cursor: pointer;"
          @click="${(): void => { getManager()?.dismissAll(); }}"
        >Descartar todos</button>
      </div>
    </div>

    <lib-toast-manager></lib-toast-manager>
  `,
};

/* ─────────────────────────────────────────────────────────
   ALL TYPES — todos visibles a la vez (duration: 0)
───────────────────────────────────────────────────────── */
export const AllTypes: Story = {
  name: 'All Types — visible simultáneamente',
  render: (): TemplateResult => html`
    <div
      style="min-height: 400px; background: var(--bg-surface);"
      @lit-ready="${(e: Event): void => {
        const root = (e.currentTarget as HTMLElement);
        /* Pequeño delay para que el DOM esté listo */
        setTimeout((): void => {
          const manager = root.querySelector('lib-toast-manager') as LibToastManager | null;
          manager?.add({ type: 'info',    message: 'The component has been updated. Review the changelog for details.', duration: 0 });
          manager?.add({ type: 'success', message: 'Changes saved. Your preferences have been updated.', duration: 0 });
          manager?.add({ type: 'warning', message: 'This action may have unintended side effects.', duration: 0 });
          manager?.add({ type: 'error',   message: 'Unable to complete the request. Try again.', duration: 0 });
        }, 50);
      }}"
    >
      <lib-toast-manager></lib-toast-manager>
    </div>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const manager = canvasElement.querySelector('lib-toast-manager') as LibToastManager | null;
    if (!manager) return;
    manager.add({ type: 'info',    message: 'The component has been updated. Review the changelog for details.', duration: 0 });
    manager.add({ type: 'success', message: 'Changes saved. Your preferences have been updated.', duration: 0 });
    manager.add({ type: 'warning', message: 'This action may have unintended side effects.', duration: 0 });
    manager.add({ type: 'error',   message: 'Unable to complete the request. Try again.', duration: 0 });
  },
};

/* ─────────────────────────────────────────────────────────
   HEADING OVERRIDE
───────────────────────────────────────────────────────── */
export const HeadingOverride: Story = {
  name: 'Heading override',
  play: async ({ canvasElement }): Promise<void> => {
    const manager = canvasElement.querySelector('lib-toast-manager') as LibToastManager | null;
    if (!manager) return;
    manager.add({
      type: 'error',
      heading: 'Límite de almacenamiento alcanzado',
      message: 'Has usado 98 GB de 100 GB. Amplía tu plan.',
      duration: 0,
    });
    manager.add({
      type: 'success',
      heading: '完了 — Exportación completada',
      message: 'El fichero está disponible en tu carpeta de descargas.',
      duration: 0,
    });
  },
  render: (): TemplateResult => html`
    <div style="min-height: 300px; background: var(--bg-surface);">
      <lib-toast-manager></lib-toast-manager>
    </div>
  `,
};