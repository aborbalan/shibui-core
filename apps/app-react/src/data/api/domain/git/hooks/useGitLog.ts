import { useQuery } from "@tanstack/react-query";
import { gitApi, type GitCommitDto } from "../api/git.api";
import { queryKeys } from "../../../query-keys";

/**
 * Hook para cargar el historial git desde la API REST.
 * Complementa al gadget Tauri que carga los mismos datos por `invoke()`.
 *
 * @param path     - Ruta del repo en el servidor (opcional, usa cwd por defecto)
 * @param maxCount - Número máximo de commits (opcional, por defecto 200)
 */
export function useGitLog(path?: string, maxCount?: number) {
  return useQuery<GitCommitDto[]>({
    queryKey: queryKeys.git.log(path, maxCount),
    queryFn:  () => gitApi.getLog(path, maxCount),
    staleTime: 30_000,
  });
}
