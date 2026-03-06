import { html, nothing, TemplateResult } from 'lit';

export type LibEmptyStateTone   = 'neutral' | 'kaki' | 'celadon' | 'error';
export type LibEmptyStateLayout = 'default' | 'inline';
export type LibEmptyStateSize   = 'sm' | 'md';

export interface EmptyStateTemplateProps {
  heading:     string;
  description: string;
  kanji:       string;
  tone:        LibEmptyStateTone;
  layout:      LibEmptyStateLayout;
  size:        LibEmptyStateSize;
  bordered:    boolean;
  ghost:       boolean;
}

/**
 * Template para lib-empty-state.
 *
 * Estructura (ambos layouts):
 *   div.es
 *     div.es-illustration     ← kanji | icon-wrap[slot=illustration]
 *     div.es-body
 *       h3.es-title
 *       p.es-desc
 *       div.es-actions
 *         slot[name=actions]
 *
 * La zona de ilustración se omite si no hay kanji ni slot.
 * El CSS diferencia .es-inline (row) de .es (column).
 */
export function emptyStateTemplate(props: EmptyStateTemplateProps): TemplateResult {
  const illustrationZone = props.kanji
    ? html`
        <div class="es-illustration">
          <span class="es-kanji">${props.kanji}</span>
        </div>
      `
    : html`
        <div class="es-illustration">
          <div class="es-icon-wrap">
            <slot name="illustration"></slot>
          </div>
        </div>
      `;

  return html`
    <div class="es
      ${props.layout  === 'inline'  ? 'es-inline'  : ''}
      ${props.size    === 'sm'      ? 'es-sm'      : ''}
      ${props.tone    !== 'neutral' ? `es-${props.tone}` : ''}
      ${props.bordered              ? 'es-bordered' : ''}
      ${props.ghost                 ? 'es-ghost'   : ''}
    ">
      ${illustrationZone}
      <div class="es-body">
        ${props.heading
          ? html`<h3 class="es-title">${props.heading}</h3>`
          : nothing}
        ${props.description
          ? html`<p class="es-desc">${props.description}</p>`
          : nothing}
        <div class="es-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  `;
}