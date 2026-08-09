import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiDeploysTemplate } from './torii-deploys.html';
import pageCss from './torii-deploys.css?inline';

@customElement('torii-deploys')
export class ToriiDeploys extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  protected override render(): TemplateResult {
    return toriiDeploysTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-deploys': ToriiDeploys;
  }
}
