import { html, nothing, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import type { TimelineItemTemplateProps } from './lib-timeline-item.types';

export function timelineItemTemplate(props: TimelineItemTemplateProps): TemplateResult {
  const {
    nodeType, nodeColor, icon, avatar,
    status, lineVariant, lineProgress, hideLine,
    timestamp, title, body, card, collapsed, collapsible,
    onToggleCollapse,
  } = props;

  /* ── Clases del ítem raíz ── */
  const itemCls = [
    'tl-item',
    status !== 'default' ? `is-${status}` : '',
    collapsed ? 'is-collapsed' : '',
  ].filter(Boolean).join(' ');

  /* ── Clases del nodo ── */
  const nodeTypeCls = `tl-node-${nodeType}`;
  const nodeColorCls = nodeColor !== 'default' ? `nd-${nodeColor}` : '';
  const nodeCls = `tl-node ${nodeTypeCls} ${nodeColorCls}`.trim();

  /* ── Nodo interior ── */
  const nodeInner = nodeType === 'icon'
    ? html`<lib-icon name="${icon}" size="xs"></lib-icon>`
    : nodeType === 'avatar'
      ? html`${avatar}`
      : nothing; /* dot — nodo gestionado por CSS ::before/::after */

  /* ── Línea ── */
  const lineCls = [
    'tl-line',
    lineVariant === 'dashed'   ? 'dashed'   : '',
    lineVariant === 'progress' ? 'progress' : '',
  ].filter(Boolean).join(' ');

  const lineStyles = lineVariant === 'progress'
    ? styleMap({ '--tl-progress': `${lineProgress}%` } as Record<string, string>)
    : nothing;

  /* ── Contenido ── */
  const contentInner: TemplateResult = card
    ? html`
        <div class="tl-card">
          ${title ? html`<p class="tl-title">${title}</p>` : nothing}
          <div class="tl-card-body">
            ${body ? html`<div class="tl-body">${body}</div>` : nothing}
            <!-- slot por defecto para contenido libre dentro de la card -->
            <slot></slot>
            <!-- slot meta: badges, avatares, etc. -->
            <div class="tl-meta">
              <slot name="meta"></slot>
            </div>
            <!-- slot media: imágenes adjuntas -->
            <slot name="media"></slot>
          </div>
        </div>`
    : html`
        ${title ? html`<p class="tl-title">${title}</p>` : nothing}
        ${body
          ? html`<div class="tl-body">${body}</div>`
          : html`<div class="tl-body"><slot></slot></div>`}
        <div class="tl-meta">
          <slot name="meta"></slot>
        </div>`;

  return html`
    <div class="${itemCls}" role="listitem">

      <!-- ── Spine: nodo + línea ── -->
      <div class="tl-spine">
        <div class="${nodeCls}">${nodeInner}</div>
        ${hideLine
          ? nothing
          : html`<div class="${lineCls}" style="${lineStyles}"></div>`}
      </div>

      <!-- ── Content ── -->
      <div class="tl-content">
        ${timestamp
          ? html`
              <div class="tl-timestamp">
                <span class="tl-timestamp-dot"></span>
                ${timestamp}
              </div>`
          : nothing}

        ${contentInner}

        ${collapsible
          ? html`
              <button
                class="tl-expand-btn"
                aria-expanded="${!collapsed}"
                @click="${onToggleCollapse}"
              >
                <lib-icon
                  name="${collapsed ? 'caret-down' : 'caret-up'}"
                  size="xs"
                ></lib-icon>
                ${collapsed ? 'Mostrar más' : 'Mostrar menos'}
              </button>`
          : nothing}
      </div>

    </div>
  `;
}