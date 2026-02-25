import { LitElement, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { kbdTemplate } from './lib-kbd.html';
import cssStyles from './lib-kbd.css?inline';

@customElement('lib-kbd')
export class LibKbd extends LitElement {
  static override styles = unsafeCSS(cssStyles);

  @property({ type: String }) key = '';

  protected override render(): TemplateResult {
    return kbdTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-kbd': LibKbd;
  }
}