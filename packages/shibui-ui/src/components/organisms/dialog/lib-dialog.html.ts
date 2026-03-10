import { html, TemplateResult } from 'lit';
import type { DialogTemplateProps } from './lib-dialog.types';

/* SVG del botón de cierre — reutilizable */
const closeSvg = html`
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
       stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <path d="M1 1l10 10M11 1L1 11"/>
  </svg>
`;

/* Icono para variante danger */
const dangerSvg = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
       stroke="var(--color-error)" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 2L14.5 13H1.5L8 2z"/>
    <path d="M8 6v3M8 11v.5"/>
  </svg>
`;

/* Icono para variante warning */
const warningSvg = html`
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
       stroke="var(--color-warning)" stroke-width="1.5"
       stroke-linecap="round" stroke-linejoin="round">
    <circle cx="8" cy="8" r="6"/>
    <path d="M8 5v3M8 10v.5"/>
  </svg>
`;

export function dialogTemplate(props: DialogTemplateProps): TemplateResult {
  const {
    eyebrow, dlgTitle, variant, size,
    layout, footerMeta, onClose,
  } = props;

  /* ── Clases del <dialog> ── */
  const layoutCls =
    layout === 'drawer-right'  ? 'dlg-drawer-right'  :
    layout === 'drawer-bottom' ? 'dlg-drawer-bottom' :
    '';
  const alertCls = layout === 'alert' ? 'dlg-alert' : '';
  const sizeCls  = `dlg-${size}`;
  const dlgCls   = `dlg ${sizeCls} ${layoutCls} ${alertCls}`.trim();

  /* ── Icono de header (solo danger / warning) ── */
  const hasIcon = variant === 'danger' || variant === 'warning';
  const headerIcon = hasIcon
    ? html`<div class="dlg-header-icon">
        ${ variant === 'danger' ? dangerSvg : warningSvg }
      </div>`
    : null;

  return html`
    <dialog
      class="${dlgCls}"
      @cancel="${(e: Event): void => { e.preventDefault(); onClose(); }}"
      @click="${(e: MouseEvent): void => {
        /* Cierre al click sobre el backdrop (target === dialog) */
        if ((e.target as HTMLElement).tagName === 'DIALOG') onClose();
      }}"
    >
      <!-- HEADER -->
      <div class="dlg-header">
        ${headerIcon}
        <div class="dlg-header-text" style="${hasIcon ? 'margin-left: var(--lib-space-md)' : ''}">
          ${eyebrow ? html`<p class="dlg-eyebrow">${eyebrow}</p>` : null}
          <slot name="header">
            <h2 class="dlg-title">${dlgTitle}</h2>
          </slot>
        </div>
        <button
          class="dlg-close"
          aria-label="Cerrar"
          @click="${(): void => onClose()}"
        >${closeSvg}</button>
      </div>

      <!-- BODY -->
      <div class="dlg-body">
        <slot></slot>
      </div>

      <!-- FOOTER -->
      <div class="dlg-footer">
        ${footerMeta ? html`<span class="dlg-footer-meta">${footerMeta}</span>` : null}
        <slot name="footer"></slot>
      </div>
    </dialog>
  `;
}