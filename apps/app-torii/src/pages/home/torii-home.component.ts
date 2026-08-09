import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiHomeTemplate } from './torii-home.html';
import pageCss from './torii-home.css?inline';
import { CH_CATALOG, CH_KATACHI, CH_TRUST_REPORT } from '../../channels';
import { FRAMEWORK_COUNT } from '../../data/ecosystem';
import { readStoredKatachi, type KatachiId } from '../../data/katachi';
import type { CatalogSummary } from '../../data/loaders/catalog.loader';
import type { TrustReport } from '../../data/trust-report';

/**
 * La home del hub: las piezas del ecosistema en bento, con los KPIs arriba.
 *
 * No hace un solo fetch. Se suscribe a los channels que llenan los loaders, que
 * arrancan en main.ts. Como los channels reproducen su último valor, da igual
 * que esta página se monte antes o después de que el dato llegue.
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

  /**
   * Cuántos componentes hay. Preferimos la cifra de la API; si está dormida,
   * el `total` del Trust Report cuenta exactamente los mismos componentes, así
   * que sirve de repuesto sin mentir.
   */
  @state() componentCount: number | null = null;

  @state() trustedCount: number | null = null;

  frameworkCount = FRAMEWORK_COUNT;

  /** El último resumen del catálogo, para decidir si pisa o no al del report. */
  private catalog: CatalogSummary | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.pageController.subscribe(CH_KATACHI, (value: KatachiId) => {
      this.katachi = value;
    });

    this.pageController.subscribe(CH_TRUST_REPORT, (report: TrustReport) => {
      this.trustedCount = report.trusted;
      if (this.catalog?.source !== 'api') {
        this.componentCount = report.total;
      }
    });

    this.pageController.subscribe(CH_CATALOG, (summary: CatalogSummary) => {
      this.catalog = summary;
      if (summary.source === 'api') {
        this.componentCount = summary.count;
      }
    });
  }

  override disconnectedCallback(): void {
    this.pageController.unsubscribe([CH_KATACHI, CH_TRUST_REPORT, CH_CATALOG]);
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
