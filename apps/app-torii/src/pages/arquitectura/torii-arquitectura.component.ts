import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiArquitecturaTemplate } from './torii-arquitectura.html';
import pageCss from './torii-arquitectura.css?inline';
import { CH_KATACHI } from '../../channels';
import { readStoredKatachi, type KatachiId } from '../../data/katachi';

/**
 * El plano del ecosistema: un diagrama de componentes UML con las piezas del
 * monorepo y lo que va de unas a otras.
 *
 * La página no dibuja nada por su cuenta. El diagrama se escribe en PlantUML
 * (`docs/arquitectura/ecosistema.puml`), se renderiza con la herramienta local
 * `tools/uml` y se sirve como asset desde `public/arquitectura/`. Es la única
 * página sin datos vivos: lo que enseña es estructura, y la estructura cambia
 * con los commits, no con el tiempo.
 */
@customElement('torii-arquitectura')
export class ToriiArquitectura extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  /** Solo para elegir la superficie de `lib-background`, igual que en la home. */
  @state() katachi: KatachiId = readStoredKatachi();

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
    return toriiArquitecturaTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-arquitectura': ToriiArquitectura;
  }
}
