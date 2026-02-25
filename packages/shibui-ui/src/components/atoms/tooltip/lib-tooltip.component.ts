import { LitElement, html, css, TemplateResult, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import tooltipStyles from './lib-tooltip.css?inline';

@customElement('lib-tooltip')
export class LibTooltip extends LitElement {
  static override styles = [css`${unsafeCSS(tooltipStyles)}` || []];

  @property({ type: String }) content = '';
  @property({ type: String }) position: 'top' | 'bottom' | 'left' | 'right' = 'top';

  @state() private _visible = false;

  private _show():void { this._visible = true; }
  private _hide():void { this._visible = false; }

  override render(): TemplateResult {
    return html`
      <div class="tooltip-container" 
           @mouseenter=${this._show} 
           @mouseleave=${this._hide}
           @focusin=${this._show} 
           @focusout=${this._hide}>
        
        <slot></slot>

        <div class="tooltip-bubble ${this.position}" 
             ?data-visible=${this._visible}
             role="tooltip">
          ${this.content}
        </div>
      </div>
    `;
  }
}