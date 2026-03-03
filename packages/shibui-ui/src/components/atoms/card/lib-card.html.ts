import { html, nothing, TemplateResult } from 'lit';

export interface CardTemplateProps {
  variant: 'default' | 'inverse' | 'accent';
  accentColor: string | undefined;
}

/**
 * Plantilla base para el componente lib-card.
 * Contenedor editorial con slots: tag, title, default (body), footer.
 */
export function cardTemplate(props: CardTemplateProps): TemplateResult {
  return html`
    <article
      class="card"
      style="${props.variant === 'accent' && props.accentColor
        ? `--card-accent-color: ${props.accentColor}`
        : nothing}"
    >
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