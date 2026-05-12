import { LitElement, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { dialogTemplate } from './lib-dialog.html';
import dialogCss from './lib-dialog.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { DialogVariant, DialogSize, DialogLayout } from './lib-dialog.types';

/**
 * @element lib-dialog
 *
 * Ventana de diálogo sobre `<dialog>` nativo con animación de entrada/salida.
 *
 * @prop {string}        eyebrow     — Texto pequeño encima del título
 * @prop {string}        dlg-title   — Título principal del header
 * @prop {DialogVariant} variant     — default · danger · warning · dark
 * @prop {DialogSize}    size        — sm · md · lg · xl · full (default: md)
 * @prop {DialogLayout}  layout      — dialog · drawer-right · drawer-bottom · alert (default: dialog)
 * @prop {boolean}       open        — Estado controlado del panel
 * @prop {string}        footer-meta — Texto auxiliar izquierdo en el footer
 *
 * @slot         — Cuerpo del dialog (dlg-body)
 * @slot header  — Override completo del título (dentro de dlg-header-text)
 * @slot footer  — Botones del footer (a la derecha del footer-meta)
 *
 * @fires ui-lib-dialog-close — Emitido tras la animación de cierre (bubbles, composed)
 *
 * @method show()  — Abre el dialog con animación de entrada
 * @method close() — Cierra el dialog con animación de salida
 */
@customElement('lib-dialog')
export class LibDialog extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(dialogCss)}`,
  ];

  /* ── Props ── */

  @property({ type: String })
  eyebrow = '';

  /**
   * `title` está reservado en HTMLElement — usamos `dlgTitle` + attribute `dlg-title`.
   */
  @property({ type: String, attribute: 'dlg-title' })
  dlgTitle = '';

  @property({ type: String, reflect: true })
  variant: DialogVariant = 'default';

  @property({ type: String, reflect: true })
  size: DialogSize = 'md';

  @property({ type: String, reflect: true })
  layout: DialogLayout = 'dialog';

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String, attribute: 'footer-meta' })
  footerMeta = '';

  /* ── Refs ── */

  @query('dialog') declare private _dlg: HTMLDialogElement;

  /* ── Lifecycle ── */

  /**
   * Cuando `open` cambia: abrir con showModal + reflow + .is-open
   * o cerrar con animación de salida + transitionend.
   */
  protected override updated(changed: PropertyValues<this>): void {
    if (!changed.has('open')) return;

    if (this.open) {
      this._dlg.showModal();
      this._dlg.getBoundingClientRect(); // force reflow antes de la transición
      this._dlg.classList.add('is-open');
    } else {
      this._animateClose();
    }
  }

  /* ── API pública ── */

  /** Abre el dialog */
  public show(): void {
    this.open = true;
  }

  /** Cierra el dialog con animación */
  public close(): void {
    this.open = false;
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return dialogTemplate({
      eyebrow:    this.eyebrow,
      dlgTitle:   this.dlgTitle,
      variant:    this.variant,
      size:       this.size,
      layout:     this.layout,
      footerMeta: this.footerMeta,
      open:       this.open,
      onClose:    (): void => { this.close(); },
    });
  }

  /* ── Private ── */

  private _animateClose(): void {
    if (!this._dlg?.open) return;

    this._dlg.classList.add('is-closing');
    this._dlg.classList.remove('is-open');

    this._dlg.addEventListener('transitionend', () => {
      this._dlg.close();
      this._dlg.classList.remove('is-closing');

      this.dispatchEvent(
        new CustomEvent('ui-lib-dialog-close', {
          bubbles: true,
          composed: true,
        })
      );
    }, { once: true });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-dialog': LibDialog;
  }
}