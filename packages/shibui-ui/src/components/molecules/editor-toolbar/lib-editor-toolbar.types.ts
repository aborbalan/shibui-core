/* ============================================================
   LIB-EDITOR-TOOLBAR — Tipos e interfaces
   ============================================================ */

export interface EditorToolbarTemplateProps {
  filename:  string;
  dirty:     boolean;
  saving:    boolean;
  showOpen:  boolean;
  onNew:     () => void;
  onOpen:    () => void;
  onSave:    () => void;
}
