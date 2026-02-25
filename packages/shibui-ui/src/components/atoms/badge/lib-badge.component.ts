import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { template } from './lib-badge.html';
import cssStyles from './lib-badge.css?inline';

@customElement('lib-badge')
export class LibBadge extends LitElement {
  static override styles = css`${unsafeCSS(cssStyles)}`;

  @property({ type: String }) variant: 'primary' | 'success' | 'warning' | 'error' | 'neutral' = 'neutral';
  @property({ type: String }) icon = '';
  @property({ type: Boolean }) removable = false;

  protected _handleRemove(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent('remove', {
      bubbles: true,
      composed: true
    }));
  }

  protected override render(): TemplateResult {
    return template.call(this);
  }
}