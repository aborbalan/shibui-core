import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { htmlTemplate } from './lib-dialog.html';
import { PropertyValues } from 'lit'; // Asegúrate de importar esto de 'lit'
import cssStyles from './lib-dialog.css?inline';

@customElement('lib-dialog')
export class LibDialog extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) override title = '';
  @property({ type: Boolean, reflect: true }) open = false;

  @query('dialog') _dialogElement!: HTMLDialogElement;

  // Sincronizamos la propiedad 'open' con el estado del elemento nativo
  protected override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._dialogElement.showModal();
      } else {
        this._dialogElement.close();
      }
    }
  }

  show(): void {
    this.open = true;
  }

  close(): void {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  handleCancel(e: Event): void {
    e.preventDefault();
    this.close();
  }

  protected override render(): TemplateResult {
    return htmlTemplate(this);
  }
}