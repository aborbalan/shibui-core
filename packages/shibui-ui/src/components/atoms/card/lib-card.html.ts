import { html, nothing, TemplateResult } from 'lit';
import type { LibCardVariant } from './lib-card.component';

export interface CardTemplateProps {
  variant:     LibCardVariant;
  accentColor: string | undefined;
  kanji:       string;
}

/**
 * Plantilla base para el componente lib-card.
 * Contenedor editorial con slots: tag, title, default (body), footer.
 * Soporta marca de agua kanji opcional en la esquina superior derecha.
 */
export function cardTemplate(props: CardTemplateProps): TemplateResult {
  return html`
    <article
      class="card"
      style="${props.variant === 'accent' && props.accentColor
        ? `--card-accent-color: ${props.accentColor}`
        : nothing}"
    >
      <!-- Kanji watermark — aria-hidden, decorativo -->
      ${props.kanji
        ? html`<span class="card-kanji" aria-hidden="true">${props.kanji}</span>`
        : nothing
      }

      <header class="card-header">
        <slot name="tag"></slot>
      </header>

      <div class="card-content">
        <slot name="title"></slot>
        <div class="card-body">
          <slot></slot>
        </div>
      </div>

      <footer class="card-footer">
        <slot name="footer"></slot>
      </footer>
    </article>
  `;
}