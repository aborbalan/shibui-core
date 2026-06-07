/* ============================================================
   CHARTS · barrel — primitivas compartidas de visualización
   ============================================================ */

export { formatTick, truncate } from './format';
export { niceAxis, linearScale, bandScale } from './scales';
export type { NiceAxisOptions, BandScale } from './scales';
export { SERIES_COLORS, seriesColor } from './series-colors';
export { groupedMax, stackedMax } from './stacking';
export { tooltipAnchor } from './interaction';
export { ChartResizeController } from './chart-resize.controller';
export {
  renderAxes,
  renderGrid,
  renderYTicks,
  renderXTicks,
  renderBandLabels,
  renderAxisTitles,
  renderEmptyState,
  renderTooltip,
  renderLegend,
} from './chart-frame.html';
export type { GridOptions } from './chart-frame.html';
