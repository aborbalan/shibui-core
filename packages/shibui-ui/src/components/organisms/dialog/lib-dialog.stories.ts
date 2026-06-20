import { html, TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import './lib-dialog.component';
import type { LibDialog } from './lib-dialog.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';

/* ── Helper — abre el dialog por id ── */
const open = (id: string): void => {
  const el = document.getElementById(id) as LibDialog | null;
  el?.show();
};

type DialogStoryArgs = Pick<
  LibDialog,
  'eyebrow' | 'dlgTitle' | 'tone' | 'surface' | 'size' | 'layout' | 'footerMeta'
>;

const meta: Meta<DialogStoryArgs> = {
  title: 'Universal/Overlay/Dialog',
  tags:['autodocs'],
  component: 'lib-dialog',
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'error', 'warning'],
    },
    surface: {
      control: 'select',
      options: ['default', 'dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    layout: {
      control: 'select',
      options: ['dialog', 'drawer-right', 'drawer-bottom', 'alert'],
    },
  },
};

export default meta;
type Story = StoryObj<DialogStoryArgs>;

/* ── Playground ── */
export const Playground: Story = {
  args: {
    eyebrow:    'Confirmación',
    dlgTitle:   'Guardar cambios',
    tone:       'default',
    surface:    'default',
    size:       'md',
    layout:     'dialog',
    footerMeta: 'v0.1.0',
  },
  render: (args: DialogStoryArgs): TemplateResult => html`
    <lib-button @click="${(): void => open('dlg-playground')}">Abrir dialog</lib-button>

    <lib-dialog
      id="dlg-playground"
      eyebrow="${args.eyebrow}"
      dlg-title="${args.dlgTitle}"
      tone="${args.tone}"
      surface="${args.surface}"
      size="${args.size}"
      layout="${args.layout}"
      footer-meta="${args.footerMeta}"
      @ui-lib-dialog-close="${(): void => console.log('closed')}"
    >
      <p>Los cambios realizados se guardarán permanentemente. Esta acción no puede deshacerse parcialmente.</p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => {
            const d = document.getElementById('dlg-playground') as LibDialog;
            d?.close();
          }}">Cancelar</lib-button>
        <lib-button variant="solid"
          @click="${(): void => {
            const d = document.getElementById('dlg-playground') as LibDialog;
            d?.close();
          }}">Guardar</lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Default / Confirm ── */
export const Default: Story = {
  name: 'Default — Confirm',
  render: (): TemplateResult => html`
    <lib-button @click="${(): void => open('dlg-confirm')}">Abrir confirm</lib-button>

    <lib-dialog
      id="dlg-confirm"
      eyebrow="Confirmación"
      dlg-title="¿Guardar cambios?"
      size="md"
      footer-meta="v0.1.0 · 43 tokens"
    >
      <p>Los cambios realizados en este componente se guardarán permanentemente en el sistema de diseño.</p>
      <p>Se actualizarán los tokens afectados y todos los componentes que los consuman reflejarán el cambio.</p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-confirm') as LibDialog)?.close(); }}">
          Cancelar
        </lib-button>
        <lib-button variant="solid"
          @click="${(): void => { (document.getElementById('dlg-confirm') as LibDialog)?.close(); }}">
          Guardar
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Form ── */
export const FormDialog: Story = {
  name: 'Form',
  render: (): TemplateResult => html`
    <lib-button @click="${(): void => open('dlg-form')}">Nuevo componente</lib-button>

    <lib-dialog
      id="dlg-form"
      eyebrow="Nuevo componente"
      dlg-title="Añadir al sistema"
      size="md"
    >
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">
        <lib-input label="Nombre del componente" placeholder="e.g. Popover"></lib-input>
        <lib-input label="Categoría" placeholder="e.g. Molecules"></lib-input>
        <lib-input label="Descripción" type="textarea" placeholder="Describe brevemente el propósito…"></lib-input>
      </div>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-form') as LibDialog)?.close(); }}">
          Cancelar
        </lib-button>
        <lib-button tone="accent"
          @click="${(): void => { (document.getElementById('dlg-form') as LibDialog)?.close(); }}">
          Crear
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Danger ── */
export const Danger: Story = {
  render: (): TemplateResult => html`
    <lib-button tone="error" @click="${(): void => open('dlg-danger')}">Eliminar componente</lib-button>

    <lib-dialog
      id="dlg-danger"
      eyebrow="Acción irreversible"
      dlg-title="Eliminar componente"
      tone="error"
      size="sm"
      layout="alert"
    >
      <p>Se eliminará <strong>Button Liquid #41</strong> del sistema. Todos los usos en producción quedarán sin referencia.</p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-danger') as LibDialog)?.close(); }}">
          Cancelar
        </lib-button>
        <lib-button tone="error"
          @click="${(): void => { (document.getElementById('dlg-danger') as LibDialog)?.close(); }}">
          Eliminar
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Warning ── */
export const Warning: Story = {
  render: (): TemplateResult => html`
    <lib-button variant="outlined" @click="${(): void => open('dlg-warning')}">Cambios sin guardar</lib-button>

    <lib-dialog
      id="dlg-warning"
      eyebrow="Aviso"
      dlg-title="Cambios sin guardar"
      tone="warning"
      size="sm"
      layout="alert"
    >
      <p>Tienes cambios pendientes que no se han guardado. Si cierras ahora, se perderán.</p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-warning') as LibDialog)?.close(); }}">
          Descartar
        </lib-button>
        <lib-button variant="solid"
          @click="${(): void => { (document.getElementById('dlg-warning') as LibDialog)?.close(); }}">
          Guardar y salir
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Dark / Kintsugi ── */
export const Dark: Story = {
  name: 'Dark — Kintsugi',
  parameters: { backgrounds: { default: 'dark' } },
  render: (): TemplateResult => html`
    <lib-button ?glass="${true}" variant="solid" @click="${(): void => open('dlg-dark')}">
      Kintsugi dialog
    </lib-button>

    <lib-dialog
      id="dlg-dark"
      eyebrow="Design System · Shibui"
      dlg-title="Kintsugi 暗い"
      surface="dark"
      size="md"
      footer-meta="暗い · dark surface"
    >
      <p>El modo kintsugi aplica la paleta oscura del sistema. Los tokens semánticos se invierten — washi-950 como superficie, kaki-400 como acento.</p>
      <hr style="border:none;border-top:1px solid oklch(16% 0.02 45);margin:var(--lib-space-lg) 0;">
      <lib-input label="Token de referencia" placeholder="var(--color-kaki-400)"></lib-input>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-dark') as LibDialog)?.close(); }}">
          Cerrar
        </lib-button>
        <lib-button tone="accent"
          @click="${(): void => { (document.getElementById('dlg-dark') as LibDialog)?.close(); }}">
          Aplicar
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Drawer right ── */
export const DrawerRight: Story = {
  name: 'Drawer — Right',
  render: (): TemplateResult => html`
    <lib-button variant="outlined" @click="${(): void => open('dlg-drawer')}">Panel lateral</lib-button>

    <lib-dialog
      id="dlg-drawer"
      eyebrow="Panel lateral"
      dlg-title="Propiedades"
      size="sm"
      layout="drawer-right"
      style="--dlg-width:360px"
    >
      <div style="display:flex;flex-direction:column;gap:var(--lib-space-md);">
        <lib-input label="Nombre" value="Button Liquid"></lib-input>
        <lib-input label="Versión" value="0.2.0"></lib-input>
        <lib-input label="Categoría" value="Effects"></lib-input>
      </div>
      <hr style="border:none;border-top:1px solid var(--border-subtle);margin:var(--lib-space-lg) 0;">
      <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
        Modifica las propiedades del componente y presiona <em>Aplicar</em> para propagar los cambios.
      </p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-drawer') as LibDialog)?.close(); }}">
          Cancelar
        </lib-button>
        <lib-button variant="solid"
          @click="${(): void => { (document.getElementById('dlg-drawer') as LibDialog)?.close(); }}">
          Aplicar
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── Drawer bottom ── */
export const DrawerBottom: Story = {
  name: 'Drawer — Bottom',
  render: (): TemplateResult => html`
    <lib-button variant="outlined" @click="${(): void => open('dlg-bottom')}">Sheet inferior</lib-button>

    <lib-dialog
      id="dlg-bottom"
      eyebrow="Opciones"
      dlg-title="Acciones del componente"
      size="md"
      layout="drawer-bottom"
    >
      <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
        Selecciona una acción para continuar con el componente seleccionado.
      </p>

      <div slot="footer">
        <lib-button variant="ghost"
          @click="${(): void => { (document.getElementById('dlg-bottom') as LibDialog)?.close(); }}">
          Cancelar
        </lib-button>
        <lib-button variant="solid"
          @click="${(): void => { (document.getElementById('dlg-bottom') as LibDialog)?.close(); }}">
          Confirmar
        </lib-button>
      </div>
    </lib-dialog>
  `,
};

/* ── All sizes ── */
export const Sizes: Story = {
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-md);">
      ${(['sm', 'md', 'lg', 'xl'] as const).map(s => html`
        <lib-button variant="outlined" @click="${(): void => open(`dlg-size-${s}`)}">
          ${s.toUpperCase()}
        </lib-button>

        <lib-dialog
          id="dlg-size-${s}"
          eyebrow="${s} · ${s === 'sm' ? '400' : s === 'md' ? '540' : s === 'lg' ? '720' : '960'}px"
          dlg-title="${s === 'sm' ? 'Confirmación simple' : s === 'md' ? 'Formulario estándar' : s === 'lg' ? 'Contenido enriquecido' : 'Editor de pantalla'}"
          size="${s}"
        >
          <p>El tamaño ${s} está pensado para ${
            s === 'sm' ? 'alertas y confirmaciones de una sola acción.' :
            s === 'md' ? 'formularios con 2-4 campos y confirmaciones.' :
            s === 'lg' ? 'documentación, vistas previas y formularios complejos.' :
            'editores, configuradores visuales y comparadores.'
          }</p>

          <div slot="footer">
            <lib-button variant="ghost"
              @click="${(): void => { (document.getElementById(`dlg-size-${s}`) as LibDialog)?.close(); }}">
              Cerrar
            </lib-button>
            <lib-button variant="solid"
              @click="${(): void => { (document.getElementById(`dlg-size-${s}`) as LibDialog)?.close(); }}">
              Confirmar
            </lib-button>
          </div>
        </lib-dialog>
      `)}
    </div>
  `,
};

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-dialog usa tokens semánticos de superficie y borde
   (bg-base, border-subtle, text-primary) — adapta al katachi.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="padding:var(--lib-space-lg);background:var(--bg-base);border:1px solid var(--border-subtle);display:flex;flex-direction:column;gap:var(--lib-space-md);">

    <!-- Variant badges showing the available variants -->
    <div style="display:flex;gap:var(--lib-space-sm);flex-wrap:wrap;">
      ${(['default', 'error', 'warning', 'dark'] as const).map(v => html`
        <div style="
          padding:var(--lib-space-xs) var(--lib-space-sm);
          border:1px solid var(--border-default);
          background:var(--bg-elevated);
          font-family:var(--lib-font-mono);
          font-size:9px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--text-secondary);
        ">${v}</div>
      `)}
    </div>

    <!-- Size badges -->
    <div style="display:flex;gap:var(--lib-space-sm);flex-wrap:wrap;">
      ${(['sm', 'md', 'lg', 'xl', 'full'] as const).map(s => html`
        <div style="
          padding:var(--lib-space-xs) var(--lib-space-sm);
          border:1px solid var(--border-subtle);
          background:var(--bg-surface);
          font-family:var(--lib-font-mono);
          font-size:9px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--text-muted);
        ">size: ${s}</div>
      `)}
    </div>

    <!-- Layout badges -->
    <div style="display:flex;gap:var(--lib-space-sm);flex-wrap:wrap;">
      ${(['dialog', 'drawer-right', 'drawer-bottom', 'alert'] as const).map(l => html`
        <div style="
          padding:var(--lib-space-xs) var(--lib-space-sm);
          border:1px solid var(--border-subtle);
          background:var(--bg-elevated);
          font-family:var(--lib-font-mono);
          font-size:9px;
          letter-spacing:.12em;
          text-transform:uppercase;
          color:var(--text-muted);
        ">${l}</div>
      `)}
    </div>

    <!-- Dialog structure preview (header/body/footer) -->
    <div style="border:1px solid var(--border-default);background:var(--bg-elevated);">
      <div style="padding:var(--lib-space-md);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.14em;text-transform:uppercase;margin-bottom:2px;">Confirmación</div>
          <div style="font-family:var(--lib-font-display);font-size:var(--text-lg);font-weight:300;color:var(--text-primary);">Guardar cambios</div>
        </div>
        <div style="width:20px;height:20px;border:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:center;font-family:var(--lib-font-mono);font-size:10px;color:var(--text-muted);">✕</div>
      </div>
      <div style="padding:var(--lib-space-md);">
        <p style="font-family:var(--lib-font-body);font-size:var(--text-sm);color:var(--text-secondary);line-height:1.7;margin:0;">Los cambios realizados se guardarán permanentemente. Esta acción no puede deshacerse.</p>
      </div>
      <div style="padding:var(--lib-space-sm) var(--lib-space-md);border-top:1px solid var(--border-subtle);display:flex;justify-content:flex-end;gap:var(--lib-space-sm);">
        <div style="padding:var(--lib-space-xs) var(--lib-space-md);border:1px solid var(--border-default);font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--text-secondary);">Cancelar</div>
        <div style="padding:var(--lib-space-xs) var(--lib-space-md);background:var(--accent-primary);font-family:var(--lib-font-mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--bg-base);">Guardar</div>
      </div>
    </div>

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;