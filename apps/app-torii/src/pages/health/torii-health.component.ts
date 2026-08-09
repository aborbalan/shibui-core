import { LitElement, css, unsafeCSS, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { PageController } from '@open-cells/page-controller';
import { toriiHealthTemplate, toRow } from './torii-health.html';
import pageCss from './torii-health.css?inline';
import { CH_TRUST_REPORT } from '../../channels';
import type { ComponentTrust, TrustReport } from '../../data/trust-report';

/**
 * El Trust Report de hanko en detalle: cuánto está sellado, cómo se reparte por
 * capa y qué le falta a cada componente.
 *
 * lib-data-table no tiene filas desplegables, así que el drill-down va por su
 * columna de acciones: el evento `ui-lib-table-row-action` abre un lib-drawer
 * con los hallazgos de esa fila.
 */
@customElement('torii-health')
export class ToriiHealth extends LitElement {
  static override styles = [css`${unsafeCSS(pageCss)}`];

  pageController = new PageController(this);

  @state() report: TrustReport | null = null;

  /** El componente cuyo drawer está abierto, o `null` si está cerrado. */
  @state() selected: ComponentTrust | null = null;

  /** Filas ya derivadas: la tabla no debería recalcularlas en cada render. */
  @state() rows: Record<string, unknown>[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.pageController.subscribe(CH_TRUST_REPORT, (report: TrustReport) => {
      this.report = report;
      this.rows = report.components.map(toRow);
    });
  }

  override disconnectedCallback(): void {
    this.pageController.unsubscribe(CH_TRUST_REPORT);
    super.disconnectedCallback();
  }

  /**
   * Los nodos de página se reutilizan entre visitas, así que un drawer abierto
   * al salir seguiría abierto al volver. Se cierra al entrar.
   */
  onPageEnter(): void {
    this.selected = null;
  }

  get sourceLabel(): string {
    return import.meta.env.DEV ? 'fixture local de desarrollo' : 'hanko-report.web.app';
  }

  openFindings(tagName: string): void {
    this.selected = this.report?.components.find((c) => c.tagName === tagName) ?? null;
  }

  closeFindings(): void {
    this.selected = null;
  }

  protected override render(): TemplateResult {
    return toriiHealthTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'torii-health': ToriiHealth;
  }
}
