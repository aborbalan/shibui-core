/**
 * Nivel 2 — Conformidad RUNTIME de los props de cohesión.
 * ------------------------------------------------------------------
 * El Nivel 1 (`scripts/__tests__/manifest-cohesion.test.ts`) valida la
 * FORMA del API en el manifest: que `tone`, `variant`, `display`… declaren
 * sólo el vocabulario canónico. Pero el manifest puede estar impecable y el
 * componente seguir roto: tras los renames de la migración (`variant`→`tone`/
 * `tint`/`display`/`theme`) puede quedar un selector `:host([variant=…])`
 * HUÉRFANO, un `reflect` perdido, o un atributo que ya no pinta nada.
 *
 * Esta suite cierra ese hueco instanciando cada componente en un browser real
 * (vitest browser mode · Chromium) y, data-driven desde el MISMO manifest que
 * es el fixture del Nivel 1, asevera dos cosas por cada eje de cohesión:
 *
 *   2a · REFLEJO   — set `el[prop] = opt` ⇒ `el.getAttribute(attr) === opt`.
 *                    Si el reflect se perdió, TODO `:host([attr=…])` muere en
 *                    silencio. Este es el guardián más barato.
 *   2c · DELTA     — el render con `opt` difiere del render con el default.
 *                    Atrapa el selector huérfano/muerto: el atributo refleja
 *                    pero no hay (o quedó override) una regla que lo pinte.
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
// (p.ej. estilados vía clase interna en vez de `:host([attr])`).
const NO_REFLECT = new Set<string>([]);
// `${slug}.${prop}=${option}` — opciones que por diseño NO cambian el
// render observable respecto al default (raras; documentar el porqué).
const NO_VISUAL_DELTA = new Set<string>([]);

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

/** Monta el componente, espera el primer render y congela transiciones/animaciones. */
async function mount(tag: string): Promise<LitEl> {
  const el = document.createElement(tag) as LitEl;
  document.body.appendChild(el);
  if (el.updateComplete) await el.updateComplete;
  // Congela motion DENTRO del shadow (los estilos de document no lo penetran).
  if (el.shadowRoot) {
    const freeze = document.createElement('style');
    freeze.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}';
    el.shadowRoot.appendChild(freeze);
  }
  return el;
}

async function setProp(el: LitEl, name: string, value: string): Promise<void> {
  (el as unknown as Record<string, unknown>)[name] = value;
  if (el.updateComplete) await el.updateComplete;
}

// Propiedades visuales sondeadas para el delta. Lista amplia para minimizar
// falsos negativos; un cambio de cohesión casi siempre toca alguna de ellas.
const PROBE = [
  'color', 'background-color', 'background-image', 'border-top-color',
  'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-width', 'border-radius', 'box-shadow', 'opacity', 'width',
  'height', 'padding', 'gap', 'font-size', 'font-weight', 'text-transform',
  'letter-spacing', 'transform',
] as const;

/** Serializa el computed-style del host + todo su subárbol shadow. */
function snapshot(el: LitEl): string {
  const root = el.shadowRoot;
  const nodes: Element[] = [el, ...(root ? Array.from(root.querySelectorAll('*')) : [])];
  return nodes
    .map((n) => {
      const cs = getComputedStyle(n);
      return PROBE.map((p) => cs.getPropertyValue(p)).join('|');
    })
    .join('||');
}

// ════════════════════════════════════════════════════════════════════
// 2a · REFLEJO de atributo
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
          await setProp(el, p.name, sample);
          expect(el.getAttribute(attr)).toBe(sample);
        } finally {
          el.remove();
        }
      });
    }
  }
});

// ════════════════════════════════════════════════════════════════════
// 2c · DELTA visual por opción (caza selectores huérfanos/muertos)
// ════════════════════════════════════════════════════════════════════
describe('Nivel 2c — cada opción de cohesión cambia el render', () => {
  for (const c of components) {
    for (const p of cohesionProps(c)) {
      const def = strip(p.default) ?? p.options![0];
      for (const opt of p.options!) {
        if (opt === def) continue; // el default ES la línea base
        const key = `${c.slug}.${p.name}=${opt}`;
        if (NO_VISUAL_DELTA.has(key)) continue;

        it(`${key} difiere de '${def}'`, async () => {
          const base = await mount(c.tagName);
          const variant = await mount(c.tagName);
          try {
            await setProp(base, p.name, def);
            await setProp(variant, p.name, opt);
            expect(snapshot(variant)).not.toBe(snapshot(base));
          } finally {
            base.remove();
            variant.remove();
          }
        });
      }
    }
  }
});
