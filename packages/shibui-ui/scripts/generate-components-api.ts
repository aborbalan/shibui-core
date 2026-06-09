/* ============================================================
   GENERADOR — Datos de componentes para la API, derivados del
   Custom Elements Manifest (fuente de verdad = el código).

   Lee  packages/shibui-ui/dist/custom-elements.json  (lo produce
   `cem analyze`) y emite un fichero TS commiteado en la API:
     apps/shibui-api/src/domain/components/data/components.generated.ts

   Fusiona el overlay editorial (status/version/tags/category/docsUrl)
   de  scripts/components-editorial.ts.

   La salida es determinista (ordenada por slug) para que el
   drift-guard de CI (`git diff --exit-code`) sea fiable.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { COMPONENTS_EDITORIAL, type Editorial } from './components-editorial';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '../../..');

const MANIFEST = resolve(root, 'packages/shibui-ui/dist/custom-elements.json');
const SRC = resolve(root, 'packages/shibui-ui/src');
const OUT = resolve(
  root,
  'apps/shibui-api/src/domain/components/data/components.generated.ts',
);
const PACKAGE_NAME = '@shibui-ui/ui';

// ── Tipos del manifiesto (parcial, lo que usamos) ──────────────
interface CemType { text?: string }
interface CemMember {
  kind: string;
  name: string;
  type?: CemType;
  default?: string;
  description?: string;
  attribute?: string;
  privacy?: string;
  static?: boolean;
}
interface CemSlot { name: string; description?: string }
interface CemEvent { name: string; type?: CemType; description?: string }
interface CemDeclaration {
  kind: string;
  customElement?: boolean;
  tagName?: string;
  description?: string;
  members?: CemMember[];
  slots?: CemSlot[];
  events?: CemEvent[];
}
interface CemModule { path: string; declarations?: CemDeclaration[] }
interface Manifest { modules: CemModule[] }

// ── Helpers ────────────────────────────────────────────────────
function titleCase(slug: string): string {
  return slug
    .replace(/^lib-/, '')
    .split('-')
    .map((w) => (w === '3d' ? '3D' : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ');
}

/**
 * Extrae los literales de una unión de strings pura (`'a' | 'b' | "c"`).
 * Devuelve null si el texto contiene identificadores u otros tipos (no es
 * una unión enumerable de literales).
 */
function extractLiterals(rhs: string): string[] | null {
  // Quita comentarios (de bloque y de línea) antes de analizar: las uniones
  // suelen llevar `// nota` tras cada literal y romperían el chequeo de pureza.
  const clean = rhs
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  const literals = [...clean.matchAll(/'([^']*)'|"([^"]*)"/g)].map(
    (m) => m[1] ?? m[2] ?? '',
  );
  if (literals.length === 0) return null;
  const residue = clean.replace(/'[^']*'|"[^"]*"/g, '').replace(/[|\s]/g, '');
  if (residue.length > 0) return null; // p.ej. `LibSize | 'auto'` → no puro
  return literals;
}

/**
 * Escanea `src/**\/*.ts` y mapea cada alias de tipo que sea una unión de
 * literales string (`export type LibButtonVariant = 'primary' | …`) a sus
 * valores. Permite resolver props cuyo `type` es solo el nombre del alias.
 */
function buildAliasMap(srcDir: string): Map<string, string[]> {
  const map = new Map<string, string[]>();
  let entries: string[] = [];
  try {
    entries = readdirSync(srcDir, { recursive: true }) as string[];
  } catch {
    return map;
  }
  for (const rel of entries) {
    if (!rel.endsWith('.ts')) continue;
    if (/\.(stories|test|spec|d)\.ts$/.test(rel)) continue;
    let content: string;
    try {
      content = readFileSync(resolve(srcDir, rel), 'utf8');
    } catch {
      continue;
    }
    for (const m of content.matchAll(/export\s+type\s+(\w+)\s*=\s*([^;]+);/g)) {
      const name = m[1];
      const lits = extractLiterals(m[2]);
      if (lits && !map.has(name)) map.set(name, lits);
    }
  }
  return map;
}

/**
 * Resuelve los valores enumerables de un prop a partir de su tipo:
 * unión inline de literales, o alias de un solo identificador conocido.
 */
function resolveOptions(
  typeText: string | undefined,
  aliasMap: Map<string, string[]>,
): string[] | undefined {
  if (!typeText) return undefined;
  const text = typeText.trim();
  const inline = extractLiterals(text);
  if (inline && inline.length >= 2) return inline;
  if (/^\w+$/.test(text)) {
    const mapped = aliasMap.get(text);
    if (mapped && mapped.length >= 2) return mapped;
  }
  return undefined;
}

const ALIAS_MAP = buildAliasMap(SRC);

