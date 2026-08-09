import { html, nothing, type TemplateResult } from 'lit';
import { TRUST_LAYERS, type ComponentTrust, type LayerStatus } from '../../data/trust-report';
import type { ToriiHealth } from './torii-health.component';

/** Los tonos de badge que admite lib-data-table, mapeados desde el veredicto de capa. */
const STATUS_TONE: Record<LayerStatus, string> = {
  pass: 'estable',
  fail: 'error',
  skipped: 'inactive',
};

export function toriiHealthTemplate(host: ToriiHealth): TemplateResult {
  if (!host.report) return loading();

  const { report } = host;
  const percent = report.total === 0 ? 0 : Math.round((report.trusted / report.total) * 100);

  return html`
    <div class="wrap">
      <lib-eyebrow>判子 · hanko</lib-eyebrow>
      <lib-display-heading
        tag="h1"
        size="md"
        line1="Qué se puede"
        accent="dar por bueno"
      ></lib-display-heading>

      <p class="lede">
        hanko verifica que cada componente honra el contrato que declara en su manifiesto.
        El sello no es una nota: es un todo o nada. Un componente está sellado si pasa
        todas las capas evaluadas, y basta que una falle para que no lo esté.
      </p>

      <div class="summary">
        <lib-gauge
          .value=${percent}
          unit="%"
          label="Componentes sellados"
          tone=${percent >= 80 ? 'success' : percent >= 40 ? 'warning' : 'error'}
          height="200"
        ></lib-gauge>

        <div>
          <p class="section-label"><span>Por capa</span></p>
          <lib-bar-chart
            mode="stacked"
            show-grid
            show-legend
            height="240"
            y-label="Componentes"
            .categories=${TRUST_LAYERS.map((l) => l)}
            .series=${layerSeries(report.components)}
          ></lib-bar-chart>
        </div>
      </div>

      <p class="section-label"><span>01</span><span>Componente a componente</span></p>
      <p class="stamped">
        ${report.trusted} de ${report.total} llevan sello.
        Abre una fila para ver por qué las demás no lo llevan.
      </p>

      <lib-data-table
        display="striped"
        size="sm"
        sticky-head
        page-size="15"
        caption="Sello de confianza por componente"
        .columns=${COLUMNS}
        .data=${host.rows}
        @ui-lib-table-row-action=${(e: CustomEvent) => host.openFindings(e.detail.row.tagName)}
      ></lib-data-table>

      <p class="meta">
        Report generado el ${formatDate(report.generatedAt)} · fuente: ${host.sourceLabel}
      </p>
    </div>

    ${drawer(host)}
  `;
}

const COLUMNS = [
  { key: 'tagName', header: 'Componente', type: 'mono', sortable: true, sticky: true },
  { key: 'floor', header: 'Floor', type: 'badge', toneKey: 'floorTone' },
  { key: 'contract', header: 'Contrato', type: 'badge', toneKey: 'contractTone' },
  { key: 'a11y', header: 'A11y', type: 'badge', toneKey: 'a11yTone' },
  { key: 'resilience', header: 'Resiliencia', type: 'badge', toneKey: 'resilienceTone' },
  { key: 'actions', header: '', type: 'actions' },
];

/** Una serie por veredicto: apiladas dan el total de componentes en cada capa. */
function layerSeries(components: ComponentTrust[]): { name: string; values: number[] }[] {
  const count = (status: LayerStatus): number[] =>
    TRUST_LAYERS.map(
      (layer) =>
        components.filter((c) => c.layers.find((l) => l.layer === layer)?.status === status).length,
    );

  return [
    { name: 'Pasa', values: count('pass') },
    { name: 'Falla', values: count('fail') },
    { name: 'Sin evaluar', values: count('skipped') },
  ];
}

/** Fila de la tabla: el valor del badge y su tono van en campos separados. */
export function toRow(component: ComponentTrust): Record<string, unknown> {
  const row: Record<string, unknown> = {
    tagName: component.tagName,
    _state: component.trusted ? 'success' : undefined,
  };

  for (const layer of TRUST_LAYERS) {
    const verdict = component.layers.find((l) => l.layer === layer);
    const status: LayerStatus = verdict?.status ?? 'skipped';
    row[layer] = status === 'pass' ? 'ok' : status === 'fail' ? 'falla' : '—';
    row[`${layer}Tone`] = STATUS_TONE[status];
  }

  return row;
}

function drawer(host: ToriiHealth): TemplateResult {
  const selected = host.selected;

  return html`
    <lib-drawer
      ?open=${selected !== null}
      placement="right"
      size="md"
      label=${selected?.tagName ?? ''}
      eyebrow="Hallazgos"
      @ui-lib-drawer-close=${() => host.closeFindings()}
    >
      ${selected === null
        ? nothing
        : selected.findings.length === 0
          ? html`<p class="findings__empty">
              Sin hallazgos: este componente pasa todas las capas evaluadas.
            </p>`
          : html`
              <p class="drawer-tag">
                ${selected.findings.length}
                ${selected.findings.length === 1 ? 'hallazgo' : 'hallazgos'}
              </p>
              <ul class="findings">
                ${selected.findings.map((f) => html`<li>${f}</li>`)}
              </ul>
            `}
    </lib-drawer>
  `;
}

function loading(): TemplateResult {
  return html`
    <div class="wrap">
      <lib-eyebrow>判子 · hanko</lib-eyebrow>
      <lib-spinner size="lg"></lib-spinner>
    </div>
  `;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}
