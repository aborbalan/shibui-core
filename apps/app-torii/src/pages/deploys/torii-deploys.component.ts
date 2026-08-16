import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiDeploysTemplate } from './torii-deploys.html';
import pageCss from './torii-deploys.css?inline';
import { CH_DEPLOYS } from '../../channels';
import type { ProbeResult } from '../../data/loaders/deploys.loader';

/**
 * Qué sitios del ecosistema responden.
 *
 * La página no sondea: se suscribe a `ch-deploys`, que llena el loader. `null`
 * significa "todavía no se sabe" y pinta skeletons — un rojo prematuro sería
 * una afirmación falsa mientras las peticiones siguen en vuelo.
 */
@customElement('torii-deploys')
export class ToriiDeploys extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  @state() results: ProbeResult[] | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.pageController.subscribe(CH_DEPLOYS, (results: ProbeResult[]) => {
      this.results = results;
    });
  }

  override disconnectedCallback(): void {
    this.pageController.unsubscribe(CH_DEPLOYS);
    super.disconnectedCallback();
  }

  protected override render(): TemplateResult {
    return toriiDeploysTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-deploys': ToriiDeploys;
  }
}
