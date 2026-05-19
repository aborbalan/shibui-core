import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-alert.component';

interface AlertArgs {
  type:     'default' | 'info' | 'warning' | 'error' | 'success';
  heading:  string;
  closable: boolean;
  glass:    boolean;
  content:  string;
}

const meta: Meta<AlertArgs> = {
  title: 'Feedback/Alert',
  tags:['autodocs'],
  component: 'lib-alert',
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'info', 'warning', 'error', 'success'],
      description: 'Variante semántica',
    },
    heading:  { control: 'text',    description: 'Override del título. Si está vacío usa el nombre del tipo.' },
    closable: { control: 'boolean', description: 'Muestra botón de cierre' },
    glass:    { control: 'boolean', description: 'Efecto Agua (glassmorphism)' },
    content:  { control: 'text',    name: 'Slot content' },
  },
  parameters: {
    actions: { handles: ['ui-lib-alert-close'] },
  },
};

export default meta;
type Story = StoryObj<AlertArgs>;

/* ─────────────────────────────────────────────────────────
   PLAYGROUND
───────────────────────────────────────────────────────── */
export const Playground: Story = {
  args: {
    type:     'info',
    heading:  '',
    closable: true,
    glass:    false,
    content:  'The component has been updated. Review the changelog for details.',
  },
  render: (args): TemplateResult => html`
    <div style="padding: 32px; max-width: 600px;">
      <lib-alert
        type="${args.type}"
        heading="${args.heading}"
        ?closable="${args.closable}"
        ?glass="${args.glass}"
      >${args.content}</lib-alert>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   TODOS LOS TIPOS
───────────────────────────────────────────────────────── */
export const AllTypes: Story = {
  name: 'All Types — Default · Info · Warning · Error · Success',
  render: (): TemplateResult => html`
    <div style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 40px;
      background: var(--bg-elevated);
      max-width: 700px;
    ">
      <lib-alert type="default">
        A neutral message for informational content without strong urgency.
      </lib-alert>
      <lib-alert type="info">
        The component has been updated. Review the changelog for details.
      </lib-alert>
      <lib-alert type="warning">
        This action may have unintended side effects. Proceed with caution.
      </lib-alert>
      <lib-alert type="error">
        Unable to complete the request. Please check your input and try again.
      </lib-alert>
      <lib-alert type="success">
        Changes saved. Your preferences have been updated successfully.
      </lib-alert>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   CLOSABLE
───────────────────────────────────────────────────────── */
export const Closable: Story = {
  name: 'Closable — con botón de cierre',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 40px; max-width: 600px; background: var(--bg-elevated);">
      <lib-alert type="info" closable>
        The component has been updated. Review the changelog for details.
      </lib-alert>
      <lib-alert type="warning" closable>
        This action may have unintended side effects. Proceed with caution.
      </lib-alert>
      <lib-alert type="error" closable>
        Unable to complete the request. Please check your input and try again.
      </lib-alert>
      <lib-alert type="success" closable>
        Changes saved. Your preferences have been updated successfully.
      </lib-alert>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   HEADING OVERRIDE
───────────────────────────────────────────────────────── */
export const HeadingOverride: Story = {
  name: 'Heading override',
  render: (): TemplateResult => html`
    <div style="display: flex; flex-direction: column; gap: 12px; padding: 40px; max-width: 600px; background: var(--bg-elevated);">
      <lib-alert type="error" heading="Límite de almacenamiento alcanzado" closable>
        Has utilizado 98 GB de 100 GB disponibles. Amplía tu plan para continuar subiendo archivos.
      </lib-alert>
      <lib-alert type="success" heading="Cambios guardados">
        Tus preferencias de notificaciones se han actualizado correctamente.
      </lib-alert>
      <lib-alert type="warning" heading="Sesión a punto de expirar">
        Tu sesión expirará en 5 minutos. Guarda tu trabajo para no perder los cambios.
      </lib-alert>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   GLASS — Efecto Agua
───────────────────────────────────────────────────────── */
export const Glass: Story = {
  name: 'Glass — Efecto Agua',
  parameters: {
    backgrounds: { default: 'gradient' },
  },
  render: (): TemplateResult => html`
    <div style="
      background: linear-gradient(135deg, #0f1923 0%, #1a2535 50%, #0d1f2d 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 600px;
    ">
      <lib-alert type="info" glass closable>
        The component has been updated. Review the changelog for details.
      </lib-alert>
      <lib-alert type="warning" glass>
        This action may have unintended side effects. Proceed with caution.
      </lib-alert>
      <lib-alert type="error" glass closable>
        Unable to complete the request. Please check your input and try again.
      </lib-alert>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────
   CONTEXTO — en un formulario
───────────────────────────────────────────────────────── */
export const FormContext: Story = {
  name: 'Context — en formulario',
  render: (): TemplateResult => html`
    <div style="
      max-width: 480px;
      padding: 40px;
      background: var(--bg-surface);
      display: flex;
      flex-direction: column;
      gap: 20px;
    ">
      <lib-alert type="warning" closable>
        Estás editando un registro en uso por otro usuario. Los cambios podrían sobreescribirse.
      </lib-alert>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        <label style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-secondary);">Nombre del proyecto</label>
        <input style="font-family: var(--font-body); font-size: 15px; padding: 8px 12px; border: 1px solid var(--border-default); background: var(--bg-elevated); outline: none; color: var(--text-primary);" type="text" value="Shibui v0.1" />
      </div>

      <lib-alert type="error">
        El nombre ya está en uso. Elige un identificador distinto.
      </lib-alert>
    </div>
  `,
};
/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Contextos estéticos
   ═══════════════════════════════════════════════════════════════ */

const katachiList = [
  { id: 'wabi',     kanji: '侘', label: 'wabi · 侘び' },
  { id: 'kintsugi', kanji: '金', label: 'kintsugi · 金継ぎ' },
  { id: 'sabi',     kanji: '寂', label: 'sabi · 寂び' },
  { id: 'terminal', kanji: '>_', label: 'terminal' },
  { id: 'shizen',   kanji: '自', label: 'shizen · 自然' },
  { id: 'celadon',  kanji: '青', label: 'celadon · 青磁' },
] as const;

export const KatachiContexts: Story = {
  name: 'Katachi · 6 contexts',
  render: (): TemplateResult => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:var(--lib-space-xl);padding:var(--lib-space-xl);background:var(--color-washi-100);">
      ${katachiList.map(k => html`
        <section data-katachi="${k.id}" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
          <header style="font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
            <strong style="font-family:'Shippori Mincho',serif;font-size:1.3rem;color:var(--katachi-accent,inherit);">${k.kanji}</strong>&nbsp;${k.label}
          </header>
          <lib-alert type="default" heading="Notification">
            La superficie y el texto se adaptan al katachi vía tokens semánticos (--bg-surface, --text-secondary).
          </lib-alert>
        </section>
      `)}
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};

export const KatachiSemanticStatesPreserved: Story = {
  name: 'Katachi · semantic states unchanged',
  render: (): TemplateResult => html`
    <div style="padding:var(--lib-space-xl);background:var(--color-washi-100);display:flex;flex-direction:column;gap:var(--lib-space-md);">
      <header style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text-muted);">
        Bajo data-katachi="kintsugi" — los tipos de feedback semánticos mantienen su paleta deliberada
      </header>
      <section data-katachi="kintsugi" style="padding:var(--lib-space-lg);display:flex;flex-direction:column;gap:var(--lib-space-md);background:var(--bg-base);">
        <lib-alert type="info"    heading="Info">Información neutra que respeta el katachi.</lib-alert>
        <lib-alert type="success" heading="Success">Verde semántico se mantiene — la semántica gana sobre estética.</lib-alert>
        <lib-alert type="warning" heading="Warning">Amarillo semántico se mantiene.</lib-alert>
        <lib-alert type="error"   heading="Error">Rojo semántico se mantiene.</lib-alert>
      </section>
    </div>
  `,
  parameters: { layout: 'fullscreen' },
};
