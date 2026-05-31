import { html, nothing, TemplateResult } from "lit";
import type { LibCardVariant } from "./lib-card.component";
import {
  celadonDecorationLayers,
  parseDecorations,
} from "../../../styles/shared/celadon-decorations";

export interface CardTemplateProps {
  variant: LibCardVariant;
  accentColor: string | undefined;
  kanji: string;
  clickable: boolean;
  decoration: string;
  onClick: (e: MouseEvent) => void;
}

/**
 * Plantilla base para el componente lib-card.
 * Contenedor editorial con slots: tag, title, default (body), footer.
 * Soporta marca de agua kanji opcional en la esquina superior derecha.
 */
export function cardTemplate(props: CardTemplateProps): TemplateResult {
  const hasDecoration = parseDecorations(props.decoration).length > 0;

  return html`
    <article
      class="card ${hasDecoration ? "has-decoration" : ""}"
      role="${props.clickable ? "button" : nothing}"
      tabindex="${props.clickable ? "0" : nothing}"
      @click="${props.clickable ? props.onClick : nothing}"
      style="${props.variant === "accent" && props.accentColor
        ? `--card-accent-color: ${props.accentColor}`
        : nothing}"
    >
      <!-- Decoraciones celadon opt-in — detrás del contenido, aria-hidden -->
      ${celadonDecorationLayers(props.decoration)}

      <!-- Kanji watermark — aria-hidden, decorativo -->
      ${props.kanji
        ? html`<span class="card-kanji" aria-hidden="true"
            >${props.kanji}</span
          >`
        : nothing}

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
