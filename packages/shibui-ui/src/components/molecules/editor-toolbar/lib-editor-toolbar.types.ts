/* ============================================================
   LIB-EDITOR-TOOLBAR — Tipos e interfaces
   ============================================================ */

export interface EditorToolbarTemplateProps {
  filename:  string | null;
  dirty:     boolean;
  saving:    boolean;
  showOpen:  boolean;
  onNew:     () => void;
  onOpen:    () => void;
  onSave:    () => void;
}
