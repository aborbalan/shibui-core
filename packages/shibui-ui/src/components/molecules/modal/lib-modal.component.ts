import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { modalTemplate } from './lib-modal.html';
import { LibModalSize } from './lib-modal.types';
import cssStyles from './lib-modal.css?inline';

@customElement('lib-modal')
export class LibModal extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) override title = 'Modal Title';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) size: LibModalSize = 'md';
  @property({ type: Boolean }) disableBackdropClick = false;

  @query('dialog') dialog!: HTMLDialogElement;

  protected override updated(changedProperties: Map<string, unknown>):void {
    if (changedProperties.has('open')) {
      this._handleToggle();
    }
  }

  private _handleToggle():void {
    if (!this.dialog) return;
    
    if (this.open) {
      if (!this.dialog.open) this.dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      if (this.dialog.open) this.dialog.close();
      document.body.style.overflow = '';
    }
  }

  close():void {
    this.open = false;
    this.dispatchEvent(new CustomEvent('modal-closed', {
      bubbles: true,
      composed: true
    }));
  }

  handleCancel(e: Event):void {
    e.preventDefault();
    this.close();
  }

  handleBackdropClick(e: MouseEvent):void {
    if (this.disableBackdropClick) return;
    // Si el click es en el diálogo pero no en el contenido (el wrapper), cerramos
    if (e.target === this.dialog) {
      this.close();
    }
  }

  protected override render(): TemplateResult {
    return modalTemplate(this);
  }
}