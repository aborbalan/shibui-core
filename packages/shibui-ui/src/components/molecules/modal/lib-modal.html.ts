import { html, nothing, TemplateResult } from 'lit';
import { ModalAnimate, ModalIconTone, ModalSize, ModalVariant } from './lib-modal.types';

export interface ModalTemplateProps {
  /* Estado */
  open:             boolean;
  /* Panel */
  size:             ModalSize;
  variant:          ModalVariant;
  _animate:          ModalAnimate;
  dark:             boolean;
  /* Header */
  heading:          string;
  subtitle:         string;
  iconTone:         ModalIconTone | null;
  /* Footer */
  footerInfo:       string;
  /* Handlers */
  onClose:          () => void;
  onBackdropClick:  (e: MouseEvent) => void;
}

/** Clases del contenedor del panel (.mo-panel-wrap). */
function panelWrapClass(p: ModalTemplateProps): string {
  const classes = ['mo-panel-wrap'];
  if (p.size !== 'md')         classes.push(`mo-${p.size}`);
  if (p._animate === 'slide-up')   classes.push('mo-slide-up');
  if (p._animate === 'slide-down') classes.push('mo-slide-down');
  if (p.dark)                  classes.push('mo-dark');
  return classes.join(' ');
}

/** Clases del panel (.mo-panel). */
function panelClass(variant: ModalVariant): string {
  const classes = ['mo-panel'];
  if (variant === 'editorial') classes.push('is-editorial');
  if (variant === 'danger')    classes.push('is-danger');
  return classes.join(' ');
}

/** Clases del ícono de header. */
function iconClass(tone: ModalIconTone): string {
  const classes = ['mo-header-icon'];
  if (tone !== 'default') classes.push(`is-${tone}`);
  return classes.join(' ');
}

export function modalTemplate(p: ModalTemplateProps): TemplateResult {
  return html`
    <div
      class="mo-backdrop"
      part="backdrop"
      @click="${p.onBackdropClick}"
    >
      <div
        class="${panelWrapClass(p)}"
        part="panel-wrap"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mo-title"
        @click="${(e: MouseEvent):void => e.stopPropagation()}"
      >
        <div class="${panelClass(p.variant)}" part="panel">

          <!-- ── HEADER ── -->
          <div class="mo-header" part="header">

            <!-- Ícono opcional — tone prop activa el wrapper -->
            ${p.iconTone !== null ? html`
              <div class="${iconClass(p.iconTone)}" part="icon">
                <slot name="icon"></slot>
              </div>
            ` : nothing}

            <!-- Título y subtítulo -->
            <div class="mo-header-text">
              <h2 id="mo-title" class="mo-title">${p.heading}</h2>
              ${p.subtitle ? html`<p class="mo-subtitle">${p.subtitle}</p>` : nothing}
            </div>

            <!-- Botón de cierre -->
            <button
              class="mo-close"
              part="close-btn"
              aria-label="Cerrar"
              @click="${p.onClose}"
            >×</button>
          </div>

          <!-- ── BODY — slot default ── -->
          <div class="mo-body" part="body">
            <slot></slot>
          </div>

          <!-- ── FOOTER ── -->
          <div class="mo-footer" part="footer">
            ${p.footerInfo ? html`
              <span class="mo-footer-info">${p.footerInfo}</span>
            ` : nothing}
            <slot name="footer"></slot>
          </div>

        </div>
      </div>
    </div>
  `;
}