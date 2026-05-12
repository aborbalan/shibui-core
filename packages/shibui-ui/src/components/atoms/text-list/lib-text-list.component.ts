import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import textListCss from './lib-text-list.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { textListTemplate } from './lib-text-list.html';
import type {
  ListFamily,
  ContentItem,
  UiItem,
  UiRow,
  DlItem,
  ContentMarker,
  OrderedCounter,
  ListSize,
  DlLayout,
  ListRowClickDetail,
  ListToggleDetail,
} from './lib-text-list.types';

/**
 * @element lib-text-list
 *
 * Sistema de listas con tres familias:
 *
 * **Content list** (`family="ul" | "ol"`) — listas tipográficas para prosa.
 * Marcadores: default · kaki · dash · check.
 * Contadores (ol): decimal · roman · alpha.
 *
 * **UI list** (`family="ui"`) — filas de interfaz con icono, avatar,
 * meta, badge, toggle, chevron. Soporta separadores y headers de sección.
 *
 * **Description list** (`family="dl"`) — pares clave/valor.
 * Layouts: inline · wide · stack.
 *
 * @prop {ListFamily}       family       — Familia activa (default: 'ul')
 *
 * — Content list —
 * @prop {ContentItem[]}    items        — Ítems de contenido
 * @prop {ContentMarker}    marker       — Tipo de viñeta (default: 'default')
 * @prop {OrderedCounter}   counter      — Tipo de contador ol (default: 'decimal')
 * @prop {ListSize}         size         — Tamaño (default: 'md')
 *
 * — UI list —
 * @prop {UiItem[]}         uiItems      — Filas, separadores y headers
 * @prop {boolean}          divided      — Separadores entre filas
 * @prop {boolean}          bordered     — Borde exterior
 * @prop {boolean}          inset        — Fondo de superficie
 * @prop {boolean}          interactive  — Hover + cursor pointer
 *
 * — Description list —
 * @prop {DlItem[]}         dlItems      — Pares clave/valor
 * @prop {DlLayout}         dlLayout     — Layout (default: 'inline')
 * @prop {boolean}          dlDivided    — Separadores entre pares
 *
 * — Global —
 * @prop {boolean}          dark         — Superficie oscura
 * @prop {boolean}          loading      — Estado de carga (skeleton)
 * @prop {number}           skeletonCount — Número de skeletons (default: 4)
 *
 * @fires ui-lib-row-click — Al hacer clic en una fila UI
 *   Detail: { key: string, item: UiRow }
 * @fires ui-lib-toggle    — Al cambiar un toggle en una fila UI
 *   Detail: { key: string, value: boolean }
 */
@customElement('lib-text-list')
export class LibTextList extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(textListCss)}`,
  ];

  /* ── Familia ── */

  @property({ type: String, reflect: true })
  family: ListFamily = 'ul';

  /* ── Content list ── */

  @property({ type: Array })
  items: ContentItem[] = [];

  @property({ type: String, reflect: true })
  marker: ContentMarker = 'default';

  @property({ type: String, reflect: true })
  counter: OrderedCounter = 'decimal';

  @property({ type: String, reflect: true })
  size: ListSize = 'md';

  /* ── UI list ── */

  @property({ type: Array, attribute: 'ui-items' })
  uiItems: UiItem[] = [];

  @property({ type: Boolean, reflect: true })
  divided = false;

  @property({ type: Boolean, reflect: true })
  bordered = false;

  @property({ type: Boolean, reflect: true })
  inset = false;

  @property({ type: Boolean, reflect: true })
  interactive = false;

  /* ── Description list ── */

  @property({ type: Array, attribute: 'dl-items' })
  dlItems: DlItem[] = [];

  @property({ type: String, reflect: true, attribute: 'dl-layout' })
  dlLayout: DlLayout = 'inline';

  @property({ type: Boolean, reflect: true, attribute: 'dl-divided' })
  dlDivided = false;

  /* ── Global ── */

  @property({ type: Boolean, reflect: true })
  dark = false;

  @property({ type: Boolean, reflect: true })
  loading = false;

  @property({ type: Number, attribute: 'skeleton-count' })
  skeletonCount = 4;

  /* ── Handlers ── */

  private _handleRowClick(item: UiRow): void {
    this.dispatchEvent(
      new CustomEvent<ListRowClickDetail>('ui-lib-row-click', {
        detail: { key: item.key, item },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleToggle(item: UiRow, value: boolean): void {
    this.dispatchEvent(
      new CustomEvent<ListToggleDetail>('ui-lib-toggle', {
        detail: { key: item.key, value },
        bubbles: true,
        composed: true,
      })
    );
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    /* Loading skeleton — solo content list */
    if (this.loading && (this.family === 'ul' || this.family === 'ol')) {
      const skeletons: ContentItem[] = Array.from(
        { length: this.skeletonCount },
        (_, i): ContentItem => ({ label: `skeleton-${i}` })
      );

      return textListTemplate({
        family:        this.family,
        contentItems:  skeletons,
        marker:        'default',
        counter:       this.counter,
        size:          this.size,
        nested:        false,
        uiItems:       [],
        divided:       this.divided,
        bordered:      this.bordered,
        inset:         this.inset,
        interactive:   this.interactive,
        dark:          this.dark,
        dlItems:       [],
        dlLayout:      this.dlLayout,
        dlDivided:     this.dlDivided,
        onRowClick:    (): void => {},
        onToggle:      (): void => {},
      });
    }

    return textListTemplate({
      family:        this.family,
      contentItems:  this.items,
      marker:        this.marker,
      counter:       this.counter,
      size:          this.size,
      nested:        false,
      uiItems:       this.uiItems,
      divided:       this.divided,
      bordered:      this.bordered,
      inset:         this.inset,
      interactive:   this.interactive,
      dark:          this.dark,
      dlItems:       this.dlItems,
      dlLayout:      this.dlLayout,
      dlDivided:     this.dlDivided,
      onRowClick:    (item): void => this._handleRowClick(item),
      onToggle:      (item, v): void => this._handleToggle(item, v),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-text-list': LibTextList;
  }
}