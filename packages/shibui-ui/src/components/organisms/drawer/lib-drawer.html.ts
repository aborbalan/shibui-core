import { html, nothing, TemplateResult } from 'lit';
import type { LibDrawer } from './lib-drawer.component';

/* ── SVG close (X) ── */
const iconClose: TemplateResult = html`
  <svg viewBox="0 0 14 14" aria-hidden="true">
    <line x1="2" y1="2" x2="12" y2="12"/>
    <line x1="12" y1="2" x2="2" y2="12"/>
  </svg>`;

export function drawerTemplate(ctx: LibDrawer): TemplateResult {
  const isHorizontal = ctx.placement === 'right' || ctx.placement === 'left';
  const isGlitch     = ctx.variant === 'glitch' || ctx.variant === 'glitch-dark';

  /* Clase CSS del panel según placement */
  const placementClass = `dr-${ctx.placement}`;

  return html`
    <!-- Backdrop — click fuera cierra -->
    <div
      class="dr-backdrop"
      part="backdrop"
      @click="${(e: MouseEvent): void => {
        if ((e.target as HTMLElement).classList.contains('dr-backdrop')) ctx._close();
      }}"
    >
      <!-- Panel -->
      <div
        class="dr ${placementClass}"
        part="panel"
        role="dialog"
        aria-modal="true"
        aria-label="${ctx.drawerLabel}"
        tabindex="-1"
      >
        <!-- RGB ghost layers (glitch variants únicamente) -->
        ${isGlitch ? html`
          <div class="dr-rgb-r" aria-hidden="true"></div>
          <div class="dr-rgb-b" aria-hidden="true"></div>
        ` : nothing}

        <!-- Handle bar — solo top / bottom -->
        ${!isHorizontal ? html`
          <div class="dr-handle" part="handle">
            <div class="dr-handle-bar"></div>
          </div>
        ` : nothing}

        <!-- Header -->
        <div class="dr-header" part="header">
          <div class="dr-title-block">

            <!-- Eyebrow — slot o prop -->
            ${ctx.eyebrow ? html`
              <div class="dr-eyebrow" part="eyebrow">
                <slot name="eyebrow">${ctx.eyebrow}</slot>
              </div>
            ` : html`
              <slot name="eyebrow">
                <div class="dr-eyebrow" part="eyebrow" style="display:none"></div>
              </slot>
            `}

            <!-- Title — slot o prop -->
            <div class="dr-title" part="title" id="dr-title-${ctx._uid}">
              <slot name="title">${ctx.label}</slot>
            </div>

            <!-- Subtitle — slot o prop -->
            ${ctx.subtitle ? html`
              <div class="dr-subtitle" part="subtitle">
                <slot name="subtitle">${ctx.subtitle}</slot>
              </div>
            ` : html`<slot name="subtitle"></slot>`}

          </div>

          <!-- Botón cerrar -->
          <button
            class="dr-close"
            part="close-btn"
            aria-label="Cerrar"
            @click="${(): void => ctx._close()}"
          >${iconClose}</button>
        </div>

        <!-- Body — slot default -->
        <div class="dr-body" part="body">
          <slot></slot>
        </div>

        <!-- Footer — slot footer (oculto si vacío via CSS) -->
        <div class="dr-footer" part="footer">
          <slot name="footer"></slot>
        </div>

      </div>
    </div>
  `;
}