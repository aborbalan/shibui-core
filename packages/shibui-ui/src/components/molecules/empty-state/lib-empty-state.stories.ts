import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-empty-state.component';
import type { LibEmptyState } from './lib-empty-state.component';

type EmptyStateArgs = Pick<
  LibEmptyState,
  'heading' | 'description' | 'kanji' | 'tone' | 'layout' | 'size' | 'bordered' | 'ghost'
>;

const meta: Meta<EmptyStateArgs> = {
  title: 'Components/Molecules/EmptyState',
  component: 'lib-empty-state',
  argTypes: {
    tone:    { control: 'select', options: ['neutral', 'kaki', 'celadon', 'error'] },
    layout:  { control: 'select', options: ['default', 'inline'] },
    size:    { control: 'select', options: ['md', 'sm'] },
    bordered: { control: 'boolean' },
    ghost:    { control: 'boolean' },
    heading:     { control: 'text' },
    description: { control: 'text' },
    kanji:       { control: 'text' },
  },
  render: (args): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:300px; display:flex; align-items:center;">
      <lib-empty-state
        heading=${args.heading}
        description=${args.description}
        kanji=${args.kanji}
        tone=${args.tone}
        layout=${args.layout}
        size=${args.size}
        ?bordered=${args.bordered}
        ?ghost=${args.ghost}
      >
        <ph-folder-open slot="illustration" weight="regular"></ph-folder-open>
        <lib-button slot="actions" variant="primary">Subir archivo</lib-button>
        <lib-button slot="actions" variant="ghost">Ver tutorial</lib-button>
      </lib-empty-state>
    </div>
  `,
};

export default meta;
type Story = StoryObj<EmptyStateArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    heading: 'Esta carpeta está vacía',
    description: 'Todavía no hay ningún archivo aquí. Sube tu primer documento para empezar.',
    kanji: '', tone: 'neutral', layout: 'default', size: 'md',
    bordered: false, ghost: false,
  },
};

/* ── Anatomy: Default con icono ── */
export const DefaultWithIcon: Story = {
  name: 'Anatomía — Icono + título + desc + CTA',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:340px; display:flex; align-items:center;">
      <lib-empty-state
        heading="Esta carpeta está vacía"
        description="Todavía no hay ningún archivo aquí. Sube tu primer documento para empezar."
      >
        <ph-folder-open slot="illustration" weight="regular"></ph-folder-open>
        <lib-button slot="actions" variant="primary">
          <ph-upload-simple slot="prefix" weight="regular"></ph-upload-simple>
          Subir archivo
        </lib-button>
        <lib-button slot="actions" variant="ghost">Ver tutorial</lib-button>
      </lib-empty-state>
    </div>
  `,
};

/* ── Anatomy: Solo título ── */
export const MinimalHeadingOnly: Story = {
  name: 'Anatomía — Solo título',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:200px; display:flex; align-items:center;">
      <lib-empty-state heading="Nada por aquí" description="Cuando haya actividad, aparecerá en este espacio."></lib-empty-state>
    </div>
  `,
};

/* ── Anatomy: Kanji ── */
export const KanjiIllustration: Story = {
  name: 'Anatomía — Kanji como ilustración',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:340px; display:flex; align-items:center;">
      <lib-empty-state
        kanji="無"
        heading="Sin resultados"
        description="No hemos encontrado nada que coincida con tu búsqueda. Prueba con otros términos."
      >
        <lib-button slot="actions" variant="ghost">Limpiar filtros</lib-button>
      </lib-empty-state>
    </div>
  `,
};

/* ── Variants ── */
export const Bordered: Story = {
  name: 'Variant — Bordered (dropzone)',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:340px; display:flex; align-items:center;">
      <lib-empty-state
        bordered
        heading="Arrastra aquí tus archivos"
        description="O haz click para seleccionarlos. Formatos admitidos: PDF, PNG, JPG."
      >
        <ph-plus slot="illustration" weight="regular"></ph-plus>
        <lib-button slot="actions" variant="primary">Seleccionar archivos</lib-button>
      </lib-empty-state>
    </div>
  `,
};

export const Ghost: Story = {
  name: 'Variant — Ghost (sin chrome)',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); min-height:300px; display:flex; align-items:center;">
      <lib-empty-state
        ghost
        heading="Aún no hay mensajes"
        description="Cuando alguien te escriba, los mensajes aparecerán aquí."
      >
        <ph-chat-centered-dots slot="illustration" weight="thin"></ph-chat-centered-dots>
      </lib-empty-state>
    </div>
  `,
};

