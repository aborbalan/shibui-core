import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';
import './lib-modal.component';
import type { LibModal } from './lib-modal.component';
import type { ModalAnimate, ModalIconTone, ModalSize, ModalVariant } from './lib-modal.types';

/* ── Tipos de args ──────────────────────────────────────────── */
type LibModalArgs = Pick<
  LibModal,
  'open' | 'size' | 'variant' | '_animate' | 'dark' |
  'heading' | 'subtitle' | 'footerInfo' | 'noBackdropClose'
> & { iconTone: ModalIconTone | null };

/* ── Cast helper ────────────────────────────────────────────── */
/**
 * Obtiene un lib-modal por id con el doble cast necesario para strict TS.
 * HTMLElement | null no se solapa directamente con LibModal — pasamos por unknown.
 */
function getModal(id: string): LibModal | null {
  return document.getElementById(id) as unknown as LibModal | null;
}

/**
 * Cierra el modal que disparó el evento ui-lib-modal-close.
 * e.currentTarget es EventTarget | null — mismo problema, mismo fix.
 */
function closeOnEvent(e: Event): void {
  const modal = e.currentTarget as unknown as LibModal;
  modal.open = false;
}

/* ── Helpers de plantilla ───────────────────────────────────── */

/** Botón de demo que abre un modal al hacer click. */
const trigger = (label: string, id: string, danger = false): TemplateResult => html`
  <button
    style="
      font-family: var(--lib-font-mono);
      font-size: var(--text-xs);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      border: 1px solid ${danger ? 'var(--color-error)' : 'var(--border-default)'};
      background: ${danger ? 'var(--color-error)' : 'var(--bg-elevated)'};
      color: ${danger ? '#fff' : 'var(--text-secondary)'};
    "
    @click="${():void => { const m = getModal(id); if (m) m.open = true; }}"
  >${label}</button>
`;

/** Par Cancelar / Confirmar en el slot footer. */
const footerBtns = (id: string, confirmLabel = 'Aceptar', danger = false): TemplateResult => html`
  <button
    slot="footer"
    style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;padding:0.75rem 1.25rem;cursor:pointer;background:transparent;border:1px solid var(--border-default);color:var(--text-muted);"
    @click="${():void => { const m = getModal(id); if (m) m.open = false; }}"
  >Cancelar</button>
  <button
    slot="footer"
    style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;text-transform:uppercase;padding:0.75rem 1.25rem;cursor:pointer;background:${danger ? 'var(--color-error)' : 'var(--color-washi-900)'};border:1px solid ${danger ? 'var(--color-error)' : 'var(--color-washi-900)'};color:#fff;"
    @click="${():void => { const m = getModal(id); if (m) m.open = false; }}"
  >${confirmLabel}</button>
`;

