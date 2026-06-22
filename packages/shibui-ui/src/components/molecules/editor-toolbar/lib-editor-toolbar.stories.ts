import type { Meta, StoryObj }     from '@storybook/web-components-vite';
import { html }                    from 'lit';
import './lib-editor-toolbar.component';
import { createKatachiStories }    from '../../../stories/katachi-stories.helper';

/* ── Args ── */
interface EditorToolbarArgs {
  filename:  string;
  dirty:     boolean;
  saving:    boolean;
  showOpen:  boolean;
  ariaLabel: string;
}

/* ── Meta ── */
const meta: Meta<EditorToolbarArgs> = {
  title:     'Desktop/Editor/Editor Toolbar',
  component: 'lib-editor-toolbar',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-editor-toolbar** · Molecule · \`app/editor\`

Barra de acciones para un editor de ficheros. Gestiona el ciclo de
vida básico del fichero activo: nuevo, abrir (opcional), guardar.

Muestra el nombre del fichero activo y un punto indicador cuando hay
cambios sin guardar (\`dirty\`). Durante un guardado en curso (\`saving\`),
el botón Save muestra un spinner y se deshabilita.

Dispara eventos personalizados para que el consumidor gestione la
integración con el sistema de ficheros (nativa vía Tauri, Web File API, etc.).

| Evento | Cuándo |
|---|---|
| \`ui-lib-editor-toolbar-new\` | Clic en "Nuevo" |
| \`ui-lib-editor-toolbar-open\` | Clic en "Abrir" (requiere \`show-open\`) |
| \`ui-lib-editor-toolbar-save\` | Clic en "Guardar" |
        `,
      },
    },
  },

  argTypes: {
    filename:  { control: 'text',    description: 'Nombre del fichero activo (null → "Sin título")' },
    dirty:     { control: 'boolean', description: 'Cambios sin guardar' },
    saving:    { control: 'boolean', description: 'Guardado en curso' },
    showOpen:  { control: 'boolean', name: 'show-open', description: 'Muestra botón Abrir' },
    ariaLabel: { control: 'text', name: 'aria-label', description: 'Nombre accesible del role="toolbar" (default: "Acciones del editor")' },
  },

  args: {
    filename:  'main.ts',
    dirty:     false,
    saving:    false,
    showOpen:  false,
    ariaLabel: 'Acciones del editor',
  },

  render: (args) => html`
    <div style="width: 480px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <lib-editor-toolbar
        filename=${args.filename}
        ?dirty=${args.dirty}
        ?saving=${args.saving}
        ?show-open=${args.showOpen}
        aria-label=${args.ariaLabel}
      ></lib-editor-toolbar>
      <div style="
        padding: var(--lib-space-lg);
        background: var(--bg-base);
        min-height: 80px;
        font-family: var(--font-mono, monospace);
        font-size: 0.8rem;
        color: var(--text-muted);
        border-radius: 0 0 var(--radius-md) var(--radius-md);
      ">
        // contenido del editor…
      </div>
    </div>
  `,
};

export default meta;
type Story = StoryObj<EditorToolbarArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/** Fichero limpio, sin cambios pendientes. */
export const Clean: Story = {
  args: { filename: 'index.html', dirty: false, saving: false, showOpen: false },
};

/** Fichero con cambios sin guardar. */
export const Dirty: Story = {
  args: { filename: 'app.config.ts', dirty: true, saving: false, showOpen: false },
};

/** Estado de guardado en curso. */
export const Saving: Story = {
  args: { filename: 'README.md', dirty: true, saving: true, showOpen: false },
};

/** Sin título — sin fichero activo. */
export const Untitled: Story = {
  args: { filename: '', dirty: true, saving: false, showOpen: false },
  render: (args) => html`
    <div style="width: 480px; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <lib-editor-toolbar
        .filename=${null}
        ?dirty=${args.dirty}
        ?saving=${args.saving}
        ?show-open=${args.showOpen}
      ></lib-editor-toolbar>
    </div>
  `,
};

/** Con botón "Abrir" visible (integración con File API / Tauri). */
export const WithOpenButton: Story = {
  args: { filename: 'script.js', dirty: false, saving: false, showOpen: true },
};

/** Nombre de fichero largo con truncado por ellipsis. */
export const LongFilename: Story = {
  args: {
    filename:  'very-long-project-name/src/components/feature-x/implementation.component.ts',
    dirty:     true,
    saving:    false,
    showOpen:  true,
  },
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — toolbar en cada contexto estético
───────────────────────────────────────────────────────────── */

const _katachi = createKatachiStories<EditorToolbarArgs>(() => html`
  <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);padding:var(--lib-space-md);">
    <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <lib-editor-toolbar filename="index.html" show-open></lib-editor-toolbar>
      <div style="padding:var(--lib-space-md);background:var(--bg-base);min-height:40px;font-family:var(--font-mono,monospace);font-size:0.8rem;color:var(--text-muted);border-radius:0 0 var(--radius-md) var(--radius-md);">// limpio</div>
    </div>
    <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <lib-editor-toolbar filename="main.ts" dirty show-open></lib-editor-toolbar>
      <div style="padding:var(--lib-space-md);background:var(--bg-base);min-height:40px;font-family:var(--font-mono,monospace);font-size:0.8rem;color:var(--text-muted);border-radius:0 0 var(--radius-md) var(--radius-md);">// dirty</div>
    </div>
    <div style="border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
      <lib-editor-toolbar filename="styles.css" dirty saving></lib-editor-toolbar>
      <div style="padding:var(--lib-space-md);background:var(--bg-base);min-height:40px;font-family:var(--font-mono,monospace);font-size:0.8rem;color:var(--text-muted);border-radius:0 0 var(--radius-md) var(--radius-md);">// saving…</div>
    </div>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
