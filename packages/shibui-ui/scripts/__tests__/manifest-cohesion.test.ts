/* ============================================================
   TEST DE COHESIÓN — Nivel 1 (data-driven sobre el manifest)

   Hace cumplir el contrato de props (docs/props-contract.md) sobre el
   manifest generado (components.generated.ts). Falla si un componente
   reintroduce vocabulario fuera del canon.

   Estrategia de migración incremental:
   - Las reglas se aplican a TODO el manifest.
   - `KNOWN_PENDING` lista las violaciones de ejes aún sin migrar
     (Tanda 5+). El test pasa con ellas, pero:
       · una violación NUEVA (no listada) → falla (caza regresiones).
       · una entrada de KNOWN_PENDING que ya NO viola → falla (obliga a
         limpiar el allowlist cuando se completa la migración).
   Cuando KNOWN_PENDING quede vacío, el DS estará 100% cohesivo.
   ============================================================ */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// ── Carga del manifest (fuente: el generado que consume la API) ──
const __dirname = dirname(fileURLToPath(import.meta.url));
const MANIFEST = resolve(
  __dirname,
  '../../../../apps/shibui-api/src/domain/components/data/components.generated.ts',
);

interface Prop {
  name: string;
  type: string;
  default?: string;
  options?: string[];
}
interface Comp { slug: string; api: { props: Prop[] } }

function loadComponents(): Comp[] {
  let src = readFileSync(MANIFEST, 'utf8');
  const i = src.indexOf('export const COMPONENTS_GENERATED');
  src = src.slice(src.indexOf('=', i) + 1).replace(/;\s*$/, '').trim();
  return JSON.parse(src) as Comp[];
}

const components = loadComponents();

// ── Vocabulario canónico (src/types/index.ts) ──────────────────
const LIB_SIZE = ['xs', 'sm', 'md', 'lg', 'xl'];
const LIB_TONE = ['default', 'accent', 'info', 'success', 'warning', 'error', 'muted'];
const LIB_SURFACE = ['default', 'light', 'dark', 'inverse'];
const LIB_TINT = ['neutral', 'warm', 'cool', 'inverse'];

// ── Excepciones documentadas (props-contract.md, lista cerrada) ─
const SIZE_EXTRA: Record<string, string[]> = {
  'lib-dialog': ['full'], 'lib-drawer': ['full'], 'lib-modal': ['full'],
  'lib-avatar': ['2xl'], 'lib-parallax-text-stack': ['2xl'],
};
const TONE_EXTRA: Record<string, string[]> = {
  'lib-chip': ['strong'], 'lib-badge': ['strong'], 'lib-breadcrumb': ['strong'],
};
const SIZE_FREEFORM = new Set(['lib-icon']); // size: string (acepta px/tokens)

// ── Allowlist de migración pendiente (Tanda 5+). SHRINK conforme avanza. ──
// Cada entrada = `${slug}.${prop}`. Quitar cuando el componente se migre.
// 🎉 Vacío: todos los ejes activos (size · tone · surface · tint) están
// migrados. Las próximas tandas (variant/display/theme + button cluster)
// activarán las reglas C4/C5/C10/C11/C12 que hoy son `it.todo`.
const KNOWN_PENDING = new Set<string>([]);

// ── Recolector de violaciones ──────────────────────────────────
type Violation = { key: string; rule: string; detail: string };

function collect(): Violation[] {
  const out: Violation[] = [];
  const push = (slug: string, prop: string, rule: string, detail: string) =>
    out.push({ key: `${slug}.${prop}`, rule, detail });

  for (const c of components) {
    for (const p of c.api.props ?? []) {
      const key = `${c.slug}.${p.name}`;
      const allowed = (base: string[], extra: Record<string, string[]>) =>
        [...base, ...(extra[c.slug] ?? [])];

      // C8 — sin type 'unknown'
      if (p.type === 'unknown') push(c.slug, p.name, 'unknown-type', key);

      if (p.options) {
        // C7 — sin literal vacío
        if (p.options.includes('')) push(c.slug, p.name, 'empty-option', `[${p.options}]`);

        // C1 — size ⊆ LibSize (+ extensiones; icon es freeform)
        if (p.name === 'size' && !SIZE_FREEFORM.has(c.slug) &&
            !p.options.every((o) => allowed(LIB_SIZE, SIZE_EXTRA).includes(o)))
          push(c.slug, 'size', 'size-canon', `[${p.options}]`);

        // C2 — tone ⊆ LibTone (+ chip/badge strong)
        if (p.name === 'tone' &&
            !p.options.every((o) => allowed(LIB_TONE, TONE_EXTRA).includes(o)))
          push(c.slug, 'tone', 'tone-canon', `[${p.options}]`);

        // C2b — surface ⊆ LibSurface
        if (p.name === 'surface' && !p.options.every((o) => LIB_SURFACE.includes(o)))
          push(c.slug, 'surface', 'surface-canon', `[${p.options}]`);

        // C3 — tint ⊆ LibTint
        if (p.name === 'tint' && !p.options.every((o) => LIB_TINT.includes(o)))
          push(c.slug, 'tint', 'tint-canon', `[${p.options}]`);

        // C9 — default ∈ options (ignora null/'' = nullable/sin set)
        if (p.default !== undefined) {
          const d = String(p.default).replace(/^['"]|['"]$/g, '');
          if (d !== '' && d !== 'null' && !p.options.includes(d))
            push(c.slug, p.name, 'bad-default', `def ${p.default} ∉ [${p.options}]`);
        }
      }
    }
  }
  return out;
}

const violations = collect();

// ── Tests ──────────────────────────────────────────────────────
describe('manifest cohesion (props contract)', () => {
  it('carga el manifest con componentes', () => {
    expect(components.length).toBeGreaterThan(50);
  });

  it('no hay violaciones inesperadas (fuera de KNOWN_PENDING)', () => {
    const unexpected = violations.filter((v) => !KNOWN_PENDING.has(v.key));
    expect(
      unexpected,
      `\nViolaciones de contrato NO permitidas:\n` +
        unexpected.map((v) => `  · [${v.rule}] ${v.key} ${v.detail}`).join('\n') +
        `\n(ver docs/props-contract.md)`,
    ).toEqual([]);
  });

  it('KNOWN_PENDING no tiene entradas obsoletas (ya migradas)', () => {
    const violatingKeys = new Set(violations.map((v) => v.key));
    const stale = [...KNOWN_PENDING].filter((k) => !violatingKeys.has(k));
    expect(
      stale,
      `\nEntradas de KNOWN_PENDING que ya NO violan — quítalas del allowlist:\n` +
        stale.map((k) => `  · ${k}`).join('\n'),
    ).toEqual([]);
  });

  // ── Ejes aún no migrados: se activarán al completar la migración ──
  it.todo('C4 — variant ⊆ tratamiento (solid/outlined/ghost/subtle) [tras Tanda variant]');
  it.todo('C10 — estéticas solo en `theme` [tras Tanda theme]');
  it.todo('C11 — modos de render solo en `display` [tras Tanda display]');
  it.todo('C5 — sin valor `danger` en ningún prop [tras button cluster]');
  it.todo('C12 — sin uniones flag-o-valor (string|boolean) [tras Tanda flag-o-valor]');
});
