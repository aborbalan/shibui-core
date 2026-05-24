/* ============================================================
   LIB-TEXT-EDITOR — Tipos e interfaces
   ============================================================ */

/** Representa un fichero abierto en el editor. */
export interface EditorFile {
  id:       string;
  filename: string;
  content:  string;
  dirty?:   boolean;
}

export interface TextEditorTemplateProps {
  files:       EditorFile[];
  activeId:    string;
  saving:      boolean;
  showOpen:    boolean;
  placeholder: string;
  readonly:    boolean;
  tabItems:    Array<{ id: string; label: string }>;
  activeFile:  EditorFile | undefined;
  onTabChange: (e: Event) => void;
  onInput:     (e: InputEvent) => void;
  onNew:       () => void;
  onOpen:      () => void;
  onSave:      () => void;
}
