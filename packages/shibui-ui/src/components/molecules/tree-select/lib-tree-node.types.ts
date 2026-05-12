/* ============================================================
   LIB-TREE-SELECT — Tipos e interfaces públicas
   ============================================================ */

/** Nodo del árbol — estructura de datos pública */
export interface TreeNode {
    id:        string;
    label:     string;
    children?: TreeNode[];
  }
  
  /** Estado interno por nodo — no expuesto */
  export interface TreeNodeState {
    selected:      boolean;
    indeterminate: boolean;
    expanded:      boolean;
  }
  
  /** Detalle del evento ui-lib-tree-change */
  export interface TreeSelectChangeDetail {
    selected: TreeNode[];
    ids:      string[];
  }
  
  /** Detalle del evento ui-lib-tree-confirm (multi — botón Aplicar) */
  export type TreeSelectConfirmDetail = TreeSelectChangeDetail;
  
  /** Props del template principal */
  export interface TreeSelectTemplateProps {
    nodes:          TreeNode[];
    nodeStates:     ReadonlyMap<string, TreeNodeState>;
    multi:          boolean;
    inline:         boolean;
    searchable:     boolean;
    open:           boolean;
    disabled:       boolean;
    placeholder:    string;
    emptyText:      string;
    searchValue:    string;
    triggerLabel:   string;
    isPlaceholder:  boolean;
    selectionCount: number;
    footerInfo:     string;
    tags:           Array<{ id: string; label: string }>;
    onTriggerClick: () => void;
    onSearch:       (value: string) => void;
    onClear:        () => void;
    onConfirm:      () => void;
    onTagRemove:    (id: string) => void;
    onToggle:       (id: string) => void;
    onSelect:       (node: TreeNode) => void;
  }
  
  /** Contexto pasado a la función de renderizado recursivo */
  export interface RenderNodeCtx {
    nodeStates:  ReadonlyMap<string, TreeNodeState>;
    multi:       boolean;
    searchValue: string;
    onToggle:    (id: string) => void;
    onSelect:    (node: TreeNode) => void;
  }