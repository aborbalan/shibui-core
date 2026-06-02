import { useContext } from 'react';
import { ProjectContext } from '../project/ProjectContext';
import type { ProjectContextValue } from '../project/ProjectContext';

/**
 * Acceso al servicio de proyecto abierto. Lanza si se usa fuera de
 * <ProjectProvider>.
 *
 * @example
 * const { project, openProject } = useProject();
 * if (project) console.log(project.path, project.git_branch);
 */
export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject debe usarse dentro de <ProjectProvider>');
  return ctx;
}
