import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit';
// 1. Añadimos 'state' a las importaciones de lit/decorators
import { customElement, property, state } from 'lit/decorators.js'; 
//import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { getIcon/*, ICON_REGISTRY*/ } from '../../../shared/icons/icon-registry';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import iconStyles from './lib-icon.css?inline';

@customElement('lib-icon')
export class LibIcon extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(iconStyles)}`,
  ];

  @property({ type: String, reflect: true }) name: string = '';
  @property({ type: String }) size: string = 'md';
  @property({ type: String }) variant: string = 'default';

  // 2. DECLARAMOS EL ESTADO INTERNO (Esta es la pieza que faltaba)
  @state() private _svgContent: string = '';

  override willUpdate(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('name')) {
      this._loadIcon();
    }
  }

  // 4. Buscamos el SVG en tu registro y lo guardamos en el estado
  //TODO: Implementar nominale vs. generico
  private _loadIcon(): void {
    //const icon = ICON_REGISTRY[this.name];
    const iconNominale = getIcon(this.name);
    console.log(iconNominale);
    if (iconNominale) {
      this._svgContent = iconNominale ?? '';
      this.requestUpdate();
    } else {
      this._svgContent = ''; // Si no existe, limpiamos
      //console.warn(`Icono "${this.name}" no encontrado.`);
    }
  }

  protected override render(): TemplateResult {
    const sizeVar: string = `var(--lib-font-size-${this.size})`;
    const variantClass: string = this.variant !== 'default' ? `variant-${this.variant}` : '';
    

    return html`
      <div
        class="icon-wrapper ${variantClass}"
        style="--lib-icon-size: ${sizeVar}"
        aria-hidden="true"
        .innerHTML="${this._svgContent}"
      >
      </div>
    `;
  }
}

//        ${this._svgContent ? unsafeSVG(this._svgContent) : html`<span></span>`}
