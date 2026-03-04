import { LitElement, TemplateResult, css, html, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { aspectRatioTemplate } from './lib-aspect-ratio.html';
import styles from './lib-aspect-ratio.css?inline';

@customElement('lib-aspect-ratio')
export class LibAspectRatio extends LitElement {
  static override styles = [css`${unsafeCSS(styles)}`];

  /**
   * El ratio deseado. Ejemplos: "16/9", "4/3", "1/1", "21/9"
   * @type {string}
   */
  @property({ type: String }) ratio = '1/1';

  protected override render(): TemplateResult {
    // Inyectamos el ratio directamente en el estilo del host
    const hostStyles = {
      '--lib-aspect-ratio': this.ratio
    };

    return html`
      <div style=${styleMap(hostStyles)}>
        ${aspectRatioTemplate()}
      </div>
    `;
  }
}