import { LitElement, TemplateResult, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import styles from './lib-magnetic.css?inline';

@customElement('lib-magnetic')
export class LibMagnetic extends LitElement {
  static override styles = unsafeCSS(styles);

  /**
   * Intensidad del efecto (0.1 a 1). 
   * Valores más altos hacen que el elemento siga más de cerca al ratón.
   */
  @property({ type: Number }) shift = 0.4;

  @query('.magnetic-wrapper') _wrapper!: HTMLElement;

  override render():TemplateResult {
    return html`
      <div 
        class="magnetic-wrapper"
        @mousemove=${this._handleMouseMove}
        @mouseleave=${this._handleMouseLeave}
      >
        <slot></slot>
      </div>
    `;
  }

  private _handleMouseMove(e: MouseEvent):void {
    const { left, top, width, height } = this.getBoundingClientRect();
    
    // Calculamos la distancia del cursor respecto al centro del elemento
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const deltaX = (e.clientX - centerX) * this.shift;
    const deltaY = (e.clientY - centerY) * this.shift;

    this._wrapper.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }

  private _handleMouseLeave():void {
    // Retorno suave a la posición inicial
    this._wrapper.style.transform = `translate(0px, 0px)`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-magnetic': LibMagnetic;
  }
}