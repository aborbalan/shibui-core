import { LitElement, TemplateResult, css, unsafeCSS } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import treeSelectCss from './lib-tree-select.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import type {
  TreeNode,
  TreeNodeState,
  TreeSelectChangeDetail,
  TreeSelectConfirmDetail,
} from './lib-tree-node.types';
import { treeSelectTemplate } from './lib-tree-select.component.html';

/**
 * @element lib-tree-select
 *
 * Selector jerárquico con soporte multi-nivel, propagación bidireccional
 * de selección, búsqueda y variantes dropdown / inline / single / multi.
 *
 * @prop {TreeNode[]} nodes         — Árbol de datos
 * @prop {boolean}   multi          — Selección múltiple (con checkboxes)
 * @prop {boolean}   inline         — Sin dropdown, árbol directo en layout
 * @prop {boolean}   searchable     — Mostrar barra de búsqueda
 * @prop {boolean}   open           — Estado del dropdown (reflected)
 * @prop {boolean}   disabled       — Deshabilitado (reflected)
 * @prop {string}    placeholder    — Texto cuando no hay selección
 * @prop {string}    empty-text     — Texto sin resultados de búsqueda
 * @prop {string}    label          — Etiqueta opcional encima del trigger
 *
 * @fires ui-lib-tree-change   — Cada vez que cambia la selección
 *                               Detail: { selected: TreeNode[], ids: string[] }
 * @fires ui-lib-tree-confirm  — Al pulsar "Aplicar" (solo multi dropdown)
 *                               Detail: { selected: TreeNode[], ids: string[] }
 */
