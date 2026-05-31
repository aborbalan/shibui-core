import { apiClient } from "../../../client";

// ─── DTOs ─────────────────────────────────────────────────────────────────────
// Mismo contrato que GitCommitDto (NestJS) y GitCommit (Rust/shibui-ui).

export interface GitCommitDto {
  hash:    string;
  message: string;
  author:  string;
  date:    string;
  parents: string[];
  refs:    string[];
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const gitApi = {
  /**
   * GET /api/v1/git/log
   * Devuelve commits en orden topológico (más reciente primero).
   */
  getLog: (path?: string, maxCount?: number): Promise<GitCommitDto[]> => {
    const params = new URLSearchParams();
    if (path)     params.set('path',     path);
    if (maxCount) params.set('maxCount', String(maxCount));
    const qs = params.size > 0 ? `?${params.toString()}` : '';
    return apiClient.get<GitCommitDto[]>(`/api/v1/git/log${qs}`, { public: true });
  },
};
