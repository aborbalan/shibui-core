/* ============================================================
   hanko · Trust Report — renderers (F6)

   Serializan un `TrustReport` ya agregado a sus dos formatos:
     · JSON  → máquina (gates de CI, badges, histórico).
     · HTML  → humano (el sello legible, con marca washi de hanko).

   Ambos son PUROS: string in → string out, sin DOM ni I/O. Escribir
   los ficheros a disco es trabajo del runner (incremento 2).

   Spec: docs/specs/trust-report.md
   ============================================================ */
import type { ContractSource } from '../core/contract';
import type { ComponentTrust, LayerStatus, LayerVerdict, TrustLayer, TrustReport } from './trust-report';

/** Serializa el reporte a JSON indentado (formato de cable para CI/badges). */
export function renderTrustReportJson(report: TrustReport): string {
  return JSON.stringify(report, null, 2);
}

const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function sourceLabel(source: ContractSource): string {
  if (source.kind === 'adapter') return `adapter:${source.format}`;
  if (source.kind === 'inferred') return 'inferido';
  return 'CEM';
}

const LAYER_LABEL: Record<TrustLayer, string> = {
  floor: 'Floor',
  contract: 'Contrato',
  a11y: 'a11y',
  resilience: 'Resiliencia',
};

const STATUS_GLYPH: Record<LayerStatus, string> = { pass: '✓', fail: '✗', skipped: '–' };

function layerCell(v: LayerVerdict): string {
  const extra =
    v.status === 'fail' && v.violations > 0
      ? ` <span class="n">${v.violations}</span>`
      : v.warnings > 0
        ? ` <span class="w">${v.warnings}</span>`
        : '';
  return `<td class="lyr ${v.status}" title="${esc(LAYER_LABEL[v.layer])}: ${v.status}">${STATUS_GLYPH[v.status]}${extra}</td>`;
}

function row(c: ComponentTrust): string {
  const seal = c.trusted ? '<span class="seal ok">sellado</span>' : '<span class="seal no">sin sello</span>';
  const cells = c.layers.map(layerCell).join('');
  return `<tr class="${c.trusted ? '' : 'untrusted'}">
      <td class="tag"><code>${esc(c.tagName)}</code></td>
      <td class="src">${esc(sourceLabel(c.source))}</td>
      ${cells}
      <td class="vd">${seal}</td>
    </tr>`;
}

function findingsBlock(components: ComponentTrust[]): string {
  const withFindings = components.filter((c) => c.findings.length > 0);
  if (withFindings.length === 0) {
    return '<p class="empty">Sin hallazgos: todo lo evaluado pasó. ✓</p>';
  }
  const items = withFindings
    .map(
      (c) => `<details class="fnd">
        <summary><code>${esc(c.tagName)}</code> · ${c.findings.length} hallazgo(s)</summary>
        <ul>${c.findings.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </details>`,
    )
    .join('\n');
  return items;
}

/**
 * Renderiza el Trust Report como documento HTML autónomo con marca de hanko.
 * `note` (opcional) pinta un banner de cobertura — p.ej. «solo Floor por ahora».
 */
