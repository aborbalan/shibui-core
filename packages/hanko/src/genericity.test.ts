import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/* ============================================================
   hanko · Guard de genericidad (F7 · desacople)

   Convierte el principio nº1 de hanko en un test EJECUTABLE:
   el core NUNCA importa de @shibui-ui/ui. La comunicación con
   shibui es solo vía el fichero CEM (lectura por RUTA en runtime,
   no import de código), así que ningún import debe referenciar la
   librería UI ni trepar a su carpeta.

   Recorre todo src/ (incluidos sus tests) y falla listando los
   infractores. El guard cubre SOLO src/ —el core publicable—, así
   que el único acople con shibui permitido vive FUERA: la sonda de
   dogfood `dogfood/probe-shibui.ts` sí carga el dist de shibui para
   montar los componentes reales, pero no entra en `src/` ni en el
   paquete. Ver docs/specs/packaging.md · docs/specs/harness.md.
   ============================================================ */

const SRC = dirname(fileURLToPath(import.meta.url));

/** Especificadores de import / re-export `from` / import() dinámico / import lateral. */
const SPECIFIER =
  /(?:import|export)\b[^'"]*?\bfrom\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g;

/** Importar la lib UI (`@shibui-ui/ui` / `@shibui-ui/ui`) o trepar a `shibui-ui/` está prohibido. */
const FORBIDDEN = /@shibui(-ui)?\/ui(\/|$)|(\.\.\/)+shibui-ui(\/|$)/;

function tsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...tsFiles(full));
    else if (entry.endsWith('.ts')) out.push(full);
  }
  return out;
}

function importsOf(source: string): string[] {
  const specs: string[] = [];
  SPECIFIER.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = SPECIFIER.exec(source)) !== null) {
    const spec = m[1] ?? m[2] ?? m[3];
    if (spec !== undefined) specs.push(spec);
  }
  return specs;
}

describe('genericidad del core (F7 · desacople)', () => {
  it('ningún fichero importa de @shibui-ui/ui ni trepa a shibui-ui', () => {
    const offenders: string[] = [];
    for (const file of tsFiles(SRC)) {
      for (const spec of importsOf(readFileSync(file, 'utf-8'))) {
        if (FORBIDDEN.test(spec)) offenders.push(`${relative(SRC, file)} → ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('el guard detecta un import prohibido (autovalidación del patrón)', () => {
    // El especificador prohibido se compone en runtime: así el TEXTO de este
    // fichero no contiene un `from '@shibui-ui/ui'` literal que el primer test
    // —que escanea src/ como texto, este incluido— marcaría como falso infractor
    // de sí mismo. En runtime, `fixture` sí es un import prohibido completo.
    const forbidden = '@shibui-ui/ui';
    const fixture = `import { Button } from '${forbidden}';\nimport x from './local';`;
    expect(importsOf(fixture).filter((s) => FORBIDDEN.test(s))).toEqual([forbidden]);
  });
});
