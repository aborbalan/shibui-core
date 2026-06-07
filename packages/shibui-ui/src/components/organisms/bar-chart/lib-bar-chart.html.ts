import { html, svg, nothing, type TemplateResult } from 'lit';
import type { ChartMargin, ChartSeries } from '../../../../models/ui/charts';
import type { BarChartTemplateProps } from './lib-bar-chart.types';
import {
  niceAxis, linearScale, bandScale,
  groupedMax, stackedMax,
  renderAxes, renderGrid, renderYTicks, renderBandLabels,
  renderAxisTitles, renderEmptyState, renderTooltip, renderLegend,
} from '../../../shared/charts';

/* ─── Layout ─────────────────────────────────────────────── */
const M: ChartMargin = { top: 20, right: 20, bottom: 60, left: 56 };
const BAR_RX = 2; /* radio de esquinas */

/* ─── Marcas (barras) ─────────────────────────────────────── */

function renderGroupedBars(
  series:     ChartSeries[],
  categories: string[],
  colors:     readonly string[],
  groupStart: (ci: number) => number,
  groupWidth: number,
  scaleY:     (v: number) => number,
  baselineY:  number,
  onEnter:    (e: MouseEvent, si: number, ci: number, v: number) => void,
  onLeave:    () => void,
): TemplateResult {
  const numSeries  = series.length;
  const groupPad   = groupWidth * 0.15;
  const barGroupW  = groupWidth - groupPad * 2;
  const barSlotW   = numSeries > 0 ? barGroupW / numSeries : barGroupW;
  const barSpacing = barSlotW * 0.08;
  const barW       = Math.max(barSlotW - barSpacing, 1);

  return svg`
    ${series.map((s, si) => svg`
      <g class="series-group">
        ${categories.map((_cat, ci) => {
          const value  = s.values[ci] ?? 0;
          const barTop = scaleY(value);
          const barH   = Math.max(baselineY - barTop, 0);
          const x      = groupStart(ci) + groupPad + si * barSlotW + barSpacing / 2;

          return svg`
            <rect
              x=${x}
              y=${barTop}
              width=${barW}
              height=${barH}
              rx=${BAR_RX}
              class="bar"
              style="fill: ${colors[si % colors.length]}"
              @mouseenter=${(e: MouseEvent): void => { onEnter(e, si, ci, value); }}
              @mouseleave=${(): void => { onLeave(); }}
            />
          `;
        })}
      </g>
    `)}
  `;
}

function renderStackedBars(
  series:     ChartSeries[],
  categories: string[],
  colors:     readonly string[],
  groupStart: (ci: number) => number,
  groupWidth: number,
  scaleY:     (v: number) => number,
  baselineY:  number,
  onEnter:    (e: MouseEvent, si: number, ci: number, v: number) => void,
  onLeave:    () => void,
): TemplateResult {
  const groupPad = groupWidth * 0.2;
  const barW     = Math.max(groupWidth - groupPad * 2, 1);

  return svg`
    ${categories.map((_cat, ci) => {
      let cumulative = 0;
      return svg`
        <g class="stack-group">
          ${series.map((s, si) => {
            const value  = s.values[ci] ?? 0;
            const base   = cumulative;
            cumulative  += value;
            const barTop = scaleY(cumulative);
            const baseY  = Math.min(scaleY(base), baselineY);
            const barH   = Math.max(baseY - barTop, 0);

            return svg`
              <rect
                x=${groupStart(ci) + groupPad}
                y=${barTop}
                width=${barW}
                height=${barH}
                rx=${si === series.length - 1 ? BAR_RX : 0}
                class="bar"
                style="fill: ${colors[si % colors.length]}"
                @mouseenter=${(e: MouseEvent): void => { onEnter(e, si, ci, value); }}
                @mouseleave=${(): void => { onLeave(); }}
              />
            `;
          })}
        </g>
      `;
    })}
  `;
}

/* ─── Template principal ──────────────────────────────────── */

export function barChartTemplate(props: BarChartTemplateProps): TemplateResult {
  const {
    series, categories, colors, xLabel, yLabel,
    showGrid, showLegend, mode, height, svgWidth,
    tooltip, onBarEnter, onBarLeave,
  } = props;

  const innerW  = Math.max(svgWidth - M.left - M.right, 0);
  const innerH  = Math.max(height   - M.top  - M.bottom, 0);
  const isEmpty = series.length === 0 || categories.length === 0;

  const rawMax = mode === 'stacked'
    ? stackedMax(series, categories.length)
    : groupedMax(series);

  const { domain, ticks } = niceAxis(0, rawMax, { zeroAnchored: true });

  const band      = bandScale(categories.length, [M.left, M.left + innerW]);
  const scaleY    = linearScale(domain, [M.top + innerH, M.top]);
  const baselineY = M.top + innerH;

  return html`
    <div class="chart-wrapper">
      <svg
        class="chart-svg"
        width=${svgWidth}
        height=${height}
        role="img"
        aria-label="Bar chart"
      >
        ${showGrid && !isEmpty
          ? renderGrid({ m: M, innerW, innerH, yTicks: ticks.filter(t => t > 0), scaleY })
          : nothing}
        ${renderAxes(M, innerW, innerH)}
        ${renderYTicks(M, ticks, scaleY)}
        ${renderBandLabels(M, categories, band.center, innerH)}
        ${renderAxisTitles(M, xLabel, yLabel, innerW, innerH, height)}
        ${isEmpty
          ? renderEmptyState(M, innerW, innerH)
          : mode === 'stacked'
            ? renderStackedBars(series, categories, colors, band.start, band.bandWidth, scaleY, baselineY, onBarEnter, onBarLeave)
            : renderGroupedBars(series, categories, colors, band.start, band.bandWidth, scaleY, baselineY, onBarEnter, onBarLeave)}
      </svg>
      ${renderTooltip(tooltip)}
      ${renderLegend(series.map(s => s.name), colors, showLegend, 'square')}
    </div>
  `;
}
