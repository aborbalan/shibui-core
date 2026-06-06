/* ============================================================
   CHARTS · chart-resize.controller — ancho responsive del SVG
   ReactiveController que encapsula el ResizeObserver + medida
   inicial que bar/scatter/line necesitan de forma idéntica.
   ============================================================ */

import type { ReactiveController, ReactiveControllerHost } from 'lit';

type ChartHost = ReactiveControllerHost & HTMLElement;

/**
 * Observa el ancho del host y lo expone en `.width` (px), solicitando
 * un re-render cuando cambia. Reemplaza el bloque ResizeObserver +
 * `_svgWidth` + `firstUpdated` que se repetía en cada gráfica.
 *
 * @example
 * private _resize = new ChartResizeController(this);
 * // …
 * svgWidth: this._resize.width,
 */
export class ChartResizeController implements ReactiveController {
  /** Ancho actual del host en px. Default 600 hasta la primera medida. */
  width = 600;

  private readonly host: ChartHost;
  private ro: ResizeObserver | null = null;

  constructor(host: ChartHost) {
    this.host = host;
    host.addController(this);
  }

  hostConnected(): void {
    const initial = this.host.clientWidth;
    if (initial) this.width = initial;

    this.ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w !== undefined && Math.round(w) !== Math.round(this.width)) {
        this.width = w;
        this.host.requestUpdate();
      }
    });
    this.ro.observe(this.host);
  }

  hostDisconnected(): void {
    this.ro?.disconnect();
    this.ro = null;
  }
}
