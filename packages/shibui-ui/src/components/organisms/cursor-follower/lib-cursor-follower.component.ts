import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './lib-cursor-follower.css?inline';

@customElement('lib-cursor-follower')
export class LibCursorFollower extends LitElement {
  static override styles = unsafeCSS(styles);

  /** Suavidad del movimiento (0 a 1). Menor = más inercia. */
  @property({ type: Number }) lerp: number = 0.1;

  @state() private _active: boolean = false;

  // Coordenadas del ratón (objetivo)
  private _mouseX: number = 0;
  private _mouseY: number = 0;

  // Coordenadas del cursor (actuales con LERP)
  private _cursorX: number = 0;
  private _cursorY: number = 0;

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener('mousemove', this._onMouseMove);
    this._animate();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMouseMove);
  }

  private _onMouseMove = (e: MouseEvent) => {
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;

    // Detectar si el ratón está sobre algo interactivo
    const target = e.target as HTMLElement;
    this._active = !!target?.closest('button, a, [interactive]');
    if (this._active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  };

  private _animate = () => {
    // Aplicamos la magia del LERP
    this._cursorX += (this._mouseX - this._cursorX) * this.lerp;
    this._cursorY += (this._mouseY - this._cursorY) * this.lerp;

    this.style.transform = `translate3d(${this._cursorX}px, ${this._cursorY}px, 0)`;

    requestAnimationFrame(this._animate);
  };

  protected override render() {
    return html`<div class="cursor-dot"></div>`;
  }
}