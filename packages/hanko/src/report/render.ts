/* ============================================================
   hanko · Trust Report — renderers (F6)

   Serializan un `TrustReport` ya agregado a sus dos formatos:
     · JSON  → máquina (gates de CI, badges, histórico).
     · HTML  → humano (el sello legible, con marca washi de hanko).

   Ambos son PUROS: string in → string out, sin DOM ni I/O. Escribir
   los ficheros a disco es trabajo del runner (incremento 2).

   --- Visualización con @shibui-ui/ui (dogfood de la capa de presentación) ---
   El HTML emite web components de shibui (`<lib-card>`, `<lib-badge>`,
   `<lib-status-dot>`, `<lib-accordion>`, `<lib-alert>`…). Es DELIBERADO y NO
   rompe el principio nº1 («el core nunca importa shibui»): aquí no hay ningún
   `import` de la librería — solo se emiten TAGS como texto y se referencia, por
   `<script src>`, un bundle que se genera FUERA de `src/` (en `dogfood/`, la
   única zona que toca shibui por código). `genericity.test.ts` (que escanea
   imports de TS en `src/`) sigue verde. El motor de informes no depende de
   shibui para evaluar; solo la VISUALIZACIÓN lo usa.

   Los assets (`shibui-ui.js` + `tokens.css`) los deja `dogfood/bundle-shibui-page.ts`
   junto al `index.html`. Si faltan, la página degrada con elegancia: los custom
   elements no se definen, pero su contenido en light DOM (texto de los slots)
   sigue siendo legible.

   Spec: docs/specs/trust-report.md
   ============================================================ */
import type { ContractSource } from '../core/contract';
import type { ComponentTrust, LayerStatus, LayerVerdict, TrustLayer, TrustReport } from './trust-report';
import type { BrowserDiagnostic } from './observations';

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

/** Cada capa → tono semántico de `lib-badge`. skipped es neutro (regla de oro). */
const STATUS_TONE: Record<LayerStatus, string> = {
  pass: 'success',
  fail: 'error',
  skipped: 'default',
};

/** Celda de capa: un `lib-badge` compacto con el glifo del veredicto. */
function layerCell(v: LayerVerdict): string {
  const count =
    v.status === 'fail' && v.violations > 0
      ? ` ${v.violations}`
      : v.warnings > 0
        ? ` ${v.warnings}`
        : '';
  const title = `${LAYER_LABEL[v.layer]}: ${v.status}`;
  return `<td class="lyr"><lib-badge size="sm" tone="${STATUS_TONE[v.status]}" title="${esc(title)}">${STATUS_GLYPH[v.status]}${count}</lib-badge></td>`;
}

function row(c: ComponentTrust): string {
  const seal = c.trusted
    ? '<lib-badge tone="success" pill dot>sellado</lib-badge>'
    : '<lib-badge tone="warning" pill dot>sin sello</lib-badge>';
  const cells = c.layers.map(layerCell).join('');
  return `<tr class="${c.trusted ? '' : 'untrusted'}">
      <td class="tag"><code>${esc(c.tagName)}</code></td>
      <td class="src">${esc(sourceLabel(c.source))}</td>
      ${cells}
      <td class="vd">${seal}</td>
    </tr>`;
}

/** Hallazgos → `lib-accordion` (uno por componente con hallazgos). */
function findingsBlock(components: ComponentTrust[]): string {
  const withFindings = components.filter((c) => c.findings.length > 0);
  if (withFindings.length === 0) {
    return '<lib-alert type="success" heading="Sin hallazgos">Todo lo evaluado pasó. ✓</lib-alert>';
  }
  const items = withFindings
    .map(
      (c) => `<lib-accordion-item label="${esc(c.tagName)} · ${c.findings.length} hallazgo(s)">
        <ul>${c.findings.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </lib-accordion-item>`,
    )
    .join('\n');
  return `<lib-accordion display="separated">
${items}
  </lib-accordion>`;
}

/** Sección con los errores crudos del navegador (depuración/calibración). */
function diagnosticsBlock(diagnostics: BrowserDiagnostic[]): string {
  if (diagnostics.length === 0) {
    return '<lib-alert type="success" heading="Sin diagnósticos">Sin errores de navegador capturados durante la sonda. ✓</lib-alert>';
  }
  const rows = diagnostics
    .map(
      (d) => `<tr>
        <td class="dk">${esc(d.kind)}</td>
        <td class="dm"><code>${esc(d.message)}</code></td>
        <td class="dc">×${d.count}</td>
      </tr>`,
    )
    .join('\n');
  return `<table class="diag">
      <thead><tr><th>Origen</th><th>Mensaje</th><th>Veces</th></tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>`;
}

/**
 * Renderiza el Trust Report como documento HTML autónomo con marca de hanko,
 * construido con componentes de @shibui-ui/ui (ver cabecera del fichero).
 * `note` (opcional) pinta un `lib-alert` de cobertura — p.ej. «solo Floor».
 * `diagnostics` (opcional) añade abajo una sección con los errores crudos del
 * navegador capturados por la sonda: la diferencia entre el report limpio que
 * ya teníamos y el «report-full». Omitirlo → report limpio.
 */
