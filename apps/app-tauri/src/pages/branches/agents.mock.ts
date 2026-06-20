/**
 * Datos MOCK de "agentes" actuando sobre ramas.
 *
 * Aislado a propósito: cuando se conecte la fuente real (worktrees, ramas
 * claude/*, PRs vía gh…), solo hay que reemplazar este fichero por una función
 * que devuelva `Agent[]` con el mismo contrato.
 */

export type AgentStatus = 'idle' | 'running' | 'done' | 'error';

export interface Agent {
  /** Id único del agente. */
  id: string;
  /** Nombre legible del agente. */
  name: string;
  /** Rama sobre la que actúa. */
  branch: string;
  /** Estado actual. */
  status: AgentStatus;
  /** Descripción corta de la última acción. */
  lastAction: string;
  /** Progreso 0-100 (para la barra de métrica). */
  progress: number;
}

export const MOCK_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'refactor-bot',
    branch: 'feat/tauri-code-area',
    status: 'running',
    lastAction: 'Editando useFileTree.ts',
    progress: 62,
  },
  {
    id: 'agent-2',
    name: 'review-bot',
    branch: 'fix/git-service-command-injection',
    status: 'done',
    lastAction: 'PR aprobado',
    progress: 100,
  },
  {
    id: 'agent-3',
    name: 'docs-bot',
    branch: 'docs/app-tauri-folder-readmes',
    status: 'idle',
    lastAction: 'En espera',
    progress: 0,
  },
  {
    id: 'agent-4',
    name: 'test-bot',
    branch: 'feat/tauri-branches-area',
    status: 'error',
    lastAction: 'Fallo en consumer-tests (Angular)',
    progress: 38,
  },
];
