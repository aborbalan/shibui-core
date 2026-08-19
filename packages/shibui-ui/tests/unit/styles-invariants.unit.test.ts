/* ============================================================
   INVARIANTES DE ESTILO — análisis estático sobre el CSS fuente

   Tres de los hallazgos de la auditoría de estilos de agosto de 2026
   (docs/styles/audit-estilos-2026-08-16.html) se detectan leyendo el CSS,
   sin navegador. Este test los convierte en fallo de CI para que no
   reincidan, que es justo el patrón que documentaba el informe: los
   problemas no se colaron por difíciles, se colaron por invisibles.

   Los tres:
     1. var(--token) sin fallback apuntando a un token que no existe
        → la declaración entera se descarta, en silencio.
     2. :host-context() fuera de @supports selector(:host-context(a))
        → el selector está retirado de la especificación y solo existe en
          Chromium; sin la guarda, Firefox y Safari pierden el bloque sin
          fallback.
     3. outline: none sin ninguna regla de foco en el mismo fichero
        → deja al usuario de teclado sin saber dónde está (WCAG 2.4.7).

   Corre en Node bajo `pnpm test:unit`, que sí está en ci-lib.yml.
   ============================================================ */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join, relative } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(__dirname, '../../src');

function collectCss(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectCss(full));
    } else if (entry.endsWith('.css')) {
      out.push(full);
    }
  }
  return out;
}

const cssFiles: string[] = collectCss(SRC);
const rel = (f: string): string => relative(SRC, f).replace(/\\/g, '/');

/** Quita comentarios para que no cuenten como código. */
function strip(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '');
}

describe('invariantes de estilo', () => {
  it('hay CSS que analizar', () => {
    expect(cssFiles.length).toBeGreaterThan(50);
  });

  /* ── 1. Tokens inexistentes usados sin fallback ─────────────── */
  it('ningún var() sin fallback apunta a un token que no existe', () => {
    const defined = new Set<string>();
    for (const f of cssFiles) {
      const src = strip(readFileSync(f, 'utf8'));
      for (const m of src.matchAll(/(--[\w-]+)\s*:/g)) defined.add(m[1]!);
    }

    const offenders: string[] = [];
    for (const f of cssFiles) {
      const src = strip(readFileSync(f, 'utf8'));
      // var(--x) sin coma = sin fallback. Con fallback degrada bien y se acepta.
      for (const m of src.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)) {
        const token = m[1]!;
        if (!defined.has(token)) offenders.push(`${rel(f)} → ${token}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  /* ── 2. :host-context() siempre tras su guarda ──────────────── */
  it(':host-context() solo aparece dentro de @supports selector(:host-context(a))', () => {
    const offenders: string[] = [];
    for (const f of cssFiles) {
      const src = strip(readFileSync(f, 'utf8'));
      if (!src.includes(':host-context')) continue;
      if (!/@supports\s+selector\(\s*:host-context\(/.test(src)) {
        offenders.push(rel(f));
      }
    }

    expect(offenders).toEqual([]);
  });

  /* ── 3. outline: none con sustituto de foco ─────────────────── */
  it('todo fichero que apaga el outline ofrece alguna señal de foco', () => {
    const offenders: string[] = [];
    for (const f of cssFiles) {
      const src = strip(readFileSync(f, 'utf8'));
      if (!/outline:\s*(none|0)\b/.test(src)) continue;
      // Vale :focus-visible, :focus-within o :focus — lo que no vale es nada.
      if (!/:focus/.test(src)) offenders.push(rel(f));
    }

    expect(offenders).toEqual([]);
  });
});
