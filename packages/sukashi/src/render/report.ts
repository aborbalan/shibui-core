import type { MultiCoverMetric } from '../core/multicover';

// Una fila del reporte: el resultado de un tejido multi-cover con su métrica.
export interface ContrastReportEntry {
  /** Etiqueta legible del caso (p. ej. "kanji 水 × seigaiha"). */
  readonly title: string;
  /** Covers usados, para contexto (p. ej. "seigaiha + asanoha"). */
  readonly cover?: string;
  readonly metric: MultiCoverMetric;
  /** true si el caso cayó a capas ruido. */
  readonly fellBack?: boolean;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;',
  );
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`;
}

function statusBadge(entry: ContrastReportEntry): string {
  if (entry.fellBack) return '<span class="badge fb">fallback</span>';
  if (entry.metric.belowThreshold) return '<span class="badge warn">bajo umbral</span>';
  return '<span class="badge ok">ok</span>';
}

function row(entry: ContrastReportEntry): string {
  const m = entry.metric;
  const contrast = m.contrast.map((c) => pct(c)).join(' · ');
  const fidelity = m.fidelity
    .map((f, i) => `${i === 0 ? 'pivote' : `p${i - 1}`} ${pct(f)}`)
    .join(' · ');
  const warns = m.warnings.length
    ? `<ul class="warns">${m.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>`
    : '<span class="muted">—</span>';
  return (
    `<tr>` +
    `<td><div class="title">${esc(entry.title)}</div>${entry.cover ? `<div class="muted">${esc(entry.cover)}</div>` : ''}</td>` +
    `<td>${statusBadge(entry)}</td>` +
    `<td class="num">${contrast}</td>` +
    `<td class="num">${fidelity}</td>` +
    `<td>${warns}</td>` +
    `</tr>`
  );
}

// Reporte de contraste/fidelidad para una tanda de tejidos multi-cover (F6).
// Documento HTML autónomo (sin dependencias), en el registro estético del roadmap.
export function renderContrastReport(entries: readonly ContrastReportEntry[]): string {
  const ok = entries.filter((e) => !e.metric.belowThreshold && !e.fellBack).length;
  const rows = entries.map(row).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>sukashi · reporte de contraste</title>
<style>
  :root{--bg:#0f1318;--panel:#1a2029;--panel-2:#222a35;--ink:#e6ecf2;--ink-soft:#a9b6c4;
    --ink-faint:#7c8a99;--line:#2c3640;--ai:#5b8fb9;--celadon:#7fae9b;--celadon-deep:#4f7d6c;
    --beni:#c8623a;--gold:#d9a441;--mono:ui-monospace,"Cascadia Code",Consolas,monospace;
    --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
    --serif:"Iowan Old Style",Georgia,serif;}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);line-height:1.6}
  .wrap{max-width:960px;margin:0 auto;padding:56px 28px 100px}
  .kicker{font-family:var(--mono);font-size:.74rem;letter-spacing:.28em;text-transform:uppercase;color:var(--ai);margin:0 0 12px}
  h1{font-family:var(--serif);font-weight:600;font-size:2.2rem;margin:0 0 14px;letter-spacing:-.01em}
  .lede{color:var(--ink-soft);max-width:64ch;margin:0 0 28px}
  .summary{display:flex;gap:12px;flex-wrap:wrap;margin:0 0 30px}
  .chip{font-family:var(--mono);font-size:.78rem;background:var(--panel-2);border:1px solid var(--line);border-radius:999px;padding:7px 14px;color:var(--ink-soft)}
  .chip b{color:var(--celadon)}
  table{width:100%;border-collapse:collapse;font-size:.9rem}
  th,td{text-align:left;padding:12px 14px;border-bottom:1px solid var(--line);vertical-align:top}
  th{font-family:var(--mono);font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint);font-weight:600}
  tr:hover td{background:var(--panel)}
  .title{font-weight:600}
  .muted{color:var(--ink-faint);font-size:.82rem}
  .num{font-family:var(--mono);color:var(--ink-soft);white-space:nowrap}
  .badge{font-family:var(--mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:6px;border:1px solid}
  .badge.ok{color:var(--celadon);border-color:var(--celadon-deep);background:rgba(127,174,155,.1)}
  .badge.warn{color:var(--gold);border-color:#6e5a2e;background:rgba(217,164,65,.1)}
  .badge.fb{color:var(--beni);border-color:#7a3a24;background:rgba(200,98,58,.1)}
  .warns{margin:0;padding-left:18px;color:var(--gold)}
  .warns li{font-size:.8rem}
  footer{margin-top:42px;padding-top:20px;border-top:1px solid var(--line);color:var(--ink-faint);font-size:.82rem;font-family:var(--mono)}
</style>
</head>
<body>
<div class="wrap">
  <p class="kicker">sukashi · 透かし · F6</p>
  <h1>Reporte de contraste</h1>
  <p class="lede">Métrica de cada tejido multi-motivo con cover: contraste de revelado por
  emparejamiento (pivote + pétalo) y fidelidad de cada capa frente a su cover. Bajo umbral →
  <em>fallback</em> a capas ruido + aviso.</p>
  <div class="summary">
    <span class="chip">Casos: <b>${entries.length}</b></span>
    <span class="chip">En umbral: <b>${ok}</b></span>
    <span class="chip">Avisos: <b>${entries.length - ok}</b></span>
  </div>
  <table>
    <thead><tr><th>Caso</th><th>Estado</th><th>Contraste (por par)</th><th>Fidelidad (por capa)</th><th>Avisos</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer>sukashi · reporte generado por <code>renderContrastReport</code> · métrica de F6</footer>
</div>
</body>
</html>`;
}
