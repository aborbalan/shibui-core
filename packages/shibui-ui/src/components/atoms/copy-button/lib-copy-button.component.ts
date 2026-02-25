import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { copyButtonTemplate } from './lib-copy-button.html';
import cssStyles from './lib-copy-button.css?inline';

@customElement('lib-copy-button')
export class LibCopyButton extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) value = '';
  @property({ type: String }) size: 'sm' | 'md' = 'md';

  @state() private copied = false;

  async copyToClipboard():Promise<void> {
    if (!this.value || this.copied) return;

    try {
      await navigator.clipboard.writeText(this.value);
      this.copied = true;
      
      // Volver al estado inicial tras 2 segundos
      setTimeout(():void => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Error al copiar: ', err);
    }
  }

  protected override render(): TemplateResult {
    return copyButtonTemplate(this, this.copied);
  }
}