/* ── Meta ───────────────────────────────────────────────────── */
const meta: Meta<LibModalArgs> = {
  title: 'Components/Molecules/Modal',
  tags:['autodocs'],
  component: 'lib-modal',
  argTypes: {
    size:    { control: 'select', options: ['xs','sm','md','lg','xl','full'] satisfies ModalSize[] },
    variant: { control: 'select', options: ['default','editorial','danger'] satisfies ModalVariant[] },
    _animate: { control: 'select', options: ['scale','slide-up','slide-down'] satisfies ModalAnimate[] },
    iconTone:        { control: 'select', options: [null,'default','kaki','celadon','error','info'] },
    open:            { control: 'boolean' },
    dark:            { control: 'boolean' },
    noBackdropClose: { control: 'boolean' },
    heading:         { control: 'text' },
    subtitle:        { control: 'text' },
    footerInfo:      { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<LibModalArgs>;


/* ══════════════════════════════════════
   PLAYGROUND
   ══════════════════════════════════════ */
export const Playground: Story = {
  args: {
    heading:         'Editar componente',
    subtitle:        'table · #32 · v0.1.0',
    iconTone:        'kaki',
    size:            'md',
    variant:         'default',
    _animate:         'scale',
    dark:            false,
    footerInfo:      '* campos obligatorios',
    open:            false,
    noBackdropClose: false,
  },
  render: (args): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);">
      ${trigger('Abrir modal', 'mo-playground')}

      <lib-modal
        id="mo-playground"
        heading="${args.heading}"
        subtitle="${args.subtitle}"
        .iconTone="${args.iconTone}"
        size="${args.size}"
        variant="${args.variant}"
        _animate="${args._animate}"
        ?dark="${args.dark}"
        footer-info="${args.footerInfo}"
        ?no-backdrop-close="${args.noBackdropClose}"
        ?open="${args.open}"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">✏</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          Contenido del cuerpo del modal. Usa el slot por defecto para cualquier HTML libre,
          secciones de formulario o texto descriptivo.
        </p>
        ${footerBtns('mo-playground', 'Guardar cambios')}
      </lib-modal>
    </div>
  `,
};


/* ══════════════════════════════════════
   TAMAÑOS
   ══════════════════════════════════════ */
export const Sizes: Story = {
  name: 'Sizes — xs · sm · md · lg · xl · full',
  render: (): TemplateResult => {
    const sizes: ModalSize[] = ['xs', 'sm', 'md', 'lg', 'xl', 'full'];
    const labels = ['280px', '420px', '560px', '720px', '920px', '100vw'];

    return html`
      <div style="padding:2rem;background:var(--bg-base);display:flex;flex-wrap:wrap;gap:0.75rem;">
        ${sizes.map((s, i) => html`
          ${trigger(`${s.toUpperCase()} · ${labels[i]}`, `mo-size-${s}`)}

          <lib-modal
            id="mo-size-${s}"
            heading="Modal ${s.toUpperCase()}"
            subtitle="${labels[i]}"
            size="${s}"
            @ui-lib-modal-close="${closeOnEvent}"
          >
            <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
              Contenido en modal tamaño <strong>${s}</strong>. Ajusta el ancho máximo del panel.
            </p>
            ${footerBtns(`mo-size-${s}`, 'Aceptar')}
          </lib-modal>
        `)}
      </div>
    `;
  },
};


/* ══════════════════════════════════════
   VARIANTES
   ══════════════════════════════════════ */
export const Variants: Story = {
  name: 'Variants — default · editorial · danger',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);display:flex;gap:0.75rem;flex-wrap:wrap;">

      <!-- Default -->
      ${trigger('Default', 'mo-v-default')}
      <lib-modal id="mo-v-default"
        heading="Variante Default" subtitle="header con borde neutro"
        icon-tone="default" size="sm"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          Header con borde inferior y fondo elevado blanco. Patrón correcto para
          formularios y gestión de datos.
        </p>
        ${footerBtns('mo-v-default')}
      </lib-modal>

      <!-- Editorial -->
      ${trigger('Editorial', 'mo-v-editorial')}
      <lib-modal id="mo-v-editorial"
        heading="Shibui 0.2" variant="editorial"
        footer-info="Disponible en v0.2.0"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          La variante editorial elimina el separador del header y expande el título para crear
          un modal de lectura más inmersivo. Ideal para anuncios de versión y contenido tipográfico.
        </p>
        <div style="padding:1rem;border-left:2px solid var(--color-kaki-200);margin-top:1rem;">
          <p style="font-family:var(--lib-font-display);font-size:var(--text-md);font-style:italic;
                    color:var(--text-secondary);margin:0;">
            物の哀れ — la belleza de lo impermanente.
          </p>
        </div>
        ${footerBtns('mo-v-editorial', 'Ver changelog')}
      </lib-modal>

      <!-- Danger -->
      ${trigger('Danger', 'mo-v-danger', true)}
      <lib-modal id="mo-v-danger"
        heading="Eliminar proyecto" subtitle="acción irreversible"
        icon-tone="error" variant="danger" size="sm"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">🗑</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          El proyecto <strong>Shibui DS</strong> y todos sus componentes serán eliminados
          permanentemente. Esta acción no puede deshacerse.
        </p>
        <div style="display:flex;flex-direction:column;gap:0.5rem;margin-top:1rem;">
          <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                        letter-spacing:0.08em;text-transform:uppercase;color:var(--text-secondary);">
            Escribe <strong>eliminar</strong> para confirmar
          </label>
          <input
            style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                   padding:0.75rem 1rem;border:1px solid var(--border-default);
                   background:var(--bg-base);color:var(--text-primary);outline:none;width:100%;"
            type="text" placeholder="eliminar"
          >
        </div>
        ${footerBtns('mo-v-danger', 'Eliminar proyecto', true)}
      </lib-modal>

    </div>
  `,
};


/* ══════════════════════════════════════
   ANIMACIONES
   ══════════════════════════════════════ */
export const Animations: Story = {
  name: 'Animations — scale · slide-up · slide-down',
  render: (): TemplateResult => {
    const anims: ModalAnimate[] = ['scale', 'slide-up', 'slide-down'];
    const descs: Record<ModalAnimate, string> = {
      'scale':      'Escala desde 0.95 con un ligero desplazamiento vertical. Sutil y directo.',
      'slide-up':   'Sube 40px desde abajo. Asocia el modal con contenido de la parte inferior.',
      'slide-down': 'Baja 40px desde arriba. Ideal para acciones en la barra de navegación.',
    };

    return html`
      <div style="padding:2rem;background:var(--bg-base);display:flex;gap:0.75rem;flex-wrap:wrap;">
        ${anims.map(a => html`
          ${trigger(a, `mo-anim-${a}`)}

          <lib-modal id="mo-anim-${a}"
            heading="${a}" size="xs" animate="${a}"
            @ui-lib-modal-close="${closeOnEvent}"
          >
            <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
              ${descs[a]}
            </p>
            <button slot="footer"
              style="flex:1;font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;
                     text-transform:uppercase;padding:0.75rem 1.25rem;cursor:pointer;
                     background:var(--color-washi-900);border:1px solid var(--color-washi-900);color:#fff;"
              @click="${():void => { const m = getModal(`mo-anim-${a}`); if (m) m.open = false; }}"
            >OK</button>
          </lib-modal>
        `)}
      </div>
    `;
  },
};


/* ══════════════════════════════════════
   DARK
   ══════════════════════════════════════ */
export const Dark: Story = {
  name: 'Dark — surface oscura',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:oklch(12% 0.015 45);display:flex;gap:0.75rem;">
      ${trigger('Abrir modo oscuro', 'mo-dark-story')}

      <lib-modal id="mo-dark-story"
        heading="Modo oscuro" subtitle="dark surface · oklch tokens"
        icon-tone="default" ?dark="${true}"
        footer-info="cambios aplicados al instante"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">🌙</span>

        <div>
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
                    text-transform:uppercase;color:oklch(28% 0.02 50);margin-bottom:1rem;">
            Configuración del tema
          </p>
          <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.25rem;">
            <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                          letter-spacing:0.08em;text-transform:uppercase;color:oklch(42% 0.02 50);">
              Nombre del tema
            </label>
            <input type="text" value="Shibui · Dark"
              style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                     padding:0.75rem 1rem;background:oklch(10% 0.015 45);
                     border:1px solid oklch(22% 0.02 45);color:oklch(65% 0.02 55);
                     outline:none;width:100%;">
          </div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                          letter-spacing:0.08em;text-transform:uppercase;color:oklch(42% 0.02 50);">
              Paleta base
            </label>
            <select style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                           padding:0.75rem 1rem;background:oklch(10% 0.015 45);
                           border:1px solid oklch(22% 0.02 45);color:oklch(65% 0.02 55);
                           outline:none;width:100%;appearance:none;">
              <option>washi-950</option>
              <option>washi-900</option>
            </select>
          </div>
        </div>

        ${footerBtns('mo-dark-story', 'Guardar')}
      </lib-modal>
    </div>
  `,
};


/* ══════════════════════════════════════
   CONTEXT — patrones reales
   ══════════════════════════════════════ */
export const Context: Story = {
  name: 'Context — confirmación · formulario · info · éxito',
  render: (): TemplateResult => html`
    <div style="padding:2rem;background:var(--bg-base);display:flex;flex-wrap:wrap;gap:0.75rem;">

      <!-- ── Confirmación ── -->
      ${trigger('⚠ Confirmación', 'mo-ctx-confirm')}
      <lib-modal id="mo-ctx-confirm"
        heading="Descartar cambios" icon-tone="error" size="sm"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">⚠</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          Tienes cambios sin guardar en el componente <strong>Modal #36</strong>.
          Si descartás ahora perderás todas las modificaciones de esta sesión.
        </p>
        ${footerBtns('mo-ctx-confirm', 'Descartar', true)}
      </lib-modal>

      <!-- ── Formulario ── -->
      ${trigger('+ Formulario', 'mo-ctx-form')}
      <lib-modal id="mo-ctx-form"
        heading="Nuevo componente" subtitle="Shibui DS · añadir al catálogo"
        icon-tone="kaki" footer-info="* campos obligatorios"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">+</span>

        <!-- Sección identificación -->
        <div>
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
                    text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">
            Identificación
          </p>
          <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:1.25rem;">
            <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                          letter-spacing:0.08em;text-transform:uppercase;color:var(--text-secondary);">
              Nombre *
            </label>
            <input type="text" placeholder="ej. Date Picker"
              style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                     padding:0.75rem 1rem;border:1px solid var(--border-default);
                     background:var(--bg-base);color:var(--text-primary);outline:none;width:100%;">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                            letter-spacing:0.08em;text-transform:uppercase;color:var(--text-secondary);">
                Número
              </label>
              <input type="number" placeholder="37"
                style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                       padding:0.75rem 1rem;border:1px solid var(--border-default);
                       background:var(--bg-base);color:var(--text-primary);outline:none;width:100%;">
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              <label style="font-family:var(--lib-font-mono);font-size:var(--text-xs);
                            letter-spacing:0.08em;text-transform:uppercase;color:var(--text-secondary);">
                Categoría *
              </label>
              <select style="font-family:var(--lib-font-body);font-size:var(--text-sm);
                             padding:0.75rem 1rem;border:1px solid var(--border-default);
                             background:var(--bg-base);color:var(--text-primary);
                             outline:none;width:100%;appearance:none;cursor:pointer;">
                <option value="">Seleccionar…</option>
                <option>Entradas</option>
                <option>Overlays</option>
                <option>Datos</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sección opciones -->
        <div style="padding-top:1.25rem;margin-top:1.25rem;border-top:1px solid var(--border-subtle);">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
                    text-transform:uppercase;color:var(--text-muted);margin-bottom:1rem;">
            Opciones
          </p>
          <div style="display:flex;flex-direction:column;gap:0.75rem;
                      font-size:var(--text-sm);color:var(--text-secondary);">
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--color-washi-900);width:14px;height:14px;">
              Incluir variante dark
            </label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
              <input type="checkbox" checked style="accent-color:var(--color-washi-900);width:14px;height:14px;">
              Documentar en style guide
            </label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;">
              <input type="checkbox" style="accent-color:var(--color-washi-900);width:14px;height:14px;">
              Notificar al equipo
            </label>
          </div>
        </div>

        ${footerBtns('mo-ctx-form', 'Crear componente')}
      </lib-modal>

      <!-- ── Informativo ── -->
      ${trigger('ℹ Informativo', 'mo-ctx-info')}
      <lib-modal id="mo-ctx-info"
        heading="Sobre los tokens OKLCH" subtitle="documentación técnica"
        icon-tone="info" size="sm"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">💡</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          Shibui usa
          <code style="font-family:var(--lib-font-mono);background:var(--bg-surface);
                       padding:1px 5px;border:1px solid var(--border-subtle);color:var(--color-kaki-500);">oklch()</code>
          para garantizar contraste perceptualmente uniforme en toda la escala de cada paleta.
        </p>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;">
          A diferencia de HSL, OKLCH hace que incrementar la luminosidad resulte en pasos
          perceptualmente iguales — esencial para escalas de accesibilidad.
        </p>
        <div style="padding-top:1.25rem;margin-top:1.25rem;border-top:1px solid var(--border-subtle);">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.25em;
                    text-transform:uppercase;color:var(--text-muted);margin-bottom:0.5rem;">
            Escala OKLCH · pasos L 95→15
          </p>
          <div style="display:flex;gap:0.5rem;">
            ${[95, 75, 55, 35, 15].map(l => html`
              <div style="flex:1;height:32px;background:oklch(${l}% 0.02 55);
                          border:1px solid var(--border-subtle);"></div>
            `)}
          </div>
        </div>
        ${footerBtns('mo-ctx-info', 'Ver documentación')}
      </lib-modal>

      <!-- ── Éxito ── -->
      ${trigger('✓ Éxito', 'mo-ctx-success')}
      <lib-modal id="mo-ctx-success"
        heading="¡Guardado!" icon-tone="celadon" size="xs"
        @ui-lib-modal-close="${closeOnEvent}"
      >
        <span slot="icon">✓</span>
        <p style="font-size:var(--text-sm);color:var(--text-secondary);line-height:1.8;text-align:center;">
          El componente <strong>Modal #36</strong> ha sido guardado correctamente
          y publicado en el style guide.
        </p>
        <button slot="footer"
          style="flex:1;font-family:var(--lib-font-mono);font-size:10px;letter-spacing:0.08em;
                 text-transform:uppercase;padding:0.75rem 1.25rem;cursor:pointer;
                 background:var(--color-celadon-500);border:1px solid var(--color-celadon-500);color:#fff;"
          @click="${():void => { const m = getModal('mo-ctx-success'); if (m) m.open = false; }}"
        >Perfecto</button>
      </lib-modal>

    </div>
  `,
};