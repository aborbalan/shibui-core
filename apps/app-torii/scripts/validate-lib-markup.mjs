/**
 * Valida el markup `lib-*` de esta app contra el custom-elements.json de
 * @shibui-ui/ui. El manifiesto es la misma fuente de verdad que usa el MCP
 * `shibui-cem`; esto es su equivalente ejecutable, para entornos donde ese
 * servidor no esta levantado y para poder repetir la comprobacion en CI.
 *
 * Caza lo de siempre: un atributo que no existe (el clasico `variant` donde
 * el componente espera `theme`) y un `.prop` enlazado que no es campo.
 *
 * Requiere el manifiesto construido: `pnpm --filter @shibui-ui/ui analyze`.
 *
 *   node scripts/validate-lib-markup.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const MANIFEST = resolve(HERE, '../../../packages/shibui-ui/dist/custom-elements.json');
const SRC = resolve(HERE, '../src');

let manifest;
try {
  manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
} catch {
  console.error(
    `No se encuentra el manifiesto en ${MANIFEST}.\n` +
      'Es build output gitignorado: genera con `pnpm --filter @shibui-ui/ui analyze`.',
  );
  process.exit(2);
}

// tag -> { attrs:Set, props:Set }
const api = new Map();
for (const mod of manifest.modules ?? []) {
  for (const decl of mod.declarations ?? []) {
    if (!decl.tagName) continue;
    const attrs = new Set((decl.attributes ?? []).map((a) => a.name));
    const props = new Set((decl.members ?? []).filter((m) => m.kind === 'field').map((m) => m.name));
    api.set(decl.tagName, { attrs, props });
  }
}

const GLOBAL = new Set([
  'id', 'class', 'style', 'slot', 'part', 'title', 'hidden', 'role', 'tabindex', 'lang', 'dir',
]);
const isGlobalish = (n) => GLOBAL.has(n) || n.startsWith('aria-') || n.startsWith('data-') || n.startsWith('@') || n.startsWith('?') || n.startsWith('.');

/**
 * Sustituye cada ${...} de Lit por un marcador, contando llaves. Con regex sola
 * no se puede: los valores llevan objetos y arrow functions anidados, y sus
 * llaves interiores se colaban como si fueran nombres de atributo.
 */
function maskExpressions(text) {
  let out = '';
  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === '$' && text[i + 1] === '{') {
      let depth = 0;
      let j = i + 1;
      for (; j < text.length; j += 1) {
        if (text[j] === '{') depth += 1;
        else if (text[j] === '}') {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      out += 'EXPR';
      i = j;
      continue;
    }
    out += text[i];
  }
  return out;
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
}

const problems = [];
let checkedTags = 0;
let checkedAttrs = 0;

for (const file of walk(SRC)) {
  const src = readFileSync(file, 'utf8');
  const masked = maskExpressions(src);
  for (const m of masked.matchAll(/<(lib-[a-z0-9-]+)((?:\s+[^<>]*?)?)\/?>/g)) {
    const [, tag, rawAttrs] = m;
    if (!api.has(tag)) {
      problems.push(`${relative(SRC, file)}: <${tag}> no existe en el manifiesto`);
      continue;
    }
    checkedTags += 1;
    const { attrs, props } = api.get(tag);
    /*
     * Tokenizar de verdad: un nombre, y si lleva "=", consumir su valor entero
     * (comillas dobles, simples o ${...} de Lit). Sin esto, cada palabra dentro
     * de line1="Un sistema" se contaba como un atributo inexistente.
     */
    const attrRe =
      /([.?@]?[a-zA-Z][a-zA-Z0-9-]*)\s*(?:=\s*(?:"[^"]*"|'[^']*'|\$\{(?:[^{}]|\{[^{}]*\})*\}|[^\s"'>]+))?/g;
    for (const a of rawAttrs.matchAll(attrRe)) {
      const name = a[1];
      if (isGlobalish(name)) {
        // Los bindings .prop / ?bool de Lit sí se comprueban contra los campos.
        const bare = name.replace(/^[.?]/, '');
        if ((name.startsWith('.') || name.startsWith('?')) && !props.has(bare) && !attrs.has(bare)) {
          problems.push(`${relative(SRC, file)}: <${tag}> enlaza "${name}" y no hay campo ni atributo "${bare}"`);
        }
        continue;
      }
      checkedAttrs += 1;
      if (!attrs.has(name) && !props.has(name)) {
        problems.push(`${relative(SRC, file)}: <${tag}> usa el atributo "${name}", que no esta en su API`);
      }
    }
  }
}

console.log(`Tags lib-* comprobados: ${checkedTags} · atributos: ${checkedAttrs}`);
console.log(problems.length ? problems.join('\n') : 'Sin hallazgos.');
process.exit(problems.length ? 1 : 0);
