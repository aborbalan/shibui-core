import { LitElement, css, unsafeCSS, TemplateResult, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import timelineCss from './lib-timeline.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type { TimelineSize } from './lib-timeline-item.types';

/**
 * @element lib-timeline
 *
 * Contenedor de timeline. Acepta `<lib-timeline-item>` en su slot.
 *
 * @prop {TimelineSize} size — Tamaño global: sm · md · lg (default: 'md')
 *
 * @slot — Ítems del timeline (lib-timeline-item)
 */
@customElement('lib-timeline')
export class LibTimeline extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(timelineCss)}`,
  ];

  @property({ type: String, reflect: true })
  size: TimelineSize = 'md';

  protected override render(): TemplateResult {
    return html`
      <div class="tl" role="list">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-timeline': LibTimeline;
  }
}