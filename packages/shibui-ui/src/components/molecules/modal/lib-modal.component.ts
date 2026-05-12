import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import modalCss from './lib-modal.css?inline';
import { modalTemplate } from './lib-modal.html';
import { ModalAnimate, ModalCloseEventDetail, ModalIconTone, ModalSize, ModalVariant } from './lib-modal.types';


/**
 * @element lib-modal
 *
 * Diálogo bloqueante con backdrop difuminado. Seis tamaños, tres variantes
 * de panel, tres animaciones de entrada y soporte de surface oscura.
 *
 * ## Uso básico
 * ```html
 * <lib-modal heading="Editar componente" open>
 *   <p>Contenido del cuerpo.</p>
 *   <div slot="footer">
 *     <button class="mo-btn mo-btn-ghost">Cancelar</button>
 *     <button class="mo-btn mo-btn-primary">Guardar</button>
 *   </div>
 * </lib-modal>
 * ```
 *
 * ## Con ícono y subtítulo
 * ```html
 * <lib-modal heading="Nuevo componente" subtitle="Shibui DS · añadir" icon-tone="kaki">
 *   <ph-plus slot="icon" weight="bold"></ph-plus>
 *   ...
 * </lib-modal>
 * ```
 *
 * ## Control de apertura
 * ```ts
 * modal.open = true;
 * modal.addEventListener('ui-lib-modal-close', e => {
 *   console.log(e.detail.reason); // 'button' | 'backdrop' | 'escape'
 *   modal.open = false;
 * });
 * ```
 *
 * @prop {boolean}        open              — Abre el modal. Reflected.
 * @prop {ModalSize}      size              — xs · sm · md · lg · xl · full (default md).
 * @prop {ModalVariant}   variant           — default · editorial · danger.
 * @prop {ModalAnimate}   _animate           — scale · slide-up · slide-down.
 * @prop {boolean}        dark              — Surface oscura.
 * @prop {string}         heading           — Título del modal (requerido para a11y).
 * @prop {string}         subtitle          — Subtítulo mono debajo del título.
 * @prop {ModalIconTone|null} icon-tone     — Tono del ícono. Si es null no se renderiza el wrapper.
 * @prop {string}         footer-info       — Texto secundario izquierda en el footer.
 * @prop {boolean}        no-backdrop-close — Desactiva el cierre al hacer click en el backdrop.
 *
 * @slot             — Cuerpo del modal (secciones, formularios, contenido libre).
 * @slot icon        — Contenido del ícono del header (visible solo si icon-tone no es null).
 * @slot footer      — Acciones del footer (botones).
 *
 * @csspart backdrop  — Capa de fondo difuminada.
 * @csspart panel-wrap — Contenedor animado (tamaño + animación).
 * @csspart panel     — El panel blanco real.
 * @csspart header    — Zona del header.
 * @csspart icon      — Wrapper del ícono.
 * @csspart close-btn — Botón ×.
 * @csspart body      — Zona scrollable del cuerpo.
 * @csspart footer    — Zona del footer.
 *
 * @fires ui-lib-modal-close — Emitido cuando el modal se cierra. Detail: { reason }.
 */
@customElement('lib-modal')
export class LibModal extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(modalCss)}`,
  ];

  /* ── Props ─────────────────────────────────────────────── */

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: String, reflect: true })
  size: ModalSize = 'md';

  @property({ type: String, reflect: true })
  variant: ModalVariant = 'default';

  @property({ type: String, reflect: true })
  _animate: ModalAnimate = 'scale';

  @property({ type: Boolean, reflect: true })
  dark: boolean = false;

  /** Título del modal — requerido para accesibilidad (aria-labelledby). */
  @property({ type: String })
  heading: string = '';

  @property({ type: String })
  subtitle: string = '';

  /**
   * Tono del ícono del header.
   * Acepta: 'default' | 'kaki' | 'celadon' | 'error' | 'info' | null.
   * Cuando es null no se renderiza el wrapper del ícono.
   */
  @property({ type: String, attribute: 'icon-tone' })
  iconTone: ModalIconTone | null = null;

  @property({ type: String, attribute: 'footer-info' })
  footerInfo: string = '';

  /** Desactiva el cierre al hacer click fuera del panel. */
  @property({ type: Boolean, attribute: 'no-backdrop-close' })
  noBackdropClose: boolean = false;

  /* ── Estado interno ─────────────────────────────────────── */

  /** Elemento con foco antes de abrir — se restaura al cerrar. */
  private _prevFocus: Element | null = null;

  /** Handler de Escape vinculado para poder desregistrarlo. */
  private readonly _onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation();
      this._close('escape');
    }
  };

  /* ── Lifecycle ──────────────────────────────────────────── */

  override connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('keydown', this._onKeydown, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._onKeydown, true);
    // Restaurar scroll si el componente se desmonta mientras está abierto
    if (this.open) document.body.style.overflow = '';
  }

  override updated(changed: Map<string, unknown>): void {
    if (!changed.has('open')) return;

    if (this.open) {
      this._prevFocus = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Foco al primer elemento interactivo tras el render
      requestAnimationFrame(() => this._focusFirst());
    } else {
      document.body.style.overflow = '';
      // Restaurar foco al trigger original
      if (this._prevFocus instanceof HTMLElement) {
        this._prevFocus.focus();
      }
      this._prevFocus = null;
    }
  }

  /* ── API pública ────────────────────────────────────────── */

  /** Cierra el modal programáticamente. */
  close(): void {
    this._close('button');
  }

  /* ── Helpers privados ───────────────────────────────────── */

  private _close(reason: ModalCloseEventDetail['reason']): void {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent<ModalCloseEventDetail>('ui-lib-modal-close', {
        detail: { reason },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _onBackdropClick(e: MouseEvent): void {
    // Solo cierra si el click es directamente sobre el backdrop
    if (!this.noBackdropClose && e.target === e.currentTarget) {
      this._close('backdrop');
    }
  }

  private _focusFirst(): void {
    const panel = this.renderRoot.querySelector('.mo-panel');
    if (!panel) return;
    const focusable = panel.querySelector<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();
  }

  /* ── Render ─────────────────────────────────────────────── */

  override render(): TemplateResult {
    return modalTemplate({
      open:            this.open,
      size:            this.size,
      variant:         this.variant,
      _animate:         this._animate,
      dark:            this.dark,
      heading:         this.heading,
      subtitle:        this.subtitle,
      iconTone:        this.iconTone,
      footerInfo:      this.footerInfo,
      onClose:         () => this._close('button'),
      onBackdropClick: (e) => this._onBackdropClick(e),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-modal': LibModal;
  }
}

