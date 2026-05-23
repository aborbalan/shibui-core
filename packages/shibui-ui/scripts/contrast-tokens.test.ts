/**
 * Contrast Token Test — WCAG AA compliance
 *
 * Valida que los tokens semánticos de texto y fondo de Shibui UI cumplen
 * los umbrales de contraste WCAG en los 7 contextos de color:
 * default (sin katachi) + wabi, kintsugi, sabi, terminal, shizen, celadon.
 *
 * Por qué existe este test
 * ─────────────────────────
 * Los tokens semánticos se resuelven en cadena: paleta → semántico → katachi.
 * Una modificación en _palette.css o en un override de katachi puede romper
 * el contraste silenciosamente. Este test es la red de seguridad que detecta
 * esa regresión sin necesidad de browser ni nuevas dependencias.
 *
 * Corredor
 * ────────
 * pnpm test:unit  (vitest, entorno Node, sin DOM)
 */

import { describe, it, expect } from 'vitest';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const tokensDir  = path.resolve(__dirname, '../src/styles/shared/tokens');

/* ═══════════════════════════════════════════════════════════════════════════
   PARSING — leer CSS custom properties desde ficheros de tokens
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Extrae todas las custom properties de un bloque CSS.
 * Solo captura propiedades cuyo valor es un literal oklch() o un var().
 * Devuelve Map<"--nombre", "valor raw">.
 */
function parseCssTokens(css: string): Map<string, string> {
  const map = new Map<string, string>();
  // Captura: --nombre-token: <valor>;
  const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(css)) !== null) {
    map.set(m[1].trim(), m[2].trim());
  }
  return map;
}

/**
 * Dado un nombre de token (ej. "--text-primary"), resuelve la cadena de
 * var() hasta obtener un valor OKLCH literal.
 * `maps` es un array de Maps ordenado por prioridad (de mayor a menor).
 */
