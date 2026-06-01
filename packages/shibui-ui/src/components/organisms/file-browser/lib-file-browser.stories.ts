import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './lib-file-browser.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import type { FsEntry, FileBrowserRowSize } from './lib-file-browser.types';

/* ── Args ── */
interface FileBrowserArgs {
  entries:     FsEntry[];
  currentPath: string;
  rowSize:     FileBrowserRowSize;
  loading:     boolean;
  error:       string | null;
}

/* ── Mock data: carpeta de proyecto realista ── */
const MOCK_ENTRIES: FsEntry[] = [
  { name: 'src',           path: 'C:\\proj\\src',           isDir: true,  extension: null,   size: null },
  { name: 'public',        path: 'C:\\proj\\public',        isDir: true,  extension: null,   size: null },
  { name: 'node_modules',  path: 'C:\\proj\\node_modules',  isDir: true,  extension: null,   size: null },
  { name: '.gitignore',    path: 'C:\\proj\\.gitignore',    isDir: false, extension: null,   size: 142 },
  { name: 'index.html',    path: 'C:\\proj\\index.html',    isDir: false, extension: 'html', size: 1840 },
  { name: 'logo.svg',      path: 'C:\\proj\\logo.svg',      isDir: false, extension: 'svg',  size: 5320 },
  { name: 'package.json',  path: 'C:\\proj\\package.json',  isDir: false, extension: 'json', size: 2310 },
  { name: 'README.md',     path: 'C:\\proj\\README.md',     isDir: false, extension: 'md',   size: 9620 },
  { name: 'vite.config.ts',path: 'C:\\proj\\vite.config.ts',isDir: false, extension: 'ts',   size: 780 },
  { name: 'screenshot.png',path: 'C:\\proj\\screenshot.png',isDir: false, extension: 'png',  size: 184320 },
];

/* ── Meta ── */
const meta: Meta<FileBrowserArgs> = {
  title:     'Desktop/Data/File Browser',
  component: 'lib-file-browser',
  tags:      ['autodocs'],

  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        component: `
**lib-file-browser** · Organismo · \`app/desktop\`

Explorador de ficheros de una carpeta. Lista entradas con icono, nombre y
tamaño; permite navegar (carpetas) o abrir (ficheros) emitiendo eventos.

**Datos puros** — como \`lib-git-graph\`, no sabe cómo obtener los datos:
recibe \`entries\` + \`current-path\` y emite eventos. En la app Tauri, la
capa React resuelve la navegación con \`invoke('list_dir')\`.

Katachi-aware: nombres, iconos y estados consumen tokens semánticos del
ancestro \`data-katachi\`.

\`\`\`html
<lib-file-browser
  .entries=\${entries}
  current-path="C:\\\\Users\\\\me"
  @ui-lib-file-navigate=\${(e) => load(e.detail.path)}
></lib-file-browser>
\`\`\`

**Eventos:** \`ui-lib-file-navigate\` · \`ui-lib-file-open\` · \`ui-lib-file-up\`
        `,
      },
    },
  },

  argTypes: {
    rowSize: { control: 'inline-radio', options: ['default', 'compact'], name: 'row-size' },
    loading: { control: 'boolean' },
    error:   { control: 'text' },
  },

  args: {
    entries:     MOCK_ENTRIES,
    currentPath: 'C:\\Users\\aborb\\proyectos\\shibui',
    rowSize:     'default',
    loading:     false,
    error:       null,
  },

  render: (args) => html`
    <div style="width: 420px; height: 360px; padding: var(--lib-space-md); border: 1px solid var(--border-subtle);">
      <lib-file-browser
        .entries=${args.entries}
        current-path=${args.currentPath}
        row-size=${args.rowSize}
        ?loading=${args.loading}
        .error=${args.error}
      ></lib-file-browser>
    </div>
  `,
};

export default meta;
type Story = StoryObj<FileBrowserArgs>;

/* ─────────────────────────────────────────────────────────────
   1. PLAYGROUND
───────────────────────────────────────────────────────────── */

/** Control de todos los parámetros con una carpeta de proyecto realista. */
export const Playground: Story = {};

/* ─────────────────────────────────────────────────────────────
   2. API
───────────────────────────────────────────────────────────── */

/** Densidad `compact`, pensada para un gadget del dashboard. */
export const Compact: Story = {
  name: 'Densidad compact',
  args: { rowSize: 'compact' },
  render: (args) => html`
    <div style="width: 280px; height: 320px; padding: var(--lib-space-sm); border: 1px solid var(--border-subtle);">
      <lib-file-browser
        .entries=${args.entries}
        current-path=${args.currentPath}
        row-size="compact"
      ></lib-file-browser>
    </div>
  `,
};

/** Estado de carga: spinner mientras se resuelve `list_dir`. */
export const Loading: Story = {
  name: 'Cargando',
  args: { loading: true },
};

/** Error de acceso (p.ej. permiso denegado). */
export const ErrorState: Story = {
  name: 'Error',
  args: { error: 'Acceso denegado: no se pudo leer el directorio.' },
};

/** Carpeta sin entradas. */
export const Empty: Story = {
  name: 'Carpeta vacía',
  args: { entries: [] },
};

/* ─────────────────────────────────────────────────────────────
   3. KATACHI — explorador en cada contexto estético
───────────────────────────────────────────────────────────── */

const _katachi = createKatachiStories<FileBrowserArgs>(() => html`
  <div style="
    width: 420px;
    height: 320px;
    padding: var(--lib-space-md);
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
  ">
    <lib-file-browser
      .entries=${MOCK_ENTRIES}
      current-path="C:\\Users\\aborb\\proyectos\\shibui"
      row-size="default"
    ></lib-file-browser>
  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ─────────────────────────────────────────────────────────────
   4. TESTS
───────────────────────────────────────────────────────────── */

/** Verifica que al hacer clic en una carpeta se emite ui-lib-file-navigate. */
export const TestNavigate: Story = {
  name: 'Test · navegar a carpeta emite evento',
  tags: ['test'],
  args: { entries: MOCK_ENTRIES },
  play: async ({ canvasElement }): Promise<void> => {
    const browser = canvasElement.querySelector('lib-file-browser');
    if (!browser) throw new Error('lib-file-browser no encontrado');

    let navigatedTo: string | null = null;
    browser.addEventListener('ui-lib-file-navigate', (e) => {
      navigatedTo = (e as CustomEvent<{ path: string }>).detail.path;
    });

    await customElements.whenDefined('lib-file-browser');
    await (browser as unknown as { updateComplete: Promise<unknown> }).updateComplete;

    // La primera fila es una carpeta (ordenadas primero).
    const firstRow = browser.shadowRoot?.querySelector('.fb-row[data-dir="true"]') as HTMLElement | null;
    firstRow?.click();

    if (navigatedTo === null) {
      throw new Error('No se emitió ui-lib-file-navigate al pulsar una carpeta');
    }
  },
};
