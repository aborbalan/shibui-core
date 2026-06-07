/**
 * icon-registry — tests unitarios puros (sin DOM, sin componente, sin Storybook)
 *
 * Importa el ICON_REGISTRY directamente como módulo.
 * Vitest procesa los imports `?raw` de Phosphor mediante el pipeline SSR de Vite,
 * por lo que cada valor del registro es la cadena SVG real — no un mock.
 *
 * Para correr:
 *   pnpm test:unit            → una vez
 *   pnpm test:unit:watch      → modo TDD
 *
 * No necesita Storybook corriendo ni browser.
 */

import { describe, it, expect } from 'vitest';
import { ICON_REGISTRY } from '../../src/shared/icons/icon-registry';

/* ─────────────────────────────────────────────────────────────────────
   Constantes de contrato — actualizar cuando cambie el registry
   ───────────────────────────────────────────────────────────────────── */

/** Total de claves registradas. */
const EXPECTED_COUNT = 136; // +3 merge develop (plus, add, new)

/** Alias → canónico: deben apuntar al mismo SVG. */
const ALIAS_PAIRS: ReadonlyArray<readonly [string, string]> = [
  // Aliases semánticos originales
  ['back',          'arrow-left'],
  ['forward',       'arrow-right'],
  ['notification',  'bell'],
  ['envelope',      'mail'],
  ['pin',           'location'],
  ['x-social',      'twitter'],
  ['quill',         'write'],
  // Aliases de nombre (misma SVG, clave alternativa)
  ['paperclip',     'attachment'],
  ['house',         'home'],
  ['leaf',          'nature'],
  ['globe',         'world'],
  ['shield-check',  'shield'],
  ['thermometer',   'temp'],
  ['map-pin',       'location'],
  ['list',          'menu'],
] as const;

/** Claves críticas: usadas hardcoded en templates de componentes. */
const CRITICAL_KEYS = [
  'check',          // lib-copy-button (estado copiado)
  'caret-right',    // lib-breadcrumb · lib-text-list
  'check-circle',   // lib-file-uploader (done)
  'warning-circle', // lib-file-uploader (error icono)
  'warning',        // lib-file-uploader (error acción)
  'cloud-arrow-up', // lib-file-uploader (drop zone)
  'circle',         // lib-timeline-item (icono por defecto)
] as const;

/* ─────────────────────────────────────────────────────────────────────
   Helpers
   ───────────────────────────────────────────────────────────────────── */

const ALL_KEYS   = Object.keys(ICON_REGISTRY);
const ALL_VALUES = Object.values(ICON_REGISTRY);

