import { LitElement, html, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './lib-cursor-follower.css?inline';

@customElement('lib-cursor-follower')
export class LibCursorFollower extends LitElement {
  static override styles = unsafeCSS(styles);

  @property({ type: Number }) lerp: number = 0.1;

  @state() private _active: boolean = false;

  private _mouseX: number = 0;
  private _mouseY: number = 0;
  private _cursorX: number = 0;
  private _cursorY: number = 0;

  // Añadimos : void a los métodos del ciclo de vida
  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener('mousemove', this._onMouseMove);
    this._animate();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener('mousemove', this._onMouseMove);
  }

  // Las arrow functions también necesitan el tipo de retorno después de los parámetros
  private _onMouseMove = (e: MouseEvent): void => {
    this._mouseX = e.clientX;
    this._mouseY = e.clientY;

    const target = e.target as HTMLElement;
    this._active = !!target?.closest('button, a, [interactive]');
    
    if (this._active) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  };

  private _animate = (): void => {
    this._cursorX += (this._mouseX - this._cursorX) * this.lerp;
    this._cursorY += (this._mouseY - this._cursorY) * this.lerp;

    this.style.transform = `translate3d(${this._cursorX}px, ${this._cursorY}px, 0)`;

    requestAnimationFrame(this._animate);
  };

  // Render debe devolver TemplateResult
  protected override render(): TemplateResult {
    return html`<div class="cursor-dot"></div>`;
  }
}