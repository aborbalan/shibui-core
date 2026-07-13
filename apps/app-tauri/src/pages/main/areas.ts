/**
 * Catálogo de áreas que el Hub puede abrir como pestañas.
 *
 * Los iconos usan SOLO nombres presentes en el registry de @shibui-ui/ui
 * (folder, shield, chart-line, desktop, menu…). No usar code/folder-open/
 * gear-six: no existen en el registry y no renderizan.
 */
export type AreaId = 'dashboard' | 'files' | 'code' | 'branches' | 'security' | 'settings';

export interface AreaDef {
  id:          AreaId;
  label:       string;
  description: string;
  icon:        string;
}

export const AREAS: readonly AreaDef[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Gadgets de sistema y monitorización',
    icon: 'chart-line',
  },
  {
    id: 'files',
    label: 'Files',
    description: 'Explorador y gestor de archivos',
    icon: 'folder',
  },
  {
    id: 'code',
    label: 'Code',
    description: 'Editor, terminal y workspace',
    icon: 'menu',
  },
  {
    id: 'branches',
    label: 'Branches',
    description: 'Ramas y agentes actuando sobre ellas',
    icon: 'dots',
  },
  {
    id: 'security',
    label: 'Security',
    description: 'Claves, permisos y auditoría',
    icon: 'shield',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Configuración del sistema',
    icon: 'desktop',
  },
] as const;

/** Lookup rápido por id. */
export const AREA_BY_ID: Record<AreaId, AreaDef> = AREAS.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<AreaId, AreaDef>,
);
