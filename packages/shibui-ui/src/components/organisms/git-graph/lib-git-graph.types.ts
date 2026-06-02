/* ============================================================
   LIB-GIT-GRAPH — Tipos e interfaces
   ============================================================ */

export interface GitCommit {
  /** Hash corto del commit (7 chars). */
  hash: string;
  /** Mensaje del commit (primera línea). */
  message: string;
  /** Nombre del autor. */
  author: string;
  /** Fecha ISO 8601. */
  date: string;
  /** Hashes de commits padre. Vacío en el commit raíz. */
  parents: string[];
  /**
   * Refs que apuntan a este commit.
   * Formato git: 'HEAD -> main', 'origin/main', 'feature/foo', 'v1.0.0'.
   */
  refs: string[];
}

export interface CommitLayout {
  commit: GitCommit;
  /** Columna horizontal (0-based). */
  lane:   number;
  /** Fila vertical (0-based, 0 = más reciente). */
  row:    number;
  /** Color OKLCH asignado al carril. */
  color:  string;
}

export interface GitGraphTooltip {
  x:      number;
  y:      number;
  commit: GitCommit;
  color:  string;
}

export interface GitGraphTemplateProps {
  layouts:      CommitLayout[];
  positionMap:  Map<string, CommitLayout>;
  laneWidth:    number;
  rowHeight:    number;
  scrollHeight: number;
  svgWidth:     number;
  showAuthor:   boolean;
  showDate:     boolean;
  tooltip:      GitGraphTooltip | null;
  onNodeEnter:  (e: MouseEvent, commit: GitCommit, color: string) => void;
  onNodeLeave:  () => void;
}
