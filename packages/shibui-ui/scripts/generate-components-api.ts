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

/** Trocea una RHS de tipo por `|` de nivel superior y limpia comentarios. */
function splitUnion(rhs: string): string[] {
  const clean = rhs
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '');
  return clean
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

const LITERAL_RE = /^'([^']*)'$|^"([^"]*)"$/;

/**
 * Expande una RHS de tipo a su lista de literales string, resolviendo
 * recursivamente alias conocidos (p.ej. `LibSize | 'full'` → la unión
 * completa). Devuelve null si algún término no es literal ni alias resoluble.
 * Descarta el literal vacío (`''`/`""`), que es ruido de sentinel, no opción.
 */
function expandUnion(
  rhs: string,
  raw: Map<string, string>,
  seen: Set<string> = new Set(),
): string[] | null {
  const out: string[] = [];
  for (const tok of splitUnion(rhs)) {
    // `undefined`/`null` aparecen en props opcionales (`size?: LibSize` →
    // `LibSize | undefined`); no son opciones, se ignoran sin abortar.
    if (tok === 'undefined' || tok === 'null') continue;
    const lit = LITERAL_RE.exec(tok);
    if (lit) {
      const v = lit[1] ?? lit[2] ?? '';
      if (v !== '') out.push(v); // descarta sentinel ''
      continue;
    }
    if (/^\w+$/.test(tok) && raw.has(tok) && !seen.has(tok)) {
      seen.add(tok);
      const nested = expandUnion(raw.get(tok)!, raw, seen);
      if (nested === null) return null;
      out.push(...nested);
      continue;
    }
    return null; // identificador desconocido, genérico, etc. → no enumerable
  }
  return [...new Set(out)]; // dedupe preservando orden
}

/**
 * Escanea `src/**\/*.ts` y recolecta la RHS cruda de cada
 * `export type X = …;`. Permite resolución recursiva de alias anidados.
 */
function collectRawAliases(srcDir: string): Map<string, string> {
  const raw = new Map<string, string>();
  let entries: string[] = [];
  try {
    entries = readdirSync(srcDir, { recursive: true }) as string[];
  } catch {
    return raw;
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
      if (!raw.has(m[1])) raw.set(m[1], m[2]);
    }
  }
  return raw;
}

const RAW_ALIASES = collectRawAliases(SRC);

/**
 * Resuelve los valores enumerables de un prop a partir de su tipo:
 * unión (inline o con alias anidados) de literales string.
 */
function resolveOptions(typeText: string | undefined): string[] | undefined {
  if (!typeText) return undefined;
  const opts = expandUnion(typeText.trim(), RAW_ALIASES);
  return opts && opts.length >= 2 ? opts : undefined;
}

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
      const options = resolveOptions(m.type?.text);
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
