/* ============================================================
   kura targets · qué se desplegaría, y si está listo

   Responde sin tocar la red: cruza la configuración con el disco
   y dice, por cada target, si su build existe y de cuándo es.

   El estado `ready` exige index.html presente. Es la precondición
   que F4 convertirá en guardarraíl duro: publicar un directorio
   vacío o a medio construir deja un sitio roto sin que nada falle.
   ============================================================ */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { HostingConfig } from '../config';

export type BuildState = 'missing' | 'empty' | 'no-index' | 'ready';

export interface TargetReport {
  target: string;
  sites: string[];
  publicDir: string;
  build: BuildState;
  /** Entradas en el primer nivel del directorio servido. */
  entries: number;
  /** Fecha del index.html en ISO, o null si no hay build utilizable. */
  modified: string | null;
}

export function reportTargets(config: HostingConfig): TargetReport[] {
  return config.targets.map((target) => {
    const dir = join(config.root, target.publicDir);
    const { build, entries, modified } = inspectBuild(dir);
    return { target: target.target, sites: target.sites, publicDir: target.publicDir, build, entries, modified };
  });
}

function inspectBuild(dir: string): Pick<TargetReport, 'build' | 'entries' | 'modified'> {
  if (!existsSync(dir)) return { build: 'missing', entries: 0, modified: null };

  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    // Existe pero no se puede listar (permisos, enlace roto): se trata como ausente.
    return { build: 'missing', entries: 0, modified: null };
  }

  if (names.length === 0) return { build: 'empty', entries: 0, modified: null };

  const index = join(dir, 'index.html');
  if (!existsSync(index)) return { build: 'no-index', entries: names.length, modified: null };

  return { build: 'ready', entries: names.length, modified: statSync(index).mtime.toISOString() };
}