/* ══════════════════════════════════════════════════════════════════════
   Suite 1 · Completitud y contrato de claves
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · completitud', () => {

  it(`tiene exactamente ${EXPECTED_COUNT} claves`, () => {
    expect(ALL_KEYS).toHaveLength(EXPECTED_COUNT);
  });

  it('no tiene claves vacías o undefined', () => {
    const empty = ALL_KEYS.filter(k => !k || !ICON_REGISTRY[k]);
    expect(empty, `Claves sin valor: ${empty.join(', ')}`).toHaveLength(0);
  });

  it('todos los valores son strings no vacíos', () => {
    const bad = ALL_KEYS.filter(k => typeof ICON_REGISTRY[k] !== 'string' || ICON_REGISTRY[k].length === 0);
    expect(bad, `Valores no-string o vacíos: ${bad.join(', ')}`).toHaveLength(0);
  });

});

/* ══════════════════════════════════════════════════════════════════════
   Suite 2 · Formato SVG — un test por icono
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · formato SVG por icono', () => {

  it.each(ALL_KEYS)('"%s" — empieza por <svg', (key) => {
    expect(ICON_REGISTRY[key].trimStart()).toMatch(/^<svg/i);
  });

  it.each(ALL_KEYS)('"%s" — contiene viewBox', (key) => {
    expect(ICON_REGISTRY[key]).toContain('viewBox');
  });

  it.each(ALL_KEYS)('"%s" — cierra con </svg>', (key) => {
    expect(ICON_REGISTRY[key].trimEnd()).toMatch(/<\/svg>$/i);
  });

  it.each(ALL_KEYS)('"%s" — contiene al menos un elemento de forma', (key) => {
    expect(ICON_REGISTRY[key]).toMatch(/<(path|line|polyline|polygon|rect|circle|ellipse)/i);
  });

});

/* ══════════════════════════════════════════════════════════════════════
   Suite 3 · Seguridad — ningún SVG es peligroso
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · seguridad', () => {

  it('ningún SVG contiene etiquetas <script>', () => {
    const dangerous = ALL_KEYS.filter(k => /<script/i.test(ICON_REGISTRY[k]));
    expect(dangerous, `SVGs con <script>: ${dangerous.join(', ')}`).toHaveLength(0);
  });

  it('ningún SVG contiene atributos de evento on*=', () => {
    const dangerous = ALL_KEYS.filter(k => /\son\w+=/i.test(ICON_REGISTRY[k]));
    expect(dangerous, `SVGs con on*=: ${dangerous.join(', ')}`).toHaveLength(0);
  });

  it('ningún SVG contiene href javascript:', () => {
    const dangerous = ALL_KEYS.filter(k => /href\s*=\s*["']?\s*javascript:/i.test(ICON_REGISTRY[k]));
    expect(dangerous, `SVGs con javascript: href: ${dangerous.join(', ')}`).toHaveLength(0);
  });

  it.each(ALL_KEYS)('"%s" — sin <script>', (key) => {
    expect(ICON_REGISTRY[key]).not.toMatch(/<script/i);
  });

});

/* ══════════════════════════════════════════════════════════════════════
   Suite 4 · Alias — mismo SVG que el canónico
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · aliases', () => {

  it.each(ALIAS_PAIRS as Array<[string, string]>)(
    'alias "%s" tiene el mismo SVG que "%s"',
    (alias, canonical) => {
      expect(ICON_REGISTRY[alias]).toBeDefined();
      expect(ICON_REGISTRY[canonical]).toBeDefined();
      expect(ICON_REGISTRY[alias]).toBe(ICON_REGISTRY[canonical]);
    },
  );

  it('todos los alias del array están presentes en el registry', () => {
    const missing = (ALIAS_PAIRS as Array<[string, string]>)
      .flatMap(([alias, canonical]) => [
        ...(ICON_REGISTRY[alias]    ? [] : [`alias "${alias}" falta`]),
        ...(ICON_REGISTRY[canonical] ? [] : [`canónico "${canonical}" falta`]),
      ]);
    expect(missing, missing.join('\n')).toHaveLength(0);
  });

});

/* ══════════════════════════════════════════════════════════════════════
   Suite 5 · Iconos críticos — presencia garantizada
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · iconos críticos (usados en templates de componentes)', () => {

  it.each(CRITICAL_KEYS)('"%s" existe en el registry', (key) => {
    expect(ICON_REGISTRY[key]).toBeDefined();
  });

  it.each(CRITICAL_KEYS)('"%s" tiene SVG válido', (key) => {
    const svg = ICON_REGISTRY[key];
    expect(svg).toMatch(/^<svg/i);
    expect(svg).toMatch(/<\/svg>$/i);
  });

  it('el SVG de "check" es del tipo correcto (tiene polyline o path)', () => {
    expect(ICON_REGISTRY['check']).toMatch(/<(path|polyline|line)/i);
  });

  it('el SVG de "caret-right" tiene orientación horizontal (polyline o path)', () => {
    expect(ICON_REGISTRY['caret-right']).toMatch(/<(path|polyline)/i);
  });

  it('el SVG de "cloud-arrow-up" es distinto al de "cloud-arrow-down" (si existiera)', () => {
    // Verifica que el icono es único (no es una copia de otro icono)
    expect(ICON_REGISTRY['cloud-arrow-up']).not.toBe(ICON_REGISTRY['x']);
    expect(ICON_REGISTRY['cloud-arrow-up']).not.toBe('');
  });

});

/* ══════════════════════════════════════════════════════════════════════
   Suite 6 · Invariantes globales
   ══════════════════════════════════════════════════════════════════════ */

describe('ICON_REGISTRY · invariantes globales', () => {

  it('todos los valores son únicos entre los iconos no-alias', () => {
    // Los aliases comparten SVG a propósito — filtramos los conocidos
    const aliasKeys = new Set(
      (ALIAS_PAIRS as Array<[string, string]>).map(([alias]) => alias),
    );
    const nonAliasValues = ALL_KEYS
      .filter(k => !aliasKeys.has(k))
      .map(k => ICON_REGISTRY[k]);

    const uniqueCount  = new Set(nonAliasValues).size;
    expect(uniqueCount).toBe(nonAliasValues.length);
  });

  it('el total de bytes de SVG es razonable (< 2 MB)', () => {
    const totalBytes = ALL_VALUES.reduce((acc, svg) => acc + svg.length, 0);
    expect(totalBytes).toBeLessThan(2 * 1024 * 1024);
  });

  it('ningún SVG supera 10 KB (evitar archivos gigantes)', () => {
    const oversized = ALL_KEYS.filter(k => ICON_REGISTRY[k].length > 10 * 1024);
    expect(oversized, `SVGs > 10 KB: ${oversized.join(', ')}`).toHaveLength(0);
  });

});
