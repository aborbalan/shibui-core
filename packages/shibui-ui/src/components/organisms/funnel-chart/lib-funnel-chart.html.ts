import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin } from '../../../../models/ui/charts';
import type { FunnelChartTemplateProps } from './lib-funnel-chart.types';
import { formatTick, renderEmptyState, renderTooltip } from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const M: ChartMargin = { top: 10, right: 10, bottom: 10, left: 10 };
const GAP = 4;                 /* hueco vertical entre bandas */
const LABEL_MIN_W = 64;        /* ancho mínimo de banda para rotular dentro */

function pct(value: number, base: number): number {
  return base > 0 ? (value / base) * 100 : 0;
}

function fmtPct(p: number): string {
  return `${p >= 10 ? p.toFixed(0) : p.toFixed(1)}%`;
}

/* ─── Template principal ──────────────────────────────────── */

export function funnelChartTemplate(props: FunnelChartTemplateProps): TemplateResult {
  const { stages, colors, showValues, height, svgWidth, tooltip, onStageEnter, onStageLeave } = props;

  const n       = stages.length;
  const vMax    = Math.max(0, ...stages.map(s => s.value));
  const vTop    = stages[0]?.value ?? 0;
  const isEmpty = n === 0 || vMax <= 0;

  const innerW = Math.max(svgWidth - M.left - M.right, 0);
  const innerH = Math.max(height   - M.top  - M.bottom, 0);
  const cx     = svgWidth / 2;
  const bandH  = n > 0 ? (innerH - GAP * (n - 1)) / n : innerH;

  const widthOf = (v: number): number => (vMax > 0 ? (v / vMax) * innerW : 0);

  const bands = svg`
    ${stages.map((s, i) => {
      const topY  = M.top + i * (bandH + GAP);
      const botY  = topY + bandH;
      const topW  = Math.max(widthOf(s.value), 1);
      const botW  = Math.max(widthOf(stages[i + 1]?.value ?? s.value), 1);
      const color = s.color ?? colors[i % colors.length]!;

      const path  = `M ${cx - topW / 2} ${topY} L ${cx + topW / 2} ${topY} `
                  + `L ${cx + botW / 2} ${botY} L ${cx - botW / 2} ${botY} Z`;
      const midY  = topY + bandH / 2;
      const wide  = topW >= LABEL_MIN_W;

      return svg`
        <g class="funnel-stage">
          <path
            d=${path}
            class="funnel-band"
            style="fill: ${color}"
            @mouseenter=${(e: MouseEvent): void => { onStageEnter(e, i); }}
            @mouseleave=${(): void => { onStageLeave(); }}
          ></path>
          ${wide
            ? svg`
                <text x=${cx} y=${midY - (showValues ? 5 : 0)} text-anchor="middle" dominant-baseline="central" class="funnel-label">${s.label}</text>
                ${showValues
                  ? svg`<text x=${cx} y=${midY + 11} text-anchor="middle" dominant-baseline="central" class="funnel-value">${formatTick(s.value)} · ${fmtPct(pct(s.value, vTop))}</text>`
                  : nothing}
              `
            : nothing}
        </g>
      `;
    })}
  `;

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Funnel chart"
      >
        ${isEmpty ? renderEmptyState(M, innerW, innerH) : bands}
      </svg>
      ${renderTooltip(tooltip)}
    </div>
  `;
}
