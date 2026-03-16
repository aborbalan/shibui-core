import { html, css, unsafeCSS, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { tabsTemplate } from "./lib-tabs.html";
import tabsCss from "./lib-tabs.css?inline";
import sharedTokens from "../../../styles/shared/tokens.css?inline";
import { LibListModel } from "../../../../architecture/base-components/lib-list.model";
import type {
  TabItem,
  TabsVariant,
  TabsColor,
  TabsSize,
} from "./lib-tabs.types";

/**
 * lib-tabs — Componente de pestañas Shibui (SG-60)
 *
 * @prop variant  — 'underline' | 'pill' | 'card' | 'outline' | 'vertical'
 * @prop color    — 'kaki' | 'celadon'
 * @prop size     — 'sm' | 'md' | 'lg'
 * @prop dark     — surface oscura
 * @prop kintsugi — ink bar animada dorada
 * @prop glitch   — efecto RGB split en tab activo
 * @prop scroll   — overflow-x scroll en la lista
 * @prop full     — tabs en grid de columnas iguales
 * @prop active   — id del tab activo
 * @prop items    — array de TabItem
 *
 * Panels: cada TabItem con id="X" se muestra via <slot name="X">.
 * El usuario añade <div slot="X">contenido</div> como hijo de lib-tabs.
 *
 * @fires ui-lib-tab-change — {detail: { id: string; prev: string }}
 */
@customElement("lib-tabs")
export class LibTabs extends LibListModel<TabItem> {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(tabsCss)}
    `,
  ];

  @property({ type: String, reflect: true })
  variant: TabsVariant = "underline";

  @property({ type: String, reflect: true })
  color: TabsColor | "" = "";

  @property({ type: String, reflect: true })
  size: TabsSize | "" = "";

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  kintsugi = false;

  @property({ type: Boolean, reflect: true })
  glitch = false;

  @property({ type: Boolean, reflect: true, attribute: "scroll" })
  scrollable = false;

  @property({ type: Boolean, reflect: true })
  full = false;

  @property({ type: String, reflect: true })
  active = "";

  /** aria-label para el tablist */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel = "";

  /* ── Internal state para la ink bar ── */
  @state() _inkLeft = 0;
  @state() _inkWidth = 0;

  private _ro: ResizeObserver | null = null;

  /* ── Lifecycle ── */

  override firstUpdated(): void {
    this._setupResizeObserver();
    // Aseguramos que el primer tab activo tiene ink bar correcta
    requestAnimationFrame((): void => this._positionInk());
  }

  override updated(changed: Map<string, unknown>): void {
    super.updated?.(changed);
    if (
      changed.has("active") ||
      changed.has("items") ||
      changed.has("variant")
    ) {
      requestAnimationFrame((): void => this._positionInk());
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
  }

  /* ── Ink bar ── */

  private _positionInk(): void {
    /* Solo aplica a variantes con ink bar */
    const noInkVariants: TabsVariant[] = [
      "pill",
      "card",
      "outline",
      "vertical",
    ];
    if (noInkVariants.includes(this.variant)) return;

    const list = this.shadowRoot?.querySelector<HTMLElement>(".tb-list");
    const activeTab =
      this.shadowRoot?.querySelector<HTMLElement>(".tb-tab.is-active");
    if (!list || !activeTab) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    this._inkLeft = tabRect.left - listRect.left;
    this._inkWidth = tabRect.width;
  }

  private _setupResizeObserver(): void {
    const list = this.shadowRoot?.querySelector<HTMLElement>(".tb-list");
    if (!list) return;
    this._ro = new ResizeObserver((): void => this._positionInk());
    this._ro.observe(list);
  }

  /* ── Tab activation ── */

  private _activateTab(id: string): void {
    if (id === this.active) return;
    const prev = this.active;
    this.active = id;

    /* Scroll tab into view si está en modo scrollable */
    if (this.scrollable) {
      const tab = this.shadowRoot?.querySelector<HTMLElement>(
        `[data-id="${id}"]`,
      );
      tab?.scrollIntoView({
        inline: "nearest",
        block: "nearest",
        behavior: "smooth",
      });
    }

    this.dispatchEvent(
      new CustomEvent("ui-lib-tab-change", {
        detail: { id, prev },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleClick(e: CustomEvent):void {
    const targetId = (e.target as HTMLElement).id;

    const tabs = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(
        ".tb-tab:not(.is-disabled)",
      ) ?? [],
    );

    const selectedTab = tabs.find((tab) => tab.id === targetId);
    console.log(selectedTab);

    if (!selectedTab) return; // Si no lo encuentra, abortamos la función

    this._activateTab(selectedTab?.dataset["id"] ?? "");
    selectedTab.focus();
  }

  /* ── Keyboard navigation ── */

  _handleKey(e: KeyboardEvent): void {
    const isVertical = this.variant === "vertical";
    const tabs = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(
        ".tb-tab:not(.is-disabled)",
      ) ?? [],
    );
    const current = tabs.findIndex((t) => t.dataset["id"] === this.active);

    let next = -1;

    if (
      (e.key === "ArrowRight" && !isVertical) ||
      (e.key === "ArrowDown" && isVertical)
    ) {
      e.preventDefault();
      next = (current + 1) % tabs.length;
    } else if (
      (e.key === "ArrowLeft" && !isVertical) ||
      (e.key === "ArrowUp" && isVertical)
    ) {
      e.preventDefault();
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      next = tabs.length - 1;
    }

    if (next >= 0) {
      const target = tabs[next];
      if (target?.dataset["id"]) {
        this._activateTab(target.dataset["id"]);
        target.focus();
      }
    }
  }

  /* ── renderItem (LibListModel) — fallback para modo loading ── */
  protected renderItem(item: TabItem): TemplateResult {
    return html`<button class="tb-tab">${item.label}</button>`;
  }

  /* ── Render principal ── */
  protected override render(): TemplateResult {
    return tabsTemplate(this);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lib-tabs": LibTabs;
  }
}
