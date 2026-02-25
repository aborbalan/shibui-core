import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import drawerStyles from './lib-drawer.css?inline';

@customElement('lib-drawer')
export class LibDrawer extends LitElement {
  static override styles = [css`${unsafeCSS(drawerStyles)}` || []];

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) placement: 'left' | 'right' = 'right';
  @property({ type: String }) label = 'Panel';

  override updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (changedProperties.has('open')) {
      document.body.style.overflow = this.open ? 'hidden' : '';
    }
  }

  private _close():void {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  override render(): TemplateResult {
    return html`
      <div class="overlay" @click=${this._close}></div>
      <aside class="drawer" aria-hidden=${!this.open} role="dialog">
        <header class="drawer-header">
          <slot name="header">
            <span class="title">${this.label}</span>
          </slot>
          <button class="close-btn" @click=${this._close} aria-label="Cerrar">✕</button>
        </header>
        <div class="drawer-body">
          <slot></slot>
        </div>
        <footer class="drawer-footer">
          <slot name="footer"></slot>
        </footer>
      </aside>
    `;
  }
}