import { getPixel, type Bitmap } from '../core/bitmap';

export interface SvgOptions {
  /** Tamaño de celda en px (default 1). */
  cell?: number;
  /** Color de tinta (default '#000'). */
  ink?: string;
  /** Añade marcas de registro en las esquinas (default false). */
  registration?: boolean;
}

function registrationMarks(w: number, h: number, color: string): string {
  const s = Math.max(3, Math.round(Math.min(w, h) * 0.05));
  const t = Math.max(1, Math.round(s / 6));
  const mark = (x: number, y: number, dx: number, dy: number): string =>
    `<path d="M${x} ${y} h${dx * s} M${x} ${y} v${dy * s}" stroke="${color}" stroke-width="${t}" fill="none"/>`;
  return `<g>${mark(0, 0, 1, 1)}${mark(w, 0, -1, 1)}${mark(0, h, 1, -1)}${mark(w, h, -1, -1)}</g>`;
}

// Una capa (o cualquier bitmap) → SVG con fondo transparente. Un <rect> por celda de tinta.
export function toSVG(layer: Bitmap, options: SvgOptions = {}): string {
  const cell = options.cell ?? 1;
  const ink = options.ink ?? '#000';
  const w = layer.width * cell;
  const h = layer.height * cell;
  const rects: string[] = [];
  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      if (getPixel(layer, x, y)) {
        rects.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`);
      }
    }
  }
  const reg = options.registration ? registrationMarks(w, h, ink) : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">` +
    `<g fill="${ink}">${rects.join('')}</g>${reg}</svg>`
  );
}
