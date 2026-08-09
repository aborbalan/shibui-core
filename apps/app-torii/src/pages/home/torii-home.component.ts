import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiHomeTemplate } from './torii-home.html';
import pageCss from './torii-home.css?inline';

@customElement('torii-home')
export class ToriiHome extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  protected override render(): TemplateResult {
    return toriiHomeTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-home': ToriiHome;
  }
}