export function renderTrustReportHtml(
  report: TrustReport,
  note?: string,
  diagnostics?: BrowserDiagnostic[],
): string {
  const rows = report.components.map(row).join('\n');
  const pct = report.total > 0 ? Math.round((report.trusted / report.total) * 100) : 0;
  const banner =
    note !== undefined
      ? `<lib-alert type="warning" heading="Cobertura parcial" class="banner">${esc(note)}</lib-alert>`
      : '';
  const diagSection =
    diagnostics !== undefined
      ? `<lib-divider></lib-divider>
  <lib-eyebrow tone="accent" line="left">Diagnóstico del navegador · ${diagnostics.length}</lib-eyebrow>
  <p class="dhint">Errores crudos capturados al montar los componentes en chromium durante la sonda.
  <strong>No son veredictos del sello</strong>: por el render async de Lit, el harness todavía no los
  atribuye a su escenario (regla de oro). Son señal de calibración.</p>
  ${diagnosticsBlock(diagnostics)}`
      : '';
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>hanko · Trust Report</title>
<!-- Tokens semánticos de shibui a nivel documento (paleta + escala + katachi). -->
<link rel="stylesheet" href="./tokens.css">
<!-- Bundle que registra los custom elements de shibui (lo genera dogfood/bundle-shibui-page.ts). -->
<script defer src="./shibui-ui.js"></script>
<style>
  :root{
    --mono:ui-monospace,"Cascadia Code",Consolas,monospace;
    --sans:"Inter",system-ui,sans-serif;
    --serif:"Iowan Old Style","Palatino Linotype",Georgia,serif;
    --kintsugi:#d9a441;--shuniku:#c5402f;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg-base,#14110f);color:var(--text-primary,#ece4d8);
    font-family:var(--sans);line-height:1.55;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1000px;margin:0 auto;padding:48px 24px 96px}
  h1{font-family:var(--serif);font-weight:600;font-size:2.1rem;margin:14px 0 6px}
  h1 .stamp{color:var(--shuniku)}
  .ts{font-family:var(--mono);font-size:.78rem;color:var(--text-muted,#8c8072);margin:0 0 26px}
  .banner{display:block;margin:0 0 22px}

  /* Tarjetas resumen — lib-card */
  .summary{display:flex;gap:14px;flex-wrap:wrap;margin:0 0 18px}
  .summary lib-card{flex:1 1 150px;min-width:140px}
  .summary .k{font-family:var(--mono);font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--text-muted,#8c8072)}
  .summary .v{font-family:var(--serif);font-size:1.9rem;font-weight:700;line-height:1.1}
  .pct{display:block;margin:0 0 30px}

  /* Tabla de veredictos */
  table{width:100%;border-collapse:collapse;margin:8px 0 0;font-size:.86rem}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--border-subtle,#3a3128)}
  th{font-family:var(--mono);font-size:.64rem;letter-spacing:.12em;text-transform:uppercase;color:var(--text-muted,#8c8072);font-weight:600}
  td.tag code{font-family:var(--mono);font-size:.82rem;color:var(--text-primary,#ece4d8)}
  td.src{font-family:var(--mono);font-size:.72rem;color:var(--text-secondary,#bcae9c)}
  td.lyr{text-align:center;width:72px}
  tr.untrusted{background:color-mix(in oklch, var(--shuniku) 6%, transparent)}

  h2{font-family:var(--serif);font-size:1.25rem;margin:36px 0 12px}
  lib-divider{display:block;margin:40px 0 4px}
  lib-accordion{display:block}
  lib-accordion-item ul{margin:6px 0 2px;padding-left:18px;color:var(--text-secondary,#bcae9c);font-size:.84rem}
  lib-accordion-item li{margin:3px 0;font-family:var(--mono)}
  .dhint{color:var(--text-secondary,#bcae9c);font-size:.84rem;margin:0 0 14px;max-width:80ch}
  table.diag td.dk{font-family:var(--mono);font-size:.72rem;color:var(--text-secondary,#bcae9c);white-space:nowrap;vertical-align:top}
  table.diag td.dm code{font-family:var(--mono);font-size:.78rem;color:var(--shuniku)}
  table.diag td.dc{font-family:var(--mono);font-size:.74rem;color:var(--text-muted,#8c8072);text-align:right;white-space:nowrap;vertical-align:top}
  footer{margin-top:54px;padding-top:20px;border-top:1px solid var(--border-subtle,#3a3128);color:var(--text-muted,#8c8072);font-size:.78rem;font-family:var(--mono)}
</style>
</head>
<body data-katachi="kintsugi">
<div class="wrap">
  <lib-eyebrow tone="accent" line="left">hanko · 判子 · trust report</lib-eyebrow>
  <h1>Sello de confianza <span class="stamp">●</span></h1>
  <p class="ts">generado ${esc(report.generatedAt)} · ${report.total} componente(s) · ${pct}% sellados</p>
  ${banner}
  <div class="summary">
    <lib-card>
      <span slot="tag" class="k">Total</span>
      <span slot="title" class="v">${report.total}</span>
    </lib-card>
    <lib-card tone="accent" kanji="判">
      <span slot="tag" class="k">Sellados</span>
      <span slot="title" class="v">${report.trusted}</span>
    </lib-card>
    <lib-card>
      <span slot="tag" class="k">Sin sello</span>
      <span slot="title" class="v">${report.untrusted}</span>
    </lib-card>
  </div>
  <lib-progress class="pct" value="${pct}" max="100" tone="accent" show-value
    label="Cobertura del sello" value-label="${pct}% sellados"></lib-progress>

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

  <lib-divider></lib-divider>
  <lib-eyebrow tone="accent" line="left">Hallazgos</lib-eyebrow>
  ${findingsBlock(report.components)}

  ${diagSection}

  <footer>
    hanko · ✓ pasa · ✗ falla · – no evaluado (regla de oro: ausencia ≠ incumplimiento) ·
    visualización con @shibui-ui/ui · spec en docs/specs/trust-report.md
  </footer>
</div>
</body>
</html>`;
}
