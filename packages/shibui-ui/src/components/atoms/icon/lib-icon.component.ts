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
    if (iconNominale) {
      this._svgContent = iconNominale ?? '';
      this.requestUpdate();
    } else {
      this._svgContent = ''; // Si no existe, limpiamos
      // Sin nombre no hay nada que buscar: `<lib-icon>` sin `name` es el estado
      // por defecto, no un error. Solo avisamos de un nombre que sí se pidió y
      // no existe, que si no falla en silencio dejando el hueco vacío.
      if (this.name) {
        console.warn(`[lib-icon] Icono "${this.name}" no encontrado. Revisa el nombre o regístralo con registerIcons().`);
      }
    }
  }

  protected override render(): TemplateResult {
    /* `size` llega en dos formas y las dos tienen que funcionar:
       un peldaño de la escala tipográfica ("xs", "sm", "md", "lg", "xl"…)
       o un número en px ("18", "32"), que es como lo llaman 19 sitios entre
       la librería y las apps.
       Antes se interpolaba --lib-font-size-*, familia de la que solo existe
       `base`, así que ningún tamaño resolvía y todos caían al fallback 1em. */
    const sizeVar: string = /^\d+$/.test(this.size)
      ? `${this.size}px`
      : `var(--text-${this.size}, 1em)`;
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
