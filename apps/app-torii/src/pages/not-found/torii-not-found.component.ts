import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiNotFoundTemplate } from './torii-not-found.html';
import pageCss from './torii-not-found.css?inline';

/** La ruta con `notFound: true`. Sin ella un path desconocido no renderiza nada. */
@customElement('torii-not-found')
export class ToriiNotFound extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  /** Por nombre de ruta, que es la única forma de navegar en Open Cells. */
  goHome(): void {
    this.pageController.navigate('home');
  }

  protected override render(): TemplateResult {
    return toriiNotFoundTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-not-found': ToriiNotFound;
  }
}
