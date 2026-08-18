import { html, css, unsafeCSS, TemplateResult, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import '../../atoms/close-button/lib-close-button.component';
import { tabsTemplate } from "./lib-tabs.html";
import tabsCss from "./lib-tabs.css?inline";
import sharedTokens from "../../../styles/shared/tokens.css?inline";
import type {
  TabItem,
  TabsDisplay,
  TabsTone,
  TabsSize,
} from "./lib-tabs.types";

/**
 * lib-tabs — Componente de pestañas Shibui (SG-60)
 *
 * @prop display    — 'underline' | 'pill' | 'card' | 'outline' | 'vertical'
 * @prop tone       — 'default' | 'accent' | 'info'
 * @prop size       — 'sm' | 'md' | 'lg'
 * @prop dark       — surface oscura
 * @prop gold       — ink bar animada dorada (era kintsugi)
 * @prop glitch     — efecto RGB split en tab activo
 * @prop scrollable — overflow-x scroll en la lista
 * @prop full     — tabs en grid de columnas iguales
 * @prop active   — id del tab activo
 * @prop items    — array de TabItem
 *
 * Panels: cada TabItem con id="X" se muestra via <slot name="X">.
 * El usuario añade <div slot="X">contenido</div> como hijo de lib-tabs.
 *
 * @prop {boolean} closable  — muestra botón × en todos los tabs (item.closable sobreescribe por tab)
 *
 * ── Extras estilo IDE (opt-in, apagados por defecto) ──
 * @prop {boolean} newTab      — muestra un botón "+" al final de la lista (attribute: new-tab)
 * @prop {boolean} reorderable — permite reordenar los tabs arrastrándolos
 *
 * @fires ui-lib-tab-change  — {detail: { id: string; prev: string }}
 * @fires ui-lib-tab-close   — {detail: { id: string }} — al pulsar × o hacer click central
 * @fires ui-lib-tab-new     — void — al pulsar el botón "+"
 * @fires ui-lib-tab-reorder — {detail: { id: string; fromIndex: number; toIndex: number }}
 */
@customElement("lib-tabs")
export class LibTabs extends LitElement {
  static override styles = [
    css`
      ${unsafeCSS(sharedTokens)}
    `,
    css`
      ${unsafeCSS(tabsCss)}
    `,
  ];

  @property({ type: String, reflect: true })
  display: TabsDisplay = "underline";

  @property({ type: String, reflect: true })
  tone: TabsTone = "default";

  @property({ type: String, reflect: true })
  size?: TabsSize;

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  gold = false;

  @property({ type: Boolean, reflect: true })
  glitch = false;

  @property({ type: Boolean, reflect: true })
  scrollable = false;

  @property({ type: Boolean, reflect: true })
  full = false;

  @property({ type: String, reflect: true })
  active = "";

  /** aria-label para el tablist */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel = "";

  /** Muestra botón × en todos los tabs (puede sobreescribirse con item.closable). */
  @property({ type: Boolean, reflect: true })
  closable = false;

  /** Extra IDE (opt-in): muestra un botón "+" al final de la lista de tabs. */
  @property({ type: Boolean, reflect: true, attribute: 'new-tab' })
  newTab = false;

  /** Extra IDE (opt-in): permite reordenar los tabs arrastrándolos. */
  @property({ type: Boolean, reflect: true })
  reorderable = false;

  @property({ type: Array, hasChanged: () => true })
  items: TabItem[] = [];

  /** Índice del tab que se está arrastrando (reorder), o null. */
  @state() _dragIndex: number | null = null;

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
      changed.has("display")
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
    const noInkDisplays: TabsDisplay[] = [
      "pill",
      "card",
      "outline",
      "vertical",
    ];
    if (noInkDisplays.includes(this.display)) return;

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

  _handleClose(e: Event, id: string): void {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent('ui-lib-tab-close', {
        detail: { id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /* ── Extras IDE (opt-in) ── */

  /** Click central del ratón sobre un tab cerrable → cierra (patrón navegador/IDE). */
  _handleAuxClick(e: MouseEvent, item: TabItem): void {
    if (e.button !== 1) return; // solo botón central
    const closable = item.closable !== undefined ? item.closable : this.closable;
    if (!closable) return;
    e.preventDefault();
    this._handleClose(e, item.id);
  }

  /** Botón "+" → emite ui-lib-tab-new para que el host añada una pestaña. */
  _handleNew(): void {
    this.dispatchEvent(
      new CustomEvent('ui-lib-tab-new', { bubbles: true, composed: true }),
    );
  }

  /* ── Reorder por drag (solo si reorderable) ── */

  _handleDragStart(e: DragEvent, index: number): void {
    if (!this.reorderable) return;
    this._dragIndex = index;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      // Necesario en Firefox para que arranque el drag.
      e.dataTransfer.setData('text/plain', String(index));
    }
  }

  _handleDragOver(e: DragEvent): void {
    if (!this.reorderable || this._dragIndex === null) return;
    e.preventDefault(); // habilita el drop
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  }

  _handleDrop(e: DragEvent, toIndex: number): void {
    if (!this.reorderable || this._dragIndex === null) return;
    e.preventDefault();
    const fromIndex = this._dragIndex;
    this._dragIndex = null;
    if (fromIndex === toIndex) return;

    const moved = this.items[fromIndex];
    if (!moved) return;

    this.dispatchEvent(
      new CustomEvent('ui-lib-tab-reorder', {
        detail: { id: moved.id, fromIndex, toIndex },
        bubbles: true,
        composed: true,
      }),
    );
  }

  _handleDragEnd(): void {
    this._dragIndex = null;
  }

  _handleClick(e: CustomEvent): void {
    const targetId = (e.target as HTMLElement).id;

    const tabs = Array.from(
      this.shadowRoot?.querySelectorAll<HTMLButtonElement>(
        ".tb-tab:not(.is-disabled)",
      ) ?? [],
    );

    const selectedTab = tabs.find((tab) => tab.id === targetId);

    if (!selectedTab) return; // Si no lo encuentra, abortamos la función

    this._activateTab(selectedTab?.dataset["id"] ?? "");
    selectedTab.focus();
  }

  /* ── Keyboard navigation ── */

  _handleKey(e: KeyboardEvent): void {
    const isVertical = this.display === "vertical";
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
