/* @legacy-katachi-reference
 * ─────────────────────────────────────────────────────────────
 * Este archivo es una COPIA de referencia del estado anterior al
 * sistema katachi sellado. NO se importa ni se compila.
 * Documenta cómo se definían los estilos palette-named por variant.
 * ───────────────────────────────────────────────────────────── */
import { html, nothing, TemplateResult } from 'lit';

/**
 * Variantes visuales del badge.
 * TODO: mover a src/models/ui/ cuando se integre en el monorepo.
 */
export type LibBadgeVariant =
  | 'default'
  | 'accent'
  | 'celadon'
  | 'dark'
  | 'error'
  | 'success'
  | 'warning';

export type LibBadgeSize = 'sm' | 'md';

export interface BadgeTemplateProps {
  variant: LibBadgeVariant;
  size: LibBadgeSize;
  dot: boolean;
  pill: boolean;
}

/**
 * Plantilla para lib-badge.
 * El contenido se proyecta mediante <slot> para máxima flexibilidad.
 */
export function badgeTemplate(props: BadgeTemplateProps): TemplateResult {
  return html`
    <span class="badge">
      ${props.dot ? html`<span class="badge__dot" aria-hidden="true"></span>` : nothing}
      <slot></slot>
    </span>
  `;
}