@customElement('lib-tree-select')
export class LibTreeSelect extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(treeSelectCss)}`,
  ];

  /* ──────────────────────────────────────────────────────────
     PROPIEDADES PÚBLICAS
  ─────────────────────────────────────────────────────────── */

  @property({ type: Array })  nodes:       TreeNode[] = [];
  @property({ type: Boolean, reflect: true }) multi     = false;
  @property({ type: Boolean, reflect: true }) inline    = false;
  @property({ type: Boolean, reflect: true }) searchable = true;
  @property({ type: Boolean, reflect: true }) open      = false;
  @property({ type: Boolean, reflect: true }) disabled  = false;
  @property({ type: String }) placeholder = 'Seleccionar…';
  @property({ type: String, attribute: 'empty-text' }) emptyText = 'Sin resultados';
  @property({ type: String }) label = '';

  /* ──────────────────────────────────────────────────────────
     ESTADO INTERNO
  ─────────────────────────────────────────────────────────── */

  @state() private _nodeStates: Map<string, TreeNodeState> = new Map();
  @state() private _search = '';

  /* Mapea nodeId → parentId | null */
  private _parentMap: Map<string, string | null> = new Map();
  private _boundDocumentClick!: (e: Event) => void;

  /* ──────────────────────────────────────────────────────────
     CICLO DE VIDA
  ─────────────────────────────────────────────────────────── */

  override connectedCallback(): void {
    super.connectedCallback();
    this._boundDocumentClick = (e: Event): void => this._onDocumentClick(e);
    document.addEventListener('click', this._boundDocumentClick, true);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('click', this._boundDocumentClick, true);
  }

  protected override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('nodes')) {
      this._initState();
    }
  }

  /* ──────────────────────────────────────────────────────────
     INICIALIZACIÓN DEL ESTADO
  ─────────────────────────────────────────────────────────── */

  private _initState(): void {
    this._nodeStates = new Map();
    this._parentMap  = new Map();
    this._walkNodes(this.nodes, null);
  }

  private _walkNodes(nodes: TreeNode[], parentId: string | null): void {
    nodes.forEach(node => {
      this._nodeStates.set(node.id, {
        selected:      false,
        indeterminate: false,
        expanded:      false,
      });
      this._parentMap.set(node.id, parentId);
      if (node.children?.length) {
        this._walkNodes(node.children, node.id);
      }
    });
  }

  /* ──────────────────────────────────────────────────────────
     TRAVERSAL
  ─────────────────────────────────────────────────────────── */

  private _getAllNodes(nodes: TreeNode[], acc: TreeNode[] = []): TreeNode[] {
    nodes.forEach(n => {
      acc.push(n);
      if (n.children?.length) this._getAllNodes(n.children, acc);
    });
    return acc;
  }

  private _getLeaves(nodes: TreeNode[], acc: TreeNode[] = []): TreeNode[] {
    nodes.forEach(n => {
      if (!n.children?.length) acc.push(n);
      else this._getLeaves(n.children, acc);
    });
    return acc;
  }

  private _getSelectedLeaves(): TreeNode[] {
    return this._getLeaves(this.nodes).filter(
      n => this._nodeStates.get(n.id)?.selected === true
    );
  }

  /* ──────────────────────────────────────────────────────────
     LÓGICA DE SELECCIÓN
  ─────────────────────────────────────────────────────────── */

  /** Propaga selección hacia abajo en el subárbol */
  private _selectDown(node: TreeNode, selected: boolean): void {
    const st = this._nodeStates.get(node.id);
    if (st) { st.selected = selected; st.indeterminate = false; }
    node.children?.forEach(c => this._selectDown(c, selected));
  }

  /** Recalcula indeterminate/selected en todos los padres (bottom-up) */
  private _recalcAll(nodes: TreeNode[]): void {
    nodes.forEach(n => {
      if (!n.children?.length) return;
      this._recalcAll(n.children);
      const allSel  = n.children.every(c =>
        this._nodeStates.get(c.id)?.selected === true &&
        !this._nodeStates.get(c.id)?.indeterminate
      );
      const someSel = n.children.some(c =>
        this._nodeStates.get(c.id)?.selected === true ||
        this._nodeStates.get(c.id)?.indeterminate === true
      );
      const st = this._nodeStates.get(n.id);
      if (st) { st.selected = allSel; st.indeterminate = !allSel && someSel; }
    });
  }

  private _handleSelect(node: TreeNode): void {
    if (this.disabled) return;

    if (!this.multi) {
      /* Single — limpia todo, selecciona este, cierra */
      this._getAllNodes(this.nodes).forEach(n => {
        const st = this._nodeStates.get(n.id);
        if (st) { st.selected = false; st.indeterminate = false; }
      });
      const st = this._nodeStates.get(node.id);
      if (st) st.selected = true;
      this._nodeStates = new Map(this._nodeStates);
      this.open = false;
      this._emitChange();
      return;
    }

    /* Multi — toggle + propagación bidireccional */
    const newSelected = !this._nodeStates.get(node.id)?.selected;
    this._selectDown(node, newSelected);
    this._recalcAll(this.nodes);
    this._nodeStates = new Map(this._nodeStates);
    this._emitChange();
  }

  private _handleToggle(id: string): void {
    const st = this._nodeStates.get(id);
    if (!st) return;
    st.expanded = !st.expanded;
    this._nodeStates = new Map(this._nodeStates);
  }

  private _handleClear(): void {
    this._nodeStates.forEach(st => { st.selected = false; st.indeterminate = false; });
    this._nodeStates = new Map(this._nodeStates);
    this._emitChange();
  }

  private _handleConfirm(): void {
    this.open = false;
    const sel = this._getSelectedLeaves();
    const detail: TreeSelectConfirmDetail = { selected: sel, ids: sel.map(n => n.id) };
    this.dispatchEvent(new CustomEvent<TreeSelectConfirmDetail>('ui-lib-tree-confirm', {
      detail, bubbles: true, composed: true,
    }));
  }

  private _handleTagRemove(id: string): void {
    const node = this._getAllNodes(this.nodes).find(n => n.id === id);
    if (!node) return;
    const st = this._nodeStates.get(id);
    if (st) st.selected = false;
    this._recalcAll(this.nodes);
    this._nodeStates = new Map(this._nodeStates);
    this._emitChange();
  }

  private _emitChange(): void {
    const sel    = this._getSelectedLeaves();
    const detail: TreeSelectChangeDetail = { selected: sel, ids: sel.map(n => n.id) };
    this.dispatchEvent(new CustomEvent<TreeSelectChangeDetail>('ui-lib-tree-change', {
      detail, bubbles: true, composed: true,
    }));
  }

  /* ──────────────────────────────────────────────────────────
     DROPDOWN
  ─────────────────────────────────────────────────────────── */

  private _toggleOpen(): void {
    if (this.disabled) return;
    this.open = !this.open;
    if (this.open) {
      /* Foco en el input de búsqueda tras la apertura */
      setTimeout((): void => {
        (this.renderRoot.querySelector('.ts-search') as HTMLInputElement | null)?.focus();
      }, 60);
    }
  }

  private _onDocumentClick(e: Event): void {
    if (this.inline || !this.open) return;
    if (!e.composedPath().includes(this)) {
      this.open = false;
    }
  }

  /* ──────────────────────────────────────────────────────────
     VALORES DERIVADOS PARA EL TEMPLATE
  ─────────────────────────────────────────────────────────── */

  private _getTriggerLabel(): string {
    if (!this.multi) {
      const sel = this._getLeaves(this.nodes).find(
        n => this._nodeStates.get(n.id)?.selected === true
      );
      return sel?.label ?? '';
    }
    const sel   = this._getSelectedLeaves();
    const count = sel.length;
    if (count === 0) return '';
    if (count === 1) return sel[0]?.label ?? '';
    return `${count} seleccionados`;
  }

  private _getSelectionCount(): number {
    return this._getSelectedLeaves().length;
  }

  private _getFooterInfo(): string {
    const count = this._getSelectionCount();
    if (count === 0) return '0 seleccionados';
    return `${count} seleccionado${count !== 1 ? 's' : ''}`;
  }

  private _getTags(): Array<{ id: string; label: string }> {
    const sel = this._getSelectedLeaves().slice(0, 8);
    return sel.map(n => ({ id: n.id, label: n.label }));
  }

  /* ──────────────────────────────────────────────────────────
     API PÚBLICA
  ─────────────────────────────────────────────────────────── */

  /** Abre el dropdown (solo en modo dropdown) */
  public openPanel(): void {
    if (!this.inline && !this.disabled) this.open = true;
  }

  /** Cierra el dropdown */
  public closePanel(): void { this.open = false; }

  /** Limpia toda la selección */
  public clear(): void { this._handleClear(); }

  /** Devuelve los nodos hoja actualmente seleccionados */
  public getSelected(): TreeNode[] { return this._getSelectedLeaves(); }

  /* ──────────────────────────────────────────────────────────
     RENDER
  ─────────────────────────────────────────────────────────── */

  protected override render(): TemplateResult {
    const triggerLabel = this._getTriggerLabel();
    return treeSelectTemplate({
      nodes:          this.nodes,
      nodeStates:     this._nodeStates,
      multi:          this.multi,
      inline:         this.inline,
      searchable:     this.searchable,
      open:           this.open,
      disabled:       this.disabled,
      placeholder:    this.placeholder,
      emptyText:      this.emptyText,
      searchValue:    this._search,
      triggerLabel,
      isPlaceholder:  triggerLabel === '',
      selectionCount: this._getSelectionCount(),
      footerInfo:     this._getFooterInfo(),
      tags:           this._getTags(),
      onTriggerClick: (): void => this._toggleOpen(),
      onSearch:       (v: string): void => { this._search = v; },
      onClear:        (): void => this._handleClear(),
      onConfirm:      (): void => this._handleConfirm(),
      onTagRemove:    (id: string): void => this._handleTagRemove(id),
      onToggle:       (id: string): void => this._handleToggle(id),
      onSelect:       (node: TreeNode): void => this._handleSelect(node),
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-tree-select': LibTreeSelect;
  }
}