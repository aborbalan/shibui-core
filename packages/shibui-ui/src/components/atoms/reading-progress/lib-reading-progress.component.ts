import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './lib-reading-progress.css?inline';
import { readingProgressTemplate } from './lib-reading-progress.html';

@customElement('lib-reading-progress')
export class LibReadingProgress extends LitElement {
  static override styles = unsafeCSS(styles);

  @state() progress: number = 0;

  /** Selector del contenedor que queremos trackear (opcional, por defecto es el body) */
  @property({ type: String }) target?: string;

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('scroll', this._handleScroll, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('scroll', this._handleScroll);
  }

  private _handleScroll = (): void => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    this.progress = Math.round((winScroll / height) * 100);
  };

  protected override render(): TemplateResult {
    return readingProgressTemplate(this);
  }
}