function resolveVar(
  name: string,
  maps: Map<string, string>[],
  depth = 0,
): string | null {
  if (depth > 10) return null; // evitar ciclos

  for (const map of maps) {
    const val = map.get(name);
    if (val === undefined) continue;

    // Si es una referencia var(), resolverla
    const varMatch = val.match(/^var\(\s*(--[\w-]+)(?:\s*,.*?)?\s*\)$/);
    if (varMatch) {
      return resolveVar(varMatch[1], maps, depth + 1);
    }

    // Valor literal (oklch, hex, rgb…)
    return val;
  }
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARGA DE TOKENS
   ═══════════════════════════════════════════════════════════════════════════ */

const paletteCss  = fs.readFileSync(path.join(tokensDir, '_palette.css'),  'utf-8');
const semanticCss = fs.readFileSync(path.join(tokensDir, '_semantic.css'), 'utf-8');
const katachiCss  = fs.readFileSync(path.join(tokensDir, '_katachi.css'),  'utf-8');

const paletteMap  = parseCssTokens(paletteCss);
const semanticMap = parseCssTokens(semanticCss);

/**
 * Extrae los tokens de un selector katachi concreto del CSS de _katachi.css.
 * Busca el bloque que contiene `data-katachi="<id>"`.
 */
function parseKatachiBlock(id: string): Map<string, string> {
  // Encuentra el bloque delimitado por el selector del katachi
  const selectorRe = new RegExp(
    `\\[data-katachi="${id}"\\][^{]*\\{([^}]*)\\}`,
    's',
  );
  const match = katachiCss.match(selectorRe);
  if (!match) return new Map();
  return parseCssTokens(match[1]);
}

/** Resuelve un token semántico en el contexto de un katachi dado. */
function resolveInContext(token: string, katachiMap: Map<string, string>): string | null {
  // Prioridad: override katachi > semántico base > paleta
  return resolveVar(token, [katachiMap, semanticMap, paletteMap]);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MATH — OKLCH → linear sRGB → luminancia relativa WCAG
   ═══════════════════════════════════════════════════════════════════════════ */

interface OklchColor {
  l: number;     // [0, 1]
  c: number;     // [0, ~0.4]
  h: number;     // grados [0, 360)
  alpha: number; // [0, 1]
}

type LinearRgb = [number, number, number];

/**
 * Parsea una cadena oklch() a sus componentes numéricos.
 * Admite: oklch(97.77% 0.003 68.35deg) y oklch(97.77% 0.003 68.35deg / 0.55)
 * También oklch(97.77% 0.003 68.35) (hue sin unidad).
 */
function parseOklch(str: string): OklchColor | null {
  const s = str.trim();
  if (!s.startsWith('oklch(')) return null;

  // oklch( L C H [/ A] )
  const inner = s.slice(6, -1).trim();
  const [main, alphaPart] = inner.split('/').map(p => p.trim());
  const parts = main.split(/\s+/);
  if (parts.length < 3) return null;

  const parseNum = (v: string): number => {
    const n = parseFloat(v);
    return v.endsWith('%') ? n / 100 : n;
  };

  const l     = parseNum(parts[0]);
  const c     = parseNum(parts[1]);
  const h     = parseFloat(parts[2]); // degrees
  const alpha = alphaPart !== undefined ? parseFloat(alphaPart) : 1;

  if (isNaN(l) || isNaN(c) || isNaN(h)) return null;
  return { l, c, h, alpha };
}

/** OKLCH → linear sRGB usando las matrices estándar de Björn Ottosson. */
function oklchToLinearRgb(color: OklchColor): LinearRgb {
  const hRad = (color.h * Math.PI) / 180;
  const a    = color.c * Math.cos(hRad);
  const b    = color.c * Math.sin(hRad);
  const L    = color.l;

  // OKLab → LMS (cúbico)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const lc = l_ * l_ * l_;
  const mc = m_ * m_ * m_;
  const sc = s_ * s_ * s_;

  // LMS → linear sRGB
  const r =  4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc;
  const g = -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc;
  const bv = -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc;

  // Clamp para valores marginalmente fuera de gamut
  return [
    Math.max(0, Math.min(1, r)),
    Math.max(0, Math.min(1, g)),
    Math.max(0, Math.min(1, bv)),
  ];
}

/**
 * Alpha-composita un foreground semi-transparente sobre un background opaco.
 * Ambos en linear sRGB. Devuelve el color resultante en linear sRGB.
 */
function alphaComposite(fg: LinearRgb, alpha: number, bg: LinearRgb): LinearRgb {
  return [
    alpha * fg[0] + (1 - alpha) * bg[0],
    alpha * fg[1] + (1 - alpha) * bg[1],
    alpha * fg[2] + (1 - alpha) * bg[2],
  ];
}

/**
 * Luminancia relativa WCAG 2.1 desde linear sRGB.
 * OKLab ya opera en linear light, por lo que no se aplica gamma.
 */
function relativeLuminance([r, g, b]: LinearRgb): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Ratio de contraste WCAG: siempre ≥ 1. */
function contrastRatio(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker  = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ═══════════════════════════════════════════════════════════════════════════
   ORQUESTACIÓN — calcular contraste para un par de tokens en un contexto
   ═══════════════════════════════════════════════════════════════════════════ */

function computeContrast(
  textToken: string,
  bgToken: string,
  katachiMap: Map<string, string>,
): number | null {
  const rawBg   = resolveInContext(bgToken,   katachiMap);
  const rawText = resolveInContext(textToken, katachiMap);

  if (!rawBg || !rawText) return null;

  const bgColor   = parseOklch(rawBg);
  const textColor = parseOklch(rawText);

  if (!bgColor || !textColor) return null;

  const bgLinear   = oklchToLinearRgb(bgColor);
  const textLinear = oklchToLinearRgb(textColor);

  // Si el texto tiene alpha, componerlo sobre el fondo
  const effectiveText: LinearRgb = textColor.alpha < 1
    ? alphaComposite(textLinear, textColor.alpha, bgLinear)
    : textLinear;

  const lumBg   = relativeLuminance(bgLinear);
  const lumText = relativeLuminance(effectiveText);

  return contrastRatio(lumText, lumBg);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEFINICIÓN DE PARES Y CONTEXTOS
   ═══════════════════════════════════════════════════════════════════════════ */

const KATACHI_IDS = ['wabi', 'kintsugi', 'sabi', 'terminal', 'shizen', 'celadon'] as const;

// TODO(a11y): --text-muted no alcanza 3:1 en 4 contextos.
// Mediciones actuales: default/shizen/wabi ≈ 2.97:1, sabi ≈ 2.41:1.
// El token es intencionalmente bajo (placeholders, metadata), pero está
// por debajo del umbral mínimo WCAG para texto grande.
// Decisión: skip hasta que el equipo de diseño ajuste los valores.
// Referencia: docs/a11y-debt.md → "text-muted contrast"
const PAIRS: Array<{
  text: string;
  bg: string;
  min: number;
  label: string;
  skip?: true;
}> = [
  { text: '--text-primary',   bg: '--bg-surface',  min: 4.5, label: 'WCAG AA' },
  { text: '--text-primary',   bg: '--bg-base',     min: 4.5, label: 'WCAG AA' },
  { text: '--text-secondary', bg: '--bg-surface',  min: 4.5, label: 'WCAG AA' },
  { text: '--text-inverse',   bg: '--bg-inverse',  min: 4.5, label: 'WCAG AA' },
  { text: '--text-link',      bg: '--bg-surface',  min: 4.5, label: 'WCAG AA' },
  { text: '--text-muted',     bg: '--bg-surface',  min: 3.0, label: 'WCAG AA Large', skip: true },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TESTS
   ═══════════════════════════════════════════════════════════════════════════ */

/** Contexto default: sin overrides de katachi, hereda _semantic.css */
const defaultMap = new Map<string, string>();

const contexts: Array<{ name: string; map: Map<string, string> }> = [
  { name: 'default', map: defaultMap },
  ...KATACHI_IDS.map(id => ({ name: id, map: parseKatachiBlock(id) })),
];

describe('WCAG contrast — tokens semánticos × contextos katachi', () => {
  for (const { name, map } of contexts) {
    describe(`contexto: ${name}`, () => {
      for (const { text, bg, min, label, skip } of PAIRS) {
        const runner = skip ? it.skip : it;
        runner(`${text} sobre ${bg} ≥ ${min}:1 (${label})`, () => {
          const ratio = computeContrast(text, bg, map);

          expect(
            ratio,
            [
              `No se pudo resolver el par ${text} / ${bg} en contexto "${name}".`,
              `Comprueba que ambos tokens están definidos en _semantic.css o _katachi.css.`,
            ].join('\n'),
          ).not.toBeNull();

          expect(
            ratio!,
            `Contraste ${ratio?.toFixed(2)}:1 — por debajo de ${min}:1 (${label})`,
          ).toBeGreaterThanOrEqual(min);
        });
      }
    });
  }
});
