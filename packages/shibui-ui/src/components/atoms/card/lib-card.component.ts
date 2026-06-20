import { LitElement, css, unsafeCSS, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import sharedTokens from "../../../styles/shared/tokens.css?inline";
import celadonDecorations from "../../../styles/shared/celadon-decorations.css?inline";
import cardStyles from "./lib-card.css?inline";
import { cardTemplate } from "./lib-card.html";
import type { LibCardVariant, LibCardSurface, LibCardTone } from "./lib-card.types";

export type { LibCardVariant, LibCardSurface, LibCardTone } from "./lib-card.types";
export type { CeladonDecoration } from "../../../styles/shared/celadon-decorations";

/**
 * @element lib-card
 *
 * @description
 * Superficie de contenido con identidad visual sellada por katachi.
 * Los efectos (seam dorado, scanlines CRT, brutal shadow) se activan
 * automáticamente cuando la card está dentro de un ancestro con
 * `data-katachi="kintsugi|terminal|sabi"` — sin ningún prop adicional.
 *
 * @attr {'solid'|'featured'} variant
 *   - solid    → superficie elevada neutra (era 'default'); adapta al katachi activo
 *   - featured → fondo con gradiente cálido sutil, título grande; para 2 cols en grid
 * @attr {'default'|'inverse'} surface - inverse → fondo invertido (--bg-inverse)
 * @attr {'default'|'accent'}  tone    - accent → borde izquierdo de énfasis (color vía `accent-color`)
 *
 * @attr {string}  accent-color - Color del borde izquierdo (solo variante `accent`).
 * @attr {string}  kanji        - Kanji decorativo de fondo (ej: "渋", "金", "間").
 * @attr {boolean} clickable    - Emite `ui-lib-card-click` al hacer clic.
 * @attr {string}  decoration   - Decoraciones celadon opt-in, separadas por espacio
 *   (ej: "craquelure mist depth reflejo"). Pensadas para `data-katachi="celadon"`.
 *   Valores: craquelure · condensation · depth · mist · reflejo · iridescence.
 *
 * @slot tag    - Etiqueta o metadata en el header (fuente mono, uppercase).
 * @slot title  - Título principal de la card.
 * @slot        - Cuerpo de la card (default slot).
 * @slot footer - Acciones o información en el footer.
 *
 * @fires ui-lib-card-click - { variant, kanji, originalEvent } — solo si `clickable`.
 *
 * @example
 * <!-- En contexto kintsugi: seam dorado automático -->
 * <div data-katachi="kintsugi">
 *   <lib-card kanji="金">
 *     <span slot="title">Reparado en oro</span>
 *   </lib-card>
 * </div>
 */
@customElement("lib-card")
export class LibCard extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(celadonDecorations)}
    `,
    css`
      ${unsafeCSS(cardStyles)}
    `,
  ];

  @property({ type: String, reflect: true })
  variant: LibCardVariant = "solid";

  @property({ type: String, reflect: true })
  surface: LibCardSurface = "default";

  @property({ type: String, reflect: true })
  tone: LibCardTone = "default";

  @property({ type: String, attribute: "accent-color" })
  accentColor: string | undefined = undefined;

  /** Carácter kanji decorativo mostrado como marca de agua en la esquina superior derecha */
  @property({ type: String })
  kanji = "";

  @property({ type: Boolean, reflect: true })
  clickable = false;

  /** Decoraciones celadon opt-in, separadas por espacio (ej: "craquelure mist depth"). */
  @property({ type: String, reflect: true })
  decoration = "";

  override render(): TemplateResult {
    return cardTemplate({
      variant: this.variant,
      tone: this.tone,
      accentColor: this.accentColor,
      kanji: this.kanji,
      clickable: this.clickable,
      decoration: this.decoration,
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
