import { LitElement, css, unsafeCSS, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../../atoms/icon/lib-icon.component";
import type {
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbSize,
  BreadcrumbSurface,
  BreadcrumbAccent,
} from "./lib-breadcrumb.types";
import { breadcrumbTemplate } from "./lib-breadcrumb.html";
import componentCss from "./lib-breadcrumb.css?inline";
import sharedTokens from "../../../styles/shared/tokens.css?inline";

export interface UiNavigateEventDetail {
  item: BreadcrumbItem;
  index: number;
}

/**
 * @element lib-breadcrumb
 * @fires ui-lib-navigate - Disparado al hacer clic en un crumb con href.
 *
 * @attr {BreadcrumbSeparator} separator - Tipo de separador: slash · chevron · dot · line
 * @attr {BreadcrumbSize}      size      - Tamaño: sm · md · lg
 * @attr {BreadcrumbSurface}   surface   - Superficie: default · filled · pill
 * @attr {BreadcrumbAccent}    accent    - Acento en ítem activo: none · kaki · celadon · bold
 * @attr {boolean}             dark      - Modo superficie oscura
 * @attr {number}              max-visible - Si > 0, colapsa ítems intermedios cuando items.length > N
 */
@customElement("lib-breadcrumb")
export class LibBreadcrumb extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(componentCss)}
    `,
  ];

  /* ── Props públicas ──────────────────────────────────── */

  @property({ type: Array })
  items: BreadcrumbItem[] = [];

  @property({ type: String, reflect: true })
  separator: BreadcrumbSeparator = "slash";

  @property({ type: String, reflect: true })
  size: BreadcrumbSize = "md";

  @property({ type: String, reflect: true })
  surface: BreadcrumbSurface = "default";

  @property({ type: String, reflect: true })
  accent: BreadcrumbAccent = "none";

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Number, attribute: "max-visible" })
  maxVisible = 0;

  /* ── Estado interno ──────────────────────────────────── */

  @state()
  private _expanded = false;

  /* ── Render ──────────────────────────────────────────── */

  override render(): TemplateResult {
    return breadcrumbTemplate({
      items: this.items,
      separator: this.separator,
      size: this.size,
      surface: this.surface,
      accent: this.accent,
      dark: this.dark,
      maxVisible: this.maxVisible,
      expanded: this._expanded,
      onExpand: this._handleExpand.bind(this),
      onNavigate: this._handleNavigate.bind(this),
    });
  }

  /* ── Handlers ────────────────────────────────────────── */

  private _handleExpand(): void {
    this._expanded = true;
  }

  private _handleNavigate(item: BreadcrumbItem, index: number): void {
    this.dispatchEvent(
      new CustomEvent<UiNavigateEventDetail>("ui-lib-navigate", {
        detail: { item, index },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lib-breadcrumb": LibBreadcrumb;
  }
}
