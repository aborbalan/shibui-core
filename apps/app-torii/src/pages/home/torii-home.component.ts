import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiHomeTemplate } from './torii-home.html';
import pageCss from './torii-home.css?inline';
import { CH_KATACHI } from '../../channels';
import { FRAMEWORK_COUNT } from '../../data/ecosystem';
import { readStoredKatachi, type KatachiId } from '../../data/katachi';

/**
 * La home del hub: las piezas del ecosistema en bento, con los KPIs arriba.
 *
 * De momento las cifras son las del manifiesto; F5 las cambia por datos vivos.
 */
@customElement('torii-home')
export class ToriiHome extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  /**
   * El katachi decide la superficie de `lib-background`: los temas de fondo
   * están fijados a la paleta y no reaccionan al contexto, así que uno claro
   * dejaría ilegible un katachi oscuro.
   */
  @state() katachi: KatachiId = readStoredKatachi();

  @state() componentCount = 102;

  @state() trustedCount = 0;

  frameworkCount = FRAMEWORK_COUNT;

  override connectedCallback(): void {
    super.connectedCallback();
    this.pageController.subscribe(CH_KATACHI, (value: KatachiId) => {
      this.katachi = value;
    });
  }

  override disconnectedCallback(): void {
    this.pageController.unsubscribe(CH_KATACHI);
    super.disconnectedCallback();
  }

  protected override render(): TemplateResult {
    return toriiHomeTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-home': ToriiHome;
  }
}
