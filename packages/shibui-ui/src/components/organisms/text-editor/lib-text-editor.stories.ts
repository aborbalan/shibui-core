import type { Meta, StoryObj }     from '@storybook/web-components-vite';
import { html }                    from 'lit';
import './lib-text-editor.component';
import { createKatachiStories }    from '../../../stories/katachi-stories.helper';
import type { EditorFile }         from './lib-text-editor.types';

/* ── Args ── */
interface TextEditorArgs {
  saving:   boolean;
  showOpen: boolean;
  readonly: boolean;
}

/* ── Datos de ejemplo ── */
const sampleFiles: EditorFile[] = [
  {
    id:       'file-ts',
    filename: 'main.ts',
    content:  `import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  override render() {
    return html\`<p>Hello, world!</p>\`;
  }
}`,
    dirty: false,
  },
  {
    id:       'file-config',
    filename: 'app.config.ts',
    content:  `export default {
  apiUrl:  'https://api.example.com',
  timeout: 5000,
  retries: 3,
};`,
    dirty: true,
  },
  {
    id:       'file-md',
    filename: 'README.md',
    content:  `# Mi Proyecto

Descripción del proyecto.

## Instalación

\`\`\`bash
pnpm install
\`\`\``,
    dirty: false,
  },
];

/* ── Meta ── */
const meta: Meta<TextEditorArgs> = {
  title:     'Desktop/Editor/Text Editor',
  component: 'lib-text-editor',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-text-editor** · Organism · \`app/editor\`

Editor de texto multi-fichero que combina \`lib-editor-toolbar\` y \`lib-tabs\`
en un organismo completo. Gestiona múltiples ficheros abiertos como pestañas
card. Cuando hay un solo fichero, la pestaña también es visible. La barra de
herramientas muestra el nombre del fichero activo y su estado de cambios.

El componente es **controlado**: el consumidor gestiona el estado de los
ficheros y reacciona a los eventos de cambio.

| Evento | Cuándo | Detail |
|---|---|---|
| \`ui-lib-text-editor-new\`        | Clic en "Nuevo"    | — |
| \`ui-lib-text-editor-open\`       | Clic en "Abrir"    | — |
| \`ui-lib-text-editor-save\`       | Clic en "Guardar"  | \`{ id, content }\` |
| \`ui-lib-text-editor-change\`     | El usuario escribe | \`{ id, content }\` |
| \`ui-lib-text-editor-tab-change\` | Cambio de pestaña  | \`{ id, prev }\` |
        `,
      },
    },
  },

  argTypes: {
    saving:   { control: 'boolean', description: 'Guardado en curso' },
    showOpen: { control: 'boolean', name: 'show-open', description: 'Muestra botón Abrir' },
    readonly: { control: 'boolean', description: 'Textarea de solo lectura' },
  },

  args: {
    saving:   false,
    showOpen: false,
    readonly: false,
  },

  render: (args) => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${sampleFiles}"
        active="file-ts"
        ?saving="${args.saving}"
        ?show-open="${args.showOpen}"
        ?readonly="${args.readonly}"
      ></lib-text-editor>
    </div>
  `,
};

export default meta;
type Story = StoryObj<TextEditorArgs>;

/* ─────────────────────────────────────────────────────────────
   STORIES
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros. */
export const Playground: Story = {};

/** Un solo fichero abierto — sin tabs adicionales. */
export const SingleFile: Story = {
  render: () => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${[sampleFiles[0]]}"
        active="file-ts"
      ></lib-text-editor>
    </div>
  `,
};

/** Tres ficheros abiertos con el segundo marcado como dirty. */
export const MultipleFiles: Story = {
  render: () => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${sampleFiles}"
        active="file-config"
        show-open
      ></lib-text-editor>
    </div>
  `,
};

/** Sin ficheros — empty state con placeholder. */
export const Empty: Story = {
  render: () => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${[]}"
        active=""
      ></lib-text-editor>
    </div>
  `,
};

/** Guardado en curso: spinner en toolbar y Save deshabilitado. */
export const Saving: Story = {
  render: () => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${[{ ...sampleFiles[0], dirty: true }]}"
        active="file-ts"
        saving
      ></lib-text-editor>
    </div>
  `,
};

/** Modo solo lectura — textarea deshabilitado. */
export const Readonly: Story = {
  render: () => html`
    <div style="width: 720px; height: 400px;">
      <lib-text-editor
        .files="${sampleFiles}"
        active="file-md"
        readonly
      ></lib-text-editor>
    </div>
  `,
};

/* ─────────────────────────────────────────────────────────────
   KATACHI — editor en cada contexto estético
───────────────────────────────────────────────────────────── */

const _katachi = createKatachiStories<TextEditorArgs>(() => html`
  <div style="width: 600px; height: 340px;">
    <lib-text-editor
      .files="${sampleFiles}"
      active="file-ts"
      show-open
    ></lib-text-editor>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;
