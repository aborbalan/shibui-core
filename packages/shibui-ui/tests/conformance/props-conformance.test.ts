/**
 * Nivel 2 — Conformidad RUNTIME de los props de cohesión.
 * ------------------------------------------------------------------
 * El Nivel 1 (`scripts/__tests__/manifest-cohesion.test.ts`) valida la
 * FORMA del API en el manifest: que `tone`, `variant`, `display`… declaren
 * sólo el vocabulario canónico. Pero el manifest puede estar impecable y el
 * componente seguir roto: tras los renames de la migración (`variant`→`tone`/
 * `tint`/`display`/`theme`) puede quedar un selector `:host([variant=…])`
 * HUÉRFANO, o un `reflect` perdido — y el manifest no lo ve.
 *
 * Esta suite cierra ese hueco, data-driven desde el MISMO manifest que es el
 * fixture del Nivel 1, aseverando tres cosas ESTRUCTURALES por cada eje de
 * cohesión (la corrección VISUAL del render ya la cubre el Nivel 3: snapshots
 * de Storybook por katachi — aquí no la duplicamos):
 *
 *   2a · REFLEJO   — instancia el componente, set `el[prop] = opt` ⇒
 *                    `el.getAttribute(attr) === opt`. Si el reflect se perdió,
 *                    TODO `:host([attr=…])` muere en silencio. Guardián barato.
 *   2b · SIN HUÉRFANOS — lee el CSS que el componente realmente envía
 *                    (`ctor.styles[].cssText`) y verifica que NINGÚN selector
 *                    de un eje VIVO use un valor fuera de sus opciones
 *                    declaradas. Caza el `:host([variant="filled"])` que quedó
 *                    tras un rename (`filled`→`solid`) — drift que el manifest
 *                    no ve. Dirección INVERSA (CSS⇒manifest) a propósito: la
 *                    forward (cada opción debe tener selector) da falsos
 *                    positivos en componentes estilados por token o JS-driven
 *                    (lib-background), porque no todo eje usa `:host([attr=v])`.
 *   2c · SIN FANTASMAS — el 2b solo mira ejes DECLARADOS, así que un rename
 *                    del EJE ENTERO (`variant`→`theme`) que deja el viejo
 *                    `:host([variant=…])` se le escapa. Verifica que el CSS no
 *                    use ningún eje canónico que el componente NO declara.
 *                    Caza exactamente el bug que el 2b no vio: lib-background
 *                    migrado a `theme` con el CSS aún en `variant`.
 *
 * Los 7 ejes canónicos (reflect:true + `:host([attr="value"])`) son los que la
 * migración de cohesión tocó. El resto de props enum (type/mode/icon/language…)
 * son funcionales por componente y quedan FUERA de alcance a propósito.
 *
 * Allowlists estilo `KNOWN_PENDING`: cada excepción es una decisión consciente
 * y documentada, no un escape. Que crezcan debe doler.
 *
 * Ejecutar:  pnpm --filter @shibui-ui/ui test:conformance
 */
import { describe, it, expect } from 'vitest';
// El barrel registra los 102 custom elements (side-effect import).
import '../../src/index';
// Mismo fixture que el Nivel 1: el generado que consume la API.
import { COMPONENTS_GENERATED } from '../../../../apps/shibui-api/src/domain/components/data/components.generated';

// ── Ejes canónicos de cohesión (por nombre de atributo) ────────────
const COHESION_AXES = new Set(['size', 'tone', 'surface', 'theme', 'variant', 'display', 'tint']);

