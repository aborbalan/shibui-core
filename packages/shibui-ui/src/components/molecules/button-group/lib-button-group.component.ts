import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { buttonGroupTemplate } from './lib-button-group.html';
import cssStyles from './lib-button-group.css?inline';

@customElement('lib-button-group')
export class LibButtonGroup extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: Boolean, reflect: true })
  vertical = false;

  protected override render(): TemplateResult {
    return buttonGroupTemplate();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-button-group': LibButtonGroup;
  }
}