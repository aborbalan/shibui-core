import { LitElement, css, unsafeCSS, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedTokens from "../../../styles/shared/tokens.css?inline";
import cardStyles from "./lib-card.css?inline";
import { cardTemplate } from "./lib-card.html";

export type LibCardVariant =
  | "default"
  | "inverse"
  | "accent"
  | "featured"
  | "kintsugi"
  | "glitch"
  | "celadon"
  | "washi";

/**
 * @element lib-card
 *
 * @attr {'default'|'inverse'|'accent'|'featured'|'kintsugi'|'glitch'|'celadon'|'washi'} variant
 *   - default   → superficie elevada neutra
 *   - inverse   → fondo washi-900 oscuro
 *   - accent    → borde izquierdo de color (`accent-color`)
 *   - featured  → fondo kaki degradado, título grande — pensado para 2 columnas en grid
 *   - kintsugi  → seam de oro animado en borde superior + shimmer en título
 *   - glitch    → estética terminal CRT, scanlines, fuente mono
 *   - celadon   → acento verde-gris japonés para estados de éxito / énfasis secundario
 *   - washi     → paleta neutra cálida, superficie washi-50/100
 *
 * @attr {string}  accent-color - Color del borde (solo variante `accent`).
 * @attr {string}  kanji        - Carácter kanji decorativo de fondo (ej: "渋", "金", "間").
 *
 * @attr {boolean} clickable    - Si está presente, la card emite `ui-lib-card-click` al hacer clic
 * @slot tag    - Etiqueta o metadata en el header.
 * @slot title  - Título principal de la card.
 * @slot        - Cuerpo de la card (default slot).
 * @slot footer - Acciones o información en el footer.
 * @fires ui-lib-card-click - { variant, kanji, originalEvent } — solo cuando `clickable` es true.
 */
@customElement("lib-card")
export class LibCard extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(cardStyles)}
    `,
  ];

  @property({ type: String, reflect: true })
  variant: LibCardVariant = "default";

  @property({ type: String, attribute: "accent-color" })
  accentColor: string | undefined = undefined;

  /** Carácter kanji decorativo mostrado como marca de agua en la esquina superior derecha */
  @property({ type: String })
  kanji = "";

  @property({ type: Boolean, reflect: true })
  clickable = false;

  override render(): TemplateResult {
    return cardTemplate({
      variant: this.variant,
      accentColor: this.accentColor,
      kanji: this.kanji,
      clickable: this.clickable,
      onClick: (e: MouseEvent) => this._onClick(e),
    });
  }

  _onClick(e: MouseEvent): void {
    if (!this.clickable) return;
    this.dispatchEvent(
      new CustomEvent("ui-lib-card-click", {
        detail: { variant: this.variant, kanji: this.kanji, originalEvent: e },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lib-card": LibCard;
  }
}