function mapProps(members: CemMember[] = []) {
  // Backfill de descripciones: el JSDoc @prop genera "miembros" con
  // nombre = atributo (con guiones). Recuperamos su descripción.
  const descByAttr = new Map<string, string>();
  for (const m of members) {
    if (m.kind === 'field' && m.name.includes('-') && m.description) {
      descByAttr.set(m.name, m.description);
    }
  }
  return members
    .filter(
      (m) =>
        m.kind === 'field' &&
        !m.static &&
        !m.name.includes('-') &&
        !m.name.startsWith('_') &&
        m.privacy !== 'private' &&
        m.privacy !== 'protected' &&
        (!!m.attribute || !!m.description),
    )
    .map((m) => {
      const description =
        m.description || (m.attribute ? descByAttr.get(m.attribute) : undefined);
      const options = resolveOptions(m.type?.text, ALIAS_MAP);
      return {
        name: m.name,
        type: m.type?.text ?? 'unknown',
        ...(m.default !== undefined ? { default: m.default } : {}),
        ...(description ? { description } : {}),
        ...(m.attribute ? { attribute: m.attribute } : {}),
        ...(options ? { options } : {}),
      };
    });
}

function mapSlots(slots: CemSlot[] = []) {
  return slots.map((s) => ({
    name: s.name,
    ...(s.description ? { description: s.description } : {}),
  }));
}

function mapEvents(events: CemEvent[] = []) {
  const seen = new Set<string>();
  return events
    .filter((e) => e.name.startsWith('ui-lib-') || !!e.description)
    .filter((e) => (seen.has(e.name) ? false : (seen.add(e.name), true)))
    .map((e) => ({
      name: e.name,
      ...(e.type?.text ? { type: e.type.text } : {}),
      ...(e.description ? { description: e.description } : {}),
    }));
}

// ── Main ───────────────────────────────────────────────────────
if (!existsSync(MANIFEST)) {
  console.error(
    `✗ No existe ${MANIFEST}.\n  Corre primero:  pnpm --filter @shibui-ui/ui analyze`,
  );
  process.exit(1);
}

const manifest: Manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

const decls: CemDeclaration[] = [];
for (const mod of manifest.modules) {
  for (const d of mod.declarations ?? []) {
    if (d.customElement && d.tagName?.startsWith('lib-')) decls.push(d);
  }
}

// dedupe por tagName (si un tag aparece en >1 módulo)
const byTag = new Map<string, CemDeclaration>();
for (const d of decls) if (!byTag.has(d.tagName!)) byTag.set(d.tagName!, d);

const components = [...byTag.keys()]
  .sort()
  .map((slug) => {
    const d = byTag.get(slug)!;
    const ed: Editorial = COMPONENTS_EDITORIAL[slug] ?? {};
    return {
      id: `cmp-${slug}`,
      name: titleCase(slug),
      slug,
      tagName: slug,
      description: ed.description || d.description || '',
      version: ed.version ?? '1.0.0',
      status: ed.status ?? 'stable',
      categoryId: ed.categoryId ?? 'cat-0004-0000-0000-000000000000',
      packageName: PACKAGE_NAME,
      tags: ed.tags ?? [],
      docsUrl: ed.docsUrl ?? null,
      api: {
        props: mapProps(d.members),
        slots: mapSlots(d.slots),
        events: mapEvents(d.events),
      },
    };
  });

const banner = `/* ============================================================
   AUTO-GENERADO — NO EDITAR A MANO.
   Fuente: packages/shibui-ui/dist/custom-elements.json (cem analyze)
   Overlay editorial: packages/shibui-ui/scripts/components-editorial.ts
   Regenerar: pnpm --filter @shibui-ui/ui generate:components-api
   ============================================================ */
import type { ComponentApi } from '../entities/component.entity';

export type GeneratedStatus = 'stable' | 'draft' | 'deprecated';

export interface GeneratedComponent {
  id: string;
  name: string;
  slug: string;
  tagName: string;
  description: string;
  version: string;
  status: GeneratedStatus;
  categoryId: string;
  packageName: string | null;
  tags: string[];
  docsUrl: string | null;
  api: ComponentApi;
}

export const COMPONENTS_GENERATED: GeneratedComponent[] = `;

const file = `${banner}${JSON.stringify(components, null, 2)};\n`;

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, file, 'utf8');

const totalProps = components.reduce((a, c) => a + c.api.props.length, 0);
console.log(
  `✓ ${components.length} componentes → ${OUT.replace(root + '/', '')}\n` +
    `  props: ${totalProps} · con slots: ${components.filter((c) => c.api.slots.length).length} · con eventos: ${components.filter((c) => c.api.events.length).length}`,
);
