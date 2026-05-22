/**
 * Katachi Contract Test
 *
 * Verifica que TODOS los ficheros .stories.ts del directorio src/components
 * exporten las 6 historias estándar del sistema katachi generadas con el
 * helper `createKatachiStories`.
 *
 * Por qué existe este test
 * ─────────────────────────
 * El sistema katachi define 6 contextos estéticos (shizen, wabi, kintsugi,
 * celadon, sabi, terminal). Cada componente debe demostrar que funciona en
 * los 6. El helper `createKatachiStories` genera exactamente esas 6 historias
 * con un template mínimo del componente.
 *
 * Sin este test, un desarrollador que añada un nuevo componente podría
 * olvidar el bloque katachi sin que CI se queje.
 *
 * Exclusiones
 * ───────────
 * - lib-canvas: es el PROVEEDOR del sistema katachi (data-katachi="x").
 *   No es un consumidor del helper — tiene su propia story "SixKatachi"
 *   que muestra los 6 contextos.
 *
 * Corredor
 * ────────
 * pnpm test:unit  (vitest, entorno Node, sin DOM ni browser)
 */

import { describe, it, expect } from 'vitest';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/* ─── Resolucion de rutas (ESM, sin __dirname) ──────────────────────────── */

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ─── Configuración ─────────────────────────────────────────────────────── */

/**
 * Los 6 exports que TODOS los ficheros de stories deben tener.
 * Corresponden a los nombres retornados por createKatachiStories().
 */
const KATACHI_EXPORTS = [
  'KatachiShizen',
  'KatachiWabi',
  'KatachiKintsugi',
  'KatachiCeladon',
  'KatachiSabi',
  'KatachiTerminal',
] as const;

/** Ficheros excluidos del contrato (nombre de archivo, no ruta completa). */
const EXCLUDED = new Set<string>([
  // lib-canvas es el proveedor del sistema katachi —
  // wrappea data-katachi="x" y tiene su propia story SixKatachi.
  'lib-canvas.stories.ts',
]);

/* ─── Helper: búsqueda recursiva de ficheros .stories.ts ─────────────────── */

function findStoryFiles(dir: string): string[] {
  const result: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findStoryFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.stories.ts')) {
      result.push(full);
    }
  }
  return result;
}

/* ─── Recolección de ficheros (tiempo de carga del módulo, síncrono) ────── */

const componentsDir = path.resolve(__dirname, '../src/components');

const storyFiles = findStoryFiles(componentsDir)
  .filter(f => !EXCLUDED.has(path.basename(f)))
  .sort(); // orden determinista para que los failures sean predecibles

/* ─── Tests ──────────────────────────────────────────────────────────────── */

describe('Katachi contract — 6 historias estándar por componente', () => {

  // Sanity: el directorio src/components existe y tiene stories
  it('existen ficheros .stories.ts para validar', () => {
    expect(
      storyFiles.length,
      `No se encontraron ficheros .stories.ts en ${componentsDir}`
    ).toBeGreaterThan(0);
  });

  // Un test por fichero — cada test verifica el helper + los 6 exports
  storyFiles.forEach(file => {
    const label = path
      .relative(componentsDir, file)
      .replace(/\\/g, '/'); // normalizar separadores en Windows

    it(label, () => {
      const content = fs.readFileSync(file, 'utf-8');

      // 1 · El fichero debe usar el helper (no hand-rolling)
      expect(
        content,
        [
          `"createKatachiStories" no encontrado.`,
          `Importa el helper desde '../../../stories/katachi-stories.helper'`,
          `y úsalo para generar las 6 historias katachi.`,
        ].join('\n')
      ).toContain('createKatachiStories');

      // 2 · Los 6 exports estándar deben estar presentes
      for (const exportName of KATACHI_EXPORTS) {
        expect(
          content,
          `"export const ${exportName}" no encontrado.\n` +
          `Añade: export const ${exportName} = _katachi.${exportName};`
        ).toMatch(new RegExp(`^export const ${exportName}\\b`, 'm'));
      }
    });
  });
});