export const SizeSmall: Story = {
  name: 'Variant — SM (paneles secundarios)',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">

      <div style="width:240px; border:1px solid var(--border-subtle); background:var(--bg-elevated);">
        <div style="padding:12px 20px; border-bottom:1px solid var(--border-subtle);">
          <span style="font-family:var(--lib-font-mono); font-size:10px; letter-spacing:0.25em; color:var(--text-muted); text-transform:uppercase;">Favoritos</span>
        </div>
        <lib-empty-state size="sm" heading="Sin favoritos" description="Guarda componentes para acceder a ellos rápidamente.">
          <ph-heart slot="illustration" weight="regular"></ph-heart>
          <lib-button slot="actions" variant="ghost">Explorar</lib-button>
        </lib-empty-state>
      </div>

      <div style="width:240px; border:1px solid var(--border-subtle); background:var(--bg-elevated);">
        <div style="padding:12px 20px; border-bottom:1px solid var(--border-subtle);">
          <span style="font-family:var(--lib-font-mono); font-size:10px; letter-spacing:0.25em; color:var(--text-muted); text-transform:uppercase;">Notificaciones</span>
        </div>
        <lib-empty-state size="sm" heading="Todo al día" description="No tienes notificaciones pendientes.">
          <ph-bell-simple slot="illustration" weight="regular"></ph-bell-simple>
        </lib-empty-state>
      </div>

    </div>
  `,
};

/* ── Tones ── */
export const Tones: Story = {
  name: 'Tones — Neutral · Kaki · Celadón · Error',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle); display:flex; gap:24px; flex-wrap:wrap; align-items:flex-start;">

      <div style="flex:1; min-width:180px; max-width:220px;">
        <lib-empty-state size="sm" heading="Bandeja vacía" description="No hay elementos pendientes.">
          <ph-tray slot="illustration" weight="regular"></ph-tray>
        </lib-empty-state>
      </div>

      <div style="flex:1; min-width:180px; max-width:220px;">
        <lib-empty-state size="sm" tone="kaki" heading="Empieza aquí" description="Crea tu primer proyecto.">
          <ph-sparkle slot="illustration" weight="regular"></ph-sparkle>
          <lib-button slot="actions" variant="accent">Crear proyecto</lib-button>
        </lib-empty-state>
      </div>

      <div style="flex:1; min-width:180px; max-width:220px;">
        <lib-empty-state size="sm" tone="celadon" heading="Todo completado" description="No quedan tareas pendientes.">
          <ph-check-circle slot="illustration" weight="regular"></ph-check-circle>
        </lib-empty-state>
      </div>

      <div style="flex:1; min-width:180px; max-width:220px;">
        <lib-empty-state size="sm" tone="error" heading="Acceso restringido" description="No tienes permisos para ver este contenido.">
          <ph-lock-simple slot="illustration" weight="regular"></ph-lock-simple>
          <lib-button slot="actions" variant="danger">Solicitar acceso</lib-button>
        </lib-empty-state>
      </div>

    </div>
  `,
};

/* ── Inline ── */
export const InlineSearchEmpty: Story = {
  name: 'Inline — Sin resultados de búsqueda',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle);">
      <lib-empty-state
        layout="inline"
        bordered
        heading='Sin resultados para "kintsugi dark"'
        description="Prueba con otros términos o elimina algunos filtros."
      >
        <ph-magnifying-glass slot="illustration" weight="regular"></ph-magnifying-glass>
        <lib-button slot="actions" variant="ghost">Limpiar búsqueda</lib-button>
        <lib-button slot="actions" variant="ghost">Ver todo el catálogo</lib-button>
      </lib-empty-state>
    </div>
  `,
};

export const InlineTableRow: Story = {
  name: 'Inline — Fila vacía en tabla',
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--bg-surface); border:1px solid var(--border-subtle);">
      <div style="border:1px solid var(--border-subtle); background:var(--bg-elevated);">
        <div style="display:grid; grid-template-columns:repeat(4,1fr); padding:10px 20px; background:var(--bg-surface); border-bottom:1px solid var(--border-subtle);">
          ${['Nombre','Estado','Fecha','Acción'].map(h => html`
            <span style="font-family:var(--lib-font-mono); font-size:10px; letter-spacing:0.25em; color:var(--text-muted); text-transform:uppercase;">${h}</span>
          `)}
        </div>
        <lib-empty-state layout="inline" size="sm" heading="No hay registros" description="Cuando se añadan datos aparecerán aquí.">
          <ph-rows slot="illustration" weight="regular"></ph-rows>
          <lib-button slot="actions" variant="primary" size="sm">
            <ph-plus slot="prefix" weight="regular"></ph-plus>
            Añadir registro
          </lib-button>
        </lib-empty-state>
      </div>
    </div>
  `,
};

/* ── Context: dark surface ── */
export const DarkSurface: Story = {
  name: 'Contexto — Superficie oscura',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <div style="padding:40px; background:var(--color-washi-950); border:1px solid oklch(16% 0.02 45); min-height:340px; display:flex; align-items:center;">
      <lib-empty-state heading="Sin actividad nocturna" description="No se ha registrado ningún evento entre las 23:00 y las 08:00 en los últimos 7 días.">
        <ph-moon-stars slot="illustration" weight="regular"></ph-moon-stars>
        <lib-button slot="actions" variant="ghost">Cambiar rango</lib-button>
      </lib-empty-state>
    </div>
  `,
};