export function renderTrustReportHtml(report: TrustReport, note?: string): string {
  const rows = report.components.map(row).join('\n');
  const pct = report.total > 0 ? Math.round((report.trusted / report.total) * 100) : 0;
  const banner =
    note !== undefined
      ? `<p style="margin:0 0 22px;padding:10px 14px;border-radius:8px;border:1px solid #6e5a2e;background:rgba(217,164,65,.08);color:#e8c27a;font-size:.84rem">${esc(note)}</p>`
      : '';
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>hanko · Trust Report</title>
<style>
  :root{
    --bg:#14110f;--panel:#221d19;--panel-2:#2a241f;--ink:#ece4d8;--ink-soft:#bcae9c;
    --ink-faint:#8c8072;--line:#3a3128;--celadon:#7fae9b;--celadon-deep:#4f7d6c;
    --kintsugi:#d9a441;--shuniku:#c5402f;--info:#6f9fc4;--radius:12px;
    --mono:ui-monospace,"Cascadia Code",Consolas,monospace;--sans:"Inter",system-ui,sans-serif;
    --serif:"Iowan Old Style","Palatino Linotype",Georgia,serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.55;
    -webkit-font-smoothing:antialiased}
  .wrap{max-width:1000px;margin:0 auto;padding:48px 24px 96px}
  .kicker{font-family:var(--mono);font-size:.72rem;letter-spacing:.26em;text-transform:uppercase;color:var(--kintsugi);margin:0 0 12px}
  h1{font-family:var(--serif);font-weight:600;font-size:2.1rem;margin:0 0 6px}
  h1 .stamp{color:var(--shuniku)}
  .ts{font-family:var(--mono);font-size:.78rem;color:var(--ink-faint);margin:0 0 26px}
  .summary{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 28px}
  .card{background:var(--panel);border:1px solid var(--line);border-radius:var(--radius);padding:16px 20px;min-width:120px}
  .card .k{font-family:var(--mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint)}
  .card .v{font-family:var(--serif);font-size:1.9rem;font-weight:700;margin-top:4px}
  .card.ok .v{color:var(--celadon)}.card.no .v{color:var(--shuniku)}.card.tot .v{color:var(--ink)}
  table{width:100%;border-collapse:collapse;margin:8px 0 0;font-size:.86rem}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--line)}
  th{font-family:var(--mono);font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-faint);font-weight:600}
  td.tag code{font-family:var(--mono);font-size:.82rem;color:var(--ink)}
  td.src{font-family:var(--mono);font-size:.72rem;color:var(--ink-soft)}
  td.lyr{text-align:center;font-family:var(--mono);font-weight:700;width:64px}
  td.lyr.pass{color:var(--celadon)}td.lyr.fail{color:var(--shuniku)}td.lyr.skipped{color:var(--ink-faint)}
  td.lyr .n{color:var(--shuniku);font-size:.72rem}td.lyr .w{color:var(--kintsugi);font-size:.72rem}
  tr.untrusted{background:rgba(197,64,47,.05)}
  .seal{font-family:var(--mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:6px;border:1px solid}
  .seal.ok{color:var(--celadon);border-color:var(--celadon-deep);background:rgba(127,174,155,.1)}
  .seal.no{color:var(--shuniku);border-color:#6e2e2e;background:rgba(197,64,47,.1)}
  h2{font-family:var(--serif);font-size:1.25rem;margin:40px 0 12px}
  details.fnd{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 16px;margin:0 0 8px}
  details.fnd summary{cursor:pointer;font-family:var(--mono);font-size:.8rem;color:var(--ink-soft)}
  details.fnd ul{margin:10px 0 2px;padding-left:18px;color:var(--ink-soft);font-size:.84rem}
  details.fnd li{margin:3px 0;font-family:var(--mono)}
  .empty{color:var(--celadon);font-size:.9rem}
  footer{margin-top:54px;padding-top:20px;border-top:1px solid var(--line);color:var(--ink-faint);font-size:.78rem;font-family:var(--mono)}
</style>
</head>
<body>
<div class="wrap">
  <p class="kicker">hanko · 判子 · trust report</p>
  <h1>Sello de confianza <span class="stamp">●</span></h1>
  <p class="ts">generado ${esc(report.generatedAt)} · ${report.total} componente(s) · ${pct}% sellados</p>
  ${banner}
  <div class="summary">
    <div class="card tot"><div class="k">Total</div><div class="v">${report.total}</div></div>
    <div class="card ok"><div class="k">Sellados</div><div class="v">${report.trusted}</div></div>
    <div class="card no"><div class="k">Sin sello</div><div class="v">${report.untrusted}</div></div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Componente</th><th>Origen</th>
        <th>Floor</th><th>Contrato</th><th>a11y</th><th>Resiliencia</th>
        <th>Sello</th>
      </tr>
    </thead>
    <tbody>
${rows}
    </tbody>
  </table>

  <h2>Hallazgos</h2>
  ${findingsBlock(report.components)}

  <footer>
    hanko · ✓ pasa · ✗ falla · – no evaluado (regla de oro: ausencia ≠ incumplimiento) ·
    spec en docs/specs/trust-report.md
  </footer>
</div>
</body>
</html>`;
}