// ── Allowlists (vaciar/justificar; estilo KNOWN_PENDING) ───────────
// `${slug}.${prop}` — props de cohesión que legítimamente NO reflejan
// (estilados por otro mecanismo, no por `:host([attr=…])`).
const NO_REFLECT = new Set<string>([
  // size se consume en JS — `var(--lib-space-${size})` en el render — y NO hay
  // ningún `:host([size=…])`, así que reflejar el atributo es innecesario.
  'lib-spacer.size',
]);
// `${slug}.${attr}=${value}` — selector de eje vivo con un valor fuera de
// opciones que es intencional (alias back-compat, etc.). Documentar el porqué.
const ORPHAN_EXEMPT = new Set<string>([]);
// `${slug}.${attr}` — eje de cohesión presente en el CSS de un componente que
// NO lo declara como prop. Excepción consciente (p.ej. un átomo que reusa el
// nombre de un eje canónico para otra cosa interna). Documentar el porqué.
const PHANTOM_EXEMPT = new Set<string>([
  // lib-timeline-item comparte la MISMA hoja (`lib-timeline.css?inline`) que su
  // padre lib-timeline, que SÍ declara `size` (sm·md·lg) y es dueño de los
  // `:host([size=…])`. El item nunca recibe `size`, así que esas reglas son
  // no-ops inocuas en él — no CSS muerto. El dueño real las cubre en 2b.
  'lib-timeline-item.size',
]);

interface Prop {
  name: string;
  attribute?: string;
  default?: string;
  options?: string[];
}
interface Comp {
  slug: string;
  tagName: string;
  api: { props?: Prop[] };
}

const components = COMPONENTS_GENERATED as unknown as Comp[];

/** Quita las comillas envolventes del `default` del manifest (`"'md'"` → `md`). */
const strip = (d?: string): string | undefined => d?.replace(/^['"]+|['"]+$/g, '');

/** Props de un componente que pertenecen a un eje de cohesión y tienen opciones. */
function cohesionProps(c: Comp): Prop[] {
  return (c.api.props ?? []).filter(
    (p) => Array.isArray(p.options) && COHESION_AXES.has(p.attribute ?? p.name),
  );
}

type LitEl = HTMLElement & { updateComplete?: Promise<unknown> };

/** Monta el componente y espera el primer render. */
async function mount(tag: string): Promise<LitEl> {
  const el = document.createElement(tag) as LitEl;
  document.body.appendChild(el);
  if (el.updateComplete) await el.updateComplete;
  return el;
}

/**
 * CSS que el componente realmente envía: concatena el `cssText` de su
 * `static styles` (CSSResult[] de Lit, ya incluye el componente .css inlineado
 * y los shared tokens). No necesita instanciar ni que los tokens resuelvan.
 */
function componentCss(tag: string): string {
  const ctor = customElements.get(tag) as unknown as {
    styles?: unknown;
    elementStyles?: unknown;
  } | undefined;
  if (!ctor) return '';
  const raw = ctor.styles ?? ctor.elementStyles;
  const arr = Array.isArray(raw) ? raw : raw != null ? [raw] : [];
  return arr.map((s) => (s as { cssText?: string })?.cssText ?? '').join('\n');
}

// ════════════════════════════════════════════════════════════════════
// 2a · REFLEJO de atributo (runtime)
// ════════════════════════════════════════════════════════════════════
describe('Nivel 2a — los props de cohesión reflejan su atributo', () => {
  for (const c of components) {
    for (const p of cohesionProps(c)) {
      const key = `${c.slug}.${p.name}`;
      if (NO_REFLECT.has(key)) continue;
      const attr = p.attribute ?? p.name;
      const def = strip(p.default);
      const sample = p.options!.find((o) => o !== def) ?? p.options![0];

      it(`${key}: set '${sample}' ⇒ [${attr}="${sample}"]`, async () => {
        const el = await mount(c.tagName);
        try {
          (el as unknown as Record<string, unknown>)[p.name] = sample;
          if (el.updateComplete) await el.updateComplete;
          expect(el.getAttribute(attr)).toBe(sample);
        } finally {
          el.remove();
        }
      });
    }
  }
});

// ════════════════════════════════════════════════════════════════════
// 2b · SIN selectores huérfanos (CSS ⇒ manifest)
// Un selector :host([eje="valor"]) cuyo EJE es un prop vivo pero cuyo
// VALOR ya no es una opción declarada = CSS muerto tras un rename.
// ════════════════════════════════════════════════════════════════════
/** Mapa attr→Set(opciones) de los ejes de cohesión declarados por el componente. */
function declaredAxes(c: Comp): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const p of cohesionProps(c)) {
    const attr = p.attribute ?? p.name;
    map.set(attr, new Set([...(map.get(attr) ?? []), ...p.options!]));
  }
  return map;
}

