import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';

// ✅ side-effect imports
import './lib-timeline.component';
import './lib-timeline-item.component';
import type { LibTimeline } from './lib-timeline.component';

type Args = Partial<LibTimeline>;

const meta: Meta<Args> = {
  title: 'Components/Organisms/Timeline',
  tags:['autodocs'],
  component: 'lib-timeline',
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<Args>;

/* ================================================================
   Playground
   ================================================================ */
export const Playground: Story = {
  args: { size: 'md' },
  render: (args): TemplateResult => html`
    <div style="max-width:520px;padding:var(--lib-space-xl);">
      <lib-timeline size="${args.size ?? 'md'}">

        <lib-timeline-item
          status="done"
          timestamp="Hoy · 10:30"
          title="Pedido entregado"
          body="El cliente ha recibido el paquete satisfactoriamente."
          ?card="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-celadon">Finalizado</span>
        </lib-timeline-item>

        <lib-timeline-item
          status="active"
          node-color="kaki"
          timestamp="Ayer · 14:00"
          title="En tránsito"
          body="El envío ha salido de la delegación de Madrid."
          ?card="${true}"
          line-variant="progress"
          line-progress="60"
        >
          <span slot="meta" class="tl-badge tl-badge-kaki">En curso</span>
        </lib-timeline-item>

        <lib-timeline-item
          status="pending"
          timestamp="12 Feb 2025"
          title="Pedido registrado"
          body="Hemos recibido la solicitud y estamos procesando el pago."
          ?card="${true}"
          ?hide-line="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-default">Pendiente</span>
        </lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Nodos — dot · icon · avatar
   ================================================================ */
export const NodeTypes: Story = {
  name: 'Nodos — dot · icon · avatar',
  render: (): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <lib-timeline>

        <lib-timeline-item
          node-type="dot"
          node-color="kaki"
          timestamp="Dot · kaki"
          title="Nodo punto con color kaki"
          body="El nodo más simple del sistema."
        ></lib-timeline-item>

        <lib-timeline-item
          node-type="icon"
          node-color="celadon"
          icon="check-circle"
          timestamp="Icon · celadon"
          title="Nodo con icono Phosphor"
          body="Acepta cualquier nombre de icono de la librería."
        ></lib-timeline-item>

        <lib-timeline-item
          node-type="icon"
          node-color="error"
          icon="warning"
          timestamp="Icon · error"
          title="Nodo de error"
          body="Icono de advertencia en variante error."
        ></lib-timeline-item>

        <lib-timeline-item
          node-type="avatar"
          avatar="AG"
          timestamp="Avatar"
          title="Nodo avatar con iniciales"
          body="Para timelines de actividad de personas."
          ?hide-line="${true}"
        ></lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Estados — active · done · error · pending
   ================================================================ */
export const States: Story = {
  name: 'Estados — active · done · error · pending',
  render: (): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <lib-timeline>

        <lib-timeline-item
          status="done"
          timestamp="Completado"
          title="is-done — checkmark en nodo"
          body="El nodo se rellena en washi-900 con un check blanco."
          ?card="${true}"
        ></lib-timeline-item>

        <lib-timeline-item
          status="active"
          timestamp="En progreso"
          title="is-active — pulso kaki animado"
          body="El nodo pulsa en kaki con una animación de ring infinita."
          ?card="${true}"
        ></lib-timeline-item>

        <lib-timeline-item
          status="error"
          timestamp="Fallido"
          title="is-error — exclamación roja"
          body="El nodo y el título se tiñen de rojo. La card cambia de fondo."
          ?card="${true}"
        ></lib-timeline-item>

        <lib-timeline-item
          status="pending"
          timestamp="Pendiente"
          title="is-pending — nodo punteado y opacidad reducida"
          body="El cuerpo y el título se desvanecen para indicar estado futuro."
          ?card="${true}"
          ?hide-line="${true}"
        ></lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Líneas — solid · dashed · progress
   ================================================================ */
export const LineVariants: Story = {
  name: 'Líneas — solid · dashed · progress',
  render: (): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <lib-timeline>

        <lib-timeline-item
          timestamp="Solid (default)"
          title="Línea sólida"
          body="Estilo por defecto — borde-default."
        ></lib-timeline-item>

        <lib-timeline-item
          line-variant="dashed"
          timestamp="Dashed"
          title="Línea punteada"
          body="Para separar ítems opcionales o agrupados."
        ></lib-timeline-item>

        <lib-timeline-item
          line-variant="progress"
          line-progress="65"
          status="active"
          timestamp="Progress 65%"
          title="Línea con relleno animado"
          body="El porcentaje se controla via prop line-progress (0–100)."
          ?hide-line="${false}"
        ></lib-timeline-item>

        <lib-timeline-item
          ?hide-line="${true}"
          timestamp="Último ítem"
          title="Sin línea"
          body="hide-line oculta la línea en el último ítem del timeline."
        ></lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Collapsible
   ================================================================ */
export const Collapsible: Story = {
  name: 'Collapsible .',
  render: (): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <lib-timeline>

        <lib-timeline-item
          status="done"
          timestamp="Hoy · 09:00"
          title="Ítem collapsible expandido"
          body="Este contenido se puede contraer con el botón de abajo."
          ?card="${true}"
          ?collapsible="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-celadon">Completado</span>
        </lib-timeline-item>

        <lib-timeline-item
          status="active"
          timestamp="Hoy · 08:00"
          title="Ítem collapsible contraído por defecto"
          body="Al hacer clic en 'Mostrar más' se expande el cuerpo."
          ?card="${true}"
          ?collapsible="${true}"
          ?hide-line="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-kaki">En curso</span>
        </lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Con meta y media
   ================================================================ */
export const WithMetaAndMedia: Story = {
  name: 'Con meta y media',
  render: (): TemplateResult => html`
    <div style="max-width:520px;padding:var(--lib-space-xl);">
      <lib-timeline>

        <lib-timeline-item
          node-type="avatar"
          avatar="PM"
          timestamp="Hace 2h"
          title="Pull request aprobado"
          ?card="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-celadon">Aprobado</span>
          <span slot="meta" class="tl-badge tl-badge-default">feature/lib-modal</span>
          <span slot="meta">
            <span class="tl-avatar">JR</span>
            <span class="tl-avatar" style="margin-left:-6px">AL</span>
          </span>
        </lib-timeline-item>

        <lib-timeline-item
          node-type="icon"
          node-color="kaki"
          icon="image-square"
          timestamp="Ayer · 16:45"
          title="Assets actualizados"
          body="Se han subido los nuevos iconos y fondos al repositorio de diseño."
          ?card="${true}"
          ?hide-line="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-kaki">Diseño</span>
          <div slot="media" class="tl-media">
            <div class="tl-media-thumb">
              <lib-icon name="image" size="md"></lib-icon>
            </div>
            <div class="tl-media-thumb">
              <lib-icon name="image" size="md"></lib-icon>
            </div>
            <div class="tl-media-thumb">
              <lib-icon name="image" size="md"></lib-icon>
            </div>
          </div>
        </lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Tamaños — sm · md · lg
   ================================================================ */
export const Sizes: Story = {
  name: 'Tamaños — sm · md · lg',
  render: (): TemplateResult => html`
    <div style="display:flex;flex-wrap:wrap;gap:var(--lib-space-xl);padding:var(--lib-space-xl);align-items:flex-start;">

      ${(['sm', 'md', 'lg'] as const).map(s => html`
        <div style="min-width:260px;">
          <p style="font-family:var(--lib-font-mono);font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--text-muted);margin-bottom:var(--lib-space-md);">size="${s}"</p>
          <lib-timeline size="${s}">
            <lib-timeline-item
              status="done"
              timestamp="Completado"
              title="Ítem finalizado"
              body="Descripción de apoyo."
            ></lib-timeline-item>
            <lib-timeline-item
              status="active"
              timestamp="En progreso"
              title="Ítem activo"
              body="Descripción de apoyo."
            ></lib-timeline-item>
            <lib-timeline-item
              status="pending"
              timestamp="Pendiente"
              title="Ítem pendiente"
              body="Descripción de apoyo."
              ?hide-line="${true}"
            ></lib-timeline-item>
          </lib-timeline>
        </div>
      `)}

    </div>
  `,
};