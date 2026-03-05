import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import glitchStyles from './lib-text-glitch.css?inline';

@customElement('lib-text-glitch')
export class LibTextGlitch extends LitElement {
  static override styles = css`${unsafeCSS(glitchStyles)}`;

  @property({ type: String }) text: string = '';
  @property({ type: Boolean, reflect: true }) active: boolean = false;

  protected override render(): TemplateResult {
    // Si no hay texto por propiedad, podríamos usar el slot (pero complica el CSS de pseudo-elementos)
    // Para esta versión Senior, priorizamos la propiedad 'text' para el efecto visual perfecto.
    return html`
      <div class="glitch-wrapper" data-text="${this.text}">
        ${this.text}
      </div>
    `;
  }
}