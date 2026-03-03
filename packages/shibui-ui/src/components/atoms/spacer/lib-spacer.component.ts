// lib-spacer.component.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('lib-spacer')
export class LibSpacer extends LitElement {
  @property({ type: String }) size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @property({ type: Boolean, reflect: true }) horizontal = false;

  static override styles = css`
    :host {
      display: block;
      flex-shrink: 0;
      flex-grow: 0;
    }
    :host([horizontal]) {
      display: inline-block;
    }
  `;

  protected override render() {
    // MAPEADO EXACTO A TUS TOKENS DE tokens.css
    const spaceValue = `var(--lib-space-${this.size}, 16px)`;
    
    const styles = this.horizontal 
      ? { width: spaceValue, height: '100%' } 
      : { height: spaceValue, width: '100%' };

    return html`<div style=${styleMap(styles)}></div>`;
  }
}