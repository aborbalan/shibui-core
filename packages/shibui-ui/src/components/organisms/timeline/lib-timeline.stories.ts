import { Meta, StoryObj } from '@storybook/web-components-vite';
import { html, TemplateResult } from 'lit';

// ✅ side-effect imports
import './lib-timeline.component';
import './lib-timeline-item.component';
import type { LibTimeline } from './lib-timeline.component';
import type { LibTimelineItem } from './lib-timeline-item.component';
import { createKatachiStories } from '../../../stories/katachi-stories.helper';
import { katachiContext, expectAccentMatchesToken } from '../../../stories/katachi-accent.helper';
import { expect, userEvent } from 'storybook/test';
import type { TimelineItemClickDetail } from './lib-timeline-item.types';

type Args = Partial<LibTimeline>;

const meta: Meta<Args> = {
  title: 'Universal/Content/Timeline',
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
          <span slot="meta" class="tl-badge tl-badge-info">Finalizado</span>
        </lib-timeline-item>

        <lib-timeline-item
          status="active"
          node-color="accent"
          timestamp="Ayer · 14:00"
          title="En tránsito"
          body="El envío ha salido de la delegación de Madrid."
          ?card="${true}"
          line-variant="progress"
          line-progress="60"
        >
          <span slot="meta" class="tl-badge tl-badge-accent">En curso</span>
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
          node-color="accent"
          timestamp="Dot · accent"
          title="Nodo punto con color accent"
          body="El nodo más simple del sistema."
        ></lib-timeline-item>

        <lib-timeline-item
          node-type="icon"
          node-color="info"
          icon="check-circle"
          timestamp="Icon · info"
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
          title="is-active — pulso accent animado"
          body="El nodo pulsa en accent con una animación de ring infinita."
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
   Tooltip Playground — controles interactivos
   ================================================================ */
interface TooltipArgs {
  tooltip: string;
  tooltipPosition: 'top' | 'bottom' | 'left' | 'right'
    | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  tooltipSurface: 'dark' | 'light';
  tooltipTone: 'default' | 'accent' | 'info' | 'error';
}

export const TooltipPlayground: StoryObj<TooltipArgs> = {
  name: 'Tooltip · Playground',
  args: {
    tooltip: 'Entregado a las 10:32 por mensajero · Firma: A. García',
    tooltipPosition: 'right',
    tooltipSurface: 'dark',
    tooltipTone: 'default',
  },
  argTypes: {
    tooltip: { control: 'text' },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right',
        'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    },
    tooltipSurface: {
      control: 'select',
      options: ['dark', 'light'],
    },
    tooltipTone: {
      control: 'select',
      options: ['default', 'accent', 'info', 'error'],
    },
  },
  render: (args): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--lib-space-lg);">
        Pasa el cursor sobre el nodo del ítem central. Ajusta el tooltip desde los controles.
      </p>
      <lib-timeline>

        <lib-timeline-item
          status="done"
          timestamp="Hoy · 09:00"
          title="Pedido registrado"
          body="Ítem de contexto (sin tooltip)."
        ></lib-timeline-item>

        <lib-timeline-item
          status="active"
          node-color="accent"
          node-type="icon"
          icon="package"
          timestamp="Hoy · 10:30"
          title="Pedido entregado ← hover sobre el nodo"
          body="Este nodo tiene el tooltip controlado por los args."
          tooltip="${args.tooltip ?? ''}"
          tooltip-position="${args.tooltipPosition ?? 'right'}"
          tooltip-surface="${args.tooltipSurface ?? 'dark'}"
          tooltip-tone="${args.tooltipTone ?? 'default'}"
        ></lib-timeline-item>

        <lib-timeline-item
          status="pending"
          timestamp="Mañana"
          title="Cierre de incidencia"
          body="Ítem de contexto (sin tooltip)."
          ?hide-line="${true}"
        ></lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Tooltips en el nodo — texto simple · contenido rico
   ================================================================ */
export const NodeTooltips: Story = {
  name: 'Tooltips en el nodo',
  render: (): TemplateResult => html`
    <div style="max-width:480px;padding:var(--lib-space-xl);">
      <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--lib-space-lg);">
        Pasa el cursor sobre cada nodo para ver el tooltip.
      </p>
      <lib-timeline>

        <!-- Texto simple via prop -->
        <lib-timeline-item
          status="done"
          node-type="icon"
          node-color="info"
          icon="check-circle"
          timestamp="Hoy · 10:30"
          title="Pedido entregado"
          body="Hover sobre el nodo para ver el detalle."
          tooltip="Entregado a las 10:32 por mensajero · Firma: A. García"
        ></lib-timeline-item>

        <!-- Variante accent -->
        <lib-timeline-item
          status="active"
          node-color="accent"
          timestamp="Ayer · 14:00"
          title="En tránsito"
          body="Tooltip con variante accent."
          tooltip="Salida de delegación Madrid · ETA 18:00"
          tooltip-tone="accent"
        ></lib-timeline-item>

        <!-- Contenido rico via slot -->
        <lib-timeline-item
          node-type="avatar"
          avatar="JR"
          timestamp="12 Feb 2025"
          title="Pedido registrado"
          body="Tooltip con contenido rico (slot)."
          tooltip-surface="light"
          ?hide-line="${true}"
        >
          <span slot="tooltip">
            <span class="tip-title">Juan Ramírez</span>
            <span class="tip-body">Registró el pedido y validó el pago manualmente.</span>
          </span>
        </lib-timeline-item>

      </lib-timeline>
    </div>
  `,
};

/* ================================================================
   Collapsible
   ================================================================ */
export const Collapsible: Story = {
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
          <span slot="meta" class="tl-badge tl-badge-info">Completado</span>
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
          <span slot="meta" class="tl-badge tl-badge-accent">En curso</span>
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
          <span slot="meta" class="tl-badge tl-badge-info">Aprobado</span>
          <span slot="meta" class="tl-badge tl-badge-default">feature/lib-modal</span>
          <span slot="meta">
            <span class="tl-avatar">JR</span>
            <span class="tl-avatar" style="margin-left:-6px">AL</span>
          </span>
        </lib-timeline-item>

        <lib-timeline-item
          node-type="icon"
          node-color="accent"
          icon="image-square"
          timestamp="Ayer · 16:45"
          title="Assets actualizados"
          body="Se han subido los nuevos iconos y fondos al repositorio de diseño."
          ?card="${true}"
          ?hide-line="${true}"
        >
          <span slot="meta" class="tl-badge tl-badge-accent">Diseño</span>
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
   Clickable — evento + navegación (caso CV)
   ================================================================ */
export const Clickable: Story = {
  name: 'Clickable — evento + navegación',
  render: (): TemplateResult => html`
    <div style="max-width:520px;padding:var(--lib-space-xl);">
      <p style="font-size:var(--text-sm);color:var(--text-muted);margin-bottom:var(--lib-space-lg);">
        Haz click (o Enter/Space con foco) en cada experiencia. El evento
        <code>ui-lib-timeline-item-click</code> se loguea en la consola; un CV
        podría usarlo para navegar al detalle.
      </p>

      <lib-timeline
        @ui-lib-timeline-item-click="${(e: CustomEvent<TimelineItemClickDetail>): void => {
          // En un CV real: router.navigate(e.detail.value) o abrir e.detail.href
          console.log('timeline-item-click →', e.detail.value, e.detail);
        }}"
      >

        <lib-timeline-item
          status="done"
          node-type="avatar"
          avatar="SH"
          timestamp="2023 — Hoy"
          title="Senior Frontend · Shibui"
          body="Design system en Lit + Web Components. Click para ver el detalle."
          ?card="${true}"
          ?clickable="${true}"
          value="exp/shibui"
        >
          <span slot="meta" class="tl-badge tl-badge-accent">Lit</span>
          <span slot="meta" class="tl-badge tl-badge-info">TypeScript</span>
        </lib-timeline-item>

        <lib-timeline-item
          status="default"
          node-type="avatar"
          avatar="AC"
          timestamp="2020 — 2023"
          title="Frontend Engineer · Acme"
          body="Navegación nativa: este abre un href en pestaña nueva."
          ?card="${true}"
          href="https://example.com/cv/acme"
          target="_blank"
          value="exp/acme"
        >
          <span slot="meta" class="tl-badge tl-badge-default">React</span>
        </lib-timeline-item>

        <lib-timeline-item
          node-type="dot"
          timestamp="2018 — 2020"
          title="Junior Dev · Início (sin card)"
          body="También funciona sin card: la fila de contenido es la superficie."
          ?clickable="${true}"
          value="exp/inicio"
          ?hide-line="${true}"
        ></lib-timeline-item>

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

/* ═══════════════════════════════════════════════════════════════
   KATACHI · 形 · Las 6 historias estándar
   lib-timeline usa tokens semánticos (--bg-elevated, --border-subtle,
   --text-primary) — hereda katachi directamente sin CSS extra.
   Los nodos accent/info son acentos semánticos independientes.
   ═══════════════════════════════════════════════════════════════ */

const _katachi = createKatachiStories<object>(() => html`
  <div style="display:flex;gap:var(--lib-space-xl);flex-wrap:wrap;align-items:flex-start;">

    <!-- Sizes sm/md/lg + all statuses -->
    ${(['sm', 'md', 'lg'] as const).map(s => html`
      <div style="min-width:220px;">
        <p style="font-family:var(--lib-font-mono);font-size:9px;color:var(--text-muted);letter-spacing:.16em;text-transform:uppercase;margin-bottom:var(--lib-space-md);">size="${s}"</p>
        <lib-timeline size="${s}">
          <lib-timeline-item
            status="done"
            node-type="icon"
            node-color="info"
            icon="check-circle"
            timestamp="2024"
            title="Wabi — tokens base"
            body="Arquitectura de tokens CSS."
            ?card="${s === 'lg'}"
          ></lib-timeline-item>
          <lib-timeline-item
            status="active"
            node-color="accent"
            line-variant="progress"
            line-progress="65"
            timestamp="2025"
            title="Kintsugi — katachi"
            body="Seis contextos estéticos."
            ?card="${s === 'lg'}"
          ></lib-timeline-item>
          <lib-timeline-item
            status="error"
            node-type="icon"
            node-color="error"
            icon="warning"
            timestamp="Jan 2026"
            title="Deploy fallido"
            body="Requiere revisión."
            ?card="${s === 'lg'}"
          ></lib-timeline-item>
          <lib-timeline-item
            status="pending"
            timestamp="2026"
            title="Celadon — cobertura"
            body="77 componentes completos."
            ?hide-line="${true}"
            ?card="${s === 'lg'}"
          ></lib-timeline-item>
        </lib-timeline>
      </div>
    `)}

  </div>
`);

export const KatachiShizen   = _katachi.KatachiShizen;
export const KatachiWabi     = _katachi.KatachiWabi;
export const KatachiKintsugi = _katachi.KatachiKintsugi;
export const KatachiCeladon  = _katachi.KatachiCeladon;
export const KatachiSabi     = _katachi.KatachiSabi;
export const KatachiTerminal = _katachi.KatachiTerminal;

/* ── Acento de selección sigue al katachi (PR #448) ──────────────
   El nodo del item activo adopta el token de acento jade bajo celadon,
   no el kaki cálido hardcodeado. */
export const TestAccentCeladon: Story = {
  name: 'Test · accent del nodo activo sigue al katachi (celadon)',
  tags: ['test'],
  render: (): TemplateResult => katachiContext('celadon', html`
    <lib-timeline>
      <lib-timeline-item status="active" title="Kintsugi"></lib-timeline-item>
    </lib-timeline>
  `),
  play: async ({ canvasElement }): Promise<void> => {
    const ctx = canvasElement.querySelector('[data-katachi="celadon"]') as HTMLElement;
    const item = ctx.querySelector('lib-timeline-item') as LibTimelineItem;
    await item.updateComplete;
    const dot = item.shadowRoot!.querySelector('.tl-item.is-active .tl-node-dot') as HTMLElement;
    expectAccentMatchesToken(dot, 'borderTopColor', ctx, '--border-focus');
  },
};

/* ── Clickable emite el evento con el detalle correcto ───────────── */
export const TestClickEmits: Story = {
  name: 'Test · emite ui-lib-timeline-item-click al click',
  tags: ['test'],
  render: (): TemplateResult => html`
    <lib-timeline>
      <lib-timeline-item
        title="Experiencia"
        timestamp="2023"
        ?card="${true}"
        ?clickable="${true}"
        value="exp/1"
      ></lib-timeline-item>
    </lib-timeline>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const item = canvasElement.querySelector('lib-timeline-item') as LibTimelineItem;
    await item.updateComplete;

    let detail: TimelineItemClickDetail | undefined;
    item.addEventListener('ui-lib-timeline-item-click', (e: Event): void => {
      detail = (e as CustomEvent<TimelineItemClickDetail>).detail;
    });

    const card = item.shadowRoot!.querySelector('.tl-card.tl-clickable') as HTMLElement;
    await expect(card).toBeTruthy();
    await expect(card.getAttribute('role')).toBe('button');
    await expect(card.getAttribute('tabindex')).toBe('0');

    await userEvent.click(card);

    await expect(detail).toBeTruthy();
    await expect(detail!.value).toBe('exp/1');
    await expect(detail!.title).toBe('Experiencia');
  },
};

/* ── No-clickable no expone superficie interactiva ───────────────── */
export const TestNotClickable: Story = {
  name: 'Test · sin clickable/href no hay superficie interactiva',
  tags: ['test'],
  render: (): TemplateResult => html`
    <lib-timeline>
      <lib-timeline-item title="Solo lectura" ?card="${true}"></lib-timeline-item>
    </lib-timeline>
  `,
  play: async ({ canvasElement }): Promise<void> => {
    const item = canvasElement.querySelector('lib-timeline-item') as LibTimelineItem;
    await item.updateComplete;
    const surface = item.shadowRoot!.querySelector('.tl-clickable');
    await expect(surface).toBeNull();
  },
};
