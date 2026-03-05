import { html, TemplateResult } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';

export type LibSkeletonShape = 
  | 'line'    // 13px — texto corrido
  | 'title'   // 22px — encabezado secundario
  | 'h1'      // 36px — encabezado principal
  | 'avatar'  // border-radius full — imagen circular
  | 'icon'    // border-radius sm — icono cuadrado
  | 'btn'     // 36px — botón / input
  | 'badge'   // 20px, radius sm — etiqueta
  | 'pill'    // 22px, radius full — chip
  | 'img'     // 160px — imagen rectangular
  | 'rect';   // sin altura propia — bloque libre

export type LibSkeletonAnimation = 'shimmer' | 'wave' | 'pulse';
export type LibSkeletonSurface   = 'light' | 'dark' | 'kaki';

export interface SkeletonTemplateProps {
  shape:     LibSkeletonShape;
  animation: LibSkeletonAnimation;
  surface:   LibSkeletonSurface;
  width:     string;
  height:    string;
}

/**
 * Renderiza un único bloque skeleton.
 * La forma, animación y superficie se controlan vía clases CSS
 * que mapean a :host([shape]) / :host([animation]) / :host([surface]).
 * Width y height opcionales se aplican como inline style.
 */
export function skeletonTemplate(props: SkeletonTemplateProps): TemplateResult {
  const inlineStyles: Record<string, string> = {};
  if (props.width)  inlineStyles['width']  = props.width;
  if (props.height) inlineStyles['height'] = props.height;

  return html`
    <div
      class="sk"
      style=${styleMap(inlineStyles)}
      aria-hidden="true"
      role="presentation"
    ></div>
  `;
}