describe('Nivel 2b — sin selectores de cohesión huérfanos', () => {
  for (const c of components) {
    const declared = declaredAxes(c);
    if (declared.size === 0) continue;

    it(`${c.slug}: cada selector de eje vivo usa una opción declarada`, () => {
      const css = componentCss(c.tagName);
      const orphans: string[] = [];
      for (const [attr, opts] of declared) {
        // [attr="v"] | [attr='v'] | [attr=v]
        const re = new RegExp(`\\[${attr}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([\\w-]+))\\]`, 'g');
        let m: RegExpExecArray | null;
        while ((m = re.exec(css)) !== null) {
          const val = m[1] ?? m[2] ?? m[3];
          if (opts.has(val)) continue;
          if (ORPHAN_EXEMPT.has(`${c.slug}.${attr}=${val}`)) continue;
          orphans.push(`[${attr}="${val}"]`);
        }
      }
      expect(
        [...new Set(orphans)],
        `${c.slug}: selectores con valor fuera de opciones declaradas (¿rename sin limpiar?)`,
      ).toEqual([]);
    });
  }
});

// ════════════════════════════════════════════════════════════════════
// 2c · SIN ejes FANTASMA (CSS ⇒ manifest)
// El 2b solo mira ejes que el componente DECLARA: si renombras el VALOR
// (`filled`→`solid`) lo caza, pero si renombras el EJE ENTERO
// (`variant`→`theme`) y dejas el viejo `:host([variant=…])`, ese eje ya no
// está en el mapa de declarados y el 2b pasa en silencio. Este guardián
// cierra ese hueco: cualquier `:host([X=…])` cuyo X sea un eje de cohesión
// CANÓNICO que el componente NO declara como prop = CSS muerto tras un
// rename de eje. (Caso real: lib-background tras `variant`→`theme`.)
// Sigue siendo inverse (CSS⇒manifest), así que no reintroduce los falsos
// positivos de la dirección forward en componentes token/JS-driven: un
// componente legítimo no tiene selectores de ejes que no declara.
// ════════════════════════════════════════════════════════════════════
/** Nombres de atributo de eje de cohesión que el componente declara como prop. */
function declaredAxisNames(c: Comp): Set<string> {
  const names = new Set<string>();
  for (const p of c.api.props ?? []) {
    const attr = p.attribute ?? p.name;
    if (COHESION_AXES.has(attr)) names.add(attr);
  }
  return names;
}

describe('Nivel 2c — sin selectores de eje de cohesión fantasma', () => {
  for (const c of components) {
    const declared = declaredAxisNames(c);
    // Ejes canónicos que este componente NO declara: si aparecen en su CSS,
    // son fantasmas de un rename a medias.
    const phantomAxes = [...COHESION_AXES].filter((a) => !declared.has(a));
    if (phantomAxes.length === 0) continue;

    it(`${c.slug}: el CSS no usa ejes de cohesión que no declara`, () => {
      const css = componentCss(c.tagName);
      const phantoms: string[] = [];
      for (const attr of phantomAxes) {
        if (PHANTOM_EXEMPT.has(`${c.slug}.${attr}`)) continue;
        // [attr="v"] | [attr='v'] | [attr=v]
        const re = new RegExp(`\\[${attr}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([\\w-]+))\\]`, 'g');
        let m: RegExpExecArray | null;
        while ((m = re.exec(css)) !== null) {
          const val = m[1] ?? m[2] ?? m[3];
          phantoms.push(`[${attr}="${val}"]`);
        }
      }
      expect(
        [...new Set(phantoms)],
        `${c.slug}: selectores de un eje canónico que el componente no declara (¿rename de eje sin limpiar el CSS?)`,
      ).toEqual([]);
    });
  }
});
