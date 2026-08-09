import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiHealthTemplate } from './torii-health.html';
import pageCss from './torii-health.css?inline';

@customElement('torii-health')
export class ToriiHealth extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  protected override render(): TemplateResult {
    return toriiHealthTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-health': ToriiHealth;
  }
}
