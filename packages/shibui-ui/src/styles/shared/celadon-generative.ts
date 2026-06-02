/**
 * Generadores procedurales de las decoraciones celadon GENERATIVAS
 * (craquelé y condensación). Portados 1:1 del prototipo
 * celadon-taxonomy.html para conservar su calidad orgánica.
 *
 * Devuelven un string `<svg>…</svg>` completo, determinista por semilla,
 * para embeber con `unsafeHTML` dentro de la capa `.fx-*`. Determinista =
 * baselines de regresión visual estables; cambia `seed` para variar.
 *
 * Los colores van baked como oklch (un SVG-as-markup no puede leer
 * custom properties); cada literal equivale a un token celadon, anotado.
 */

/** PRNG determinista (mulberry32). */
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Redondeo a 1 decimal (compacta el path). */
const f = (n: number): number => Math.round(n * 10) / 10;

let _uid = 0;
const nextId = (prefix: string): string => `${prefix}-${(_uid++).toString(36)}`;

// ── Craquelure ─────────────────────────────────────────────────

export interface CraquelureOptions {
  seed?: number;
  width?: number;
  height?: number;
  cols?: number;
  rows?: number;
  /** Grosor mín/máx de las grietas. */
  wMin?: number;
  wMax?: number;
  /** Desplazamiento de la fisura hundida (sombra). */
  shadowDx?: number;
  shadowDy?: number;
  shadowOpacity?: number;
  /** Color/opacidad del borde que capta la luz (realce). */
  highlight?: string;
  highlightOpacity?: number;
}

const CELADON_SHADOW = "oklch(5% 0.04 178deg)"; // --celadon-shadow-deep (~#040f0c)
const CELADON_HI = "oklch(75.8% 0.048 169.2deg)"; // --color-celadon-250 (~#8fb6a8)

/**
 * Red de grietas tipo ice-crackle: rejilla con jitter, ~16% de aristas
 * descartadas (celdas irregulares), diagonales en Y, ramales muertos y
 * segmentos recta/Q/C. Doble `<use>`: fisura hundida + borde que capta luz.
 */
export function craquelureSVG(opts: CraquelureOptions = {}): string {
  const W = opts.width ?? 320;
  const H = opts.height ?? 200;
  const cols = opts.cols ?? 6;
  const rows = opts.rows ?? 4;
  const wMin = opts.wMin ?? 0.45;
  const wMax = opts.wMax ?? 0.9;
  const sx = opts.shadowDx ?? 0.9;
  const sy = opts.shadowDy ?? 1.2;
  const sop = opts.shadowOpacity ?? 0.5;
  const hi = opts.highlight ?? CELADON_HI;
  const hop = opts.highlightOpacity ?? 0.62;

  const rnd = mulberry32(opts.seed ?? 23);
  const cw = W / cols;
  const ch = H / rows;
  const pts: Array<Array<{ x: number; y: number }>> = [];

  for (let r = 0; r <= rows; r++) {
    pts[r] = [];
    for (let c = 0; c <= cols; c++) {
      const onL = c === 0;
      const onR = c === cols;
      const onT = r === 0;
      const onB = r === rows;
      let x = c * cw + (onL || onR ? 0 : (rnd() - 0.5) * cw * 0.8);
      let y = r * ch + (onT || onB ? 0 : (rnd() - 0.5) * ch * 0.8);
      if (onL) x -= 3;
      if (onR) x += 3;
      if (onT) y -= 3;
      if (onB) y += 3;
      pts[r]![c] = { x, y };
    }
  }

  // Accesor con aserción: la rejilla está completamente poblada arriba.
  const P = (r: number, c: number): { x: number; y: number } => pts[r]![c]!;

  let edges: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      if (c < cols && r !== 0 && r !== rows) edges.push([P(r, c), P(r, c + 1)]);
      if (r < rows && c !== 0 && c !== cols) edges.push([P(r, c), P(r + 1, c)]);
    }
  }
  edges = edges.filter(() => rnd() > 0.16);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = rnd();
      if (k < 0.12) edges.push([P(r, c), P(r + 1, c + 1)]);
      else if (k < 0.24) edges.push([P(r + 1, c), P(r, c + 1)]);
    }
  }
  const branches: Array<[{ x: number; y: number }, { x: number; y: number }]> = [];
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (rnd() < 0.2) {
        const a = P(r, c);
        const ang = rnd() * 6.283;
        const d = (0.4 + rnd() * 0.5) * Math.min(cw, ch);
        branches.push([a, { x: a.x + Math.cos(ang) * d, y: a.y + Math.sin(ang) * d }]);
      }
    }
  }

  const seg = (
    a: { x: number; y: number },
    b: { x: number; y: number },
    allowStraight: boolean,
  ): string => {
    if (allowStraight && rnd() < 0.3) return `M${f(a.x)} ${f(a.y)}L${f(b.x)} ${f(b.y)}`;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    if (rnd() < 0.4) {
      const o1 = (rnd() - 0.5) * len * 0.4;
      const o2 = (rnd() - 0.5) * len * 0.4;
      const c1x = a.x + dx * 0.33 - (dy / len) * o1;
      const c1y = a.y + dy * 0.33 + (dx / len) * o1;
      const c2x = a.x + dx * 0.66 - (dy / len) * o2;
      const c2y = a.y + dy * 0.66 + (dx / len) * o2;
      return `M${f(a.x)} ${f(a.y)}C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(b.x)} ${f(b.y)}`;
    }
    const off = (rnd() - 0.5) * len * 0.4;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    return `M${f(a.x)} ${f(a.y)}Q${f(mx - (dy / len) * off)} ${f(my + (dx / len) * off)} ${f(b.x)} ${f(b.y)}`;
  };

  let inner = "";
  edges.forEach((e) => {
    const w = (wMin + rnd() * (wMax - wMin)).toFixed(2);
    inner += `<path d="${seg(e[0], e[1], true)}" stroke-width="${w}"/>`;
  });
  branches.forEach((e) => {
    inner += `<path d="${seg(e[0], e[1], false)}" stroke-width="${(wMin * 0.6).toFixed(2)}"/>`;
  });

  const gid = nextId("cel-craq");
  // Colores vía style="" (parser CSS → oklch garantizado), no como
  // atributo de presentación (cuyo parser puede no aceptar oklch).
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs><g id="${gid}" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g></defs>` +
    `<use href="#${gid}" transform="translate(${sx} ${sy})" style="stroke:${CELADON_SHADOW};stroke-opacity:${sop}"/>` +
    `<use href="#${gid}" style="stroke:${hi};stroke-opacity:${hop}"/>` +
    `</svg>`
  );
}

// ── Condensación ───────────────────────────────────────────────

export interface CondensationOptions {
  seed?: number;
  width?: number;
  height?: number;
  count?: number;
  rMin?: number;
  rMax?: number;
  /** Opacidad del brillo especular y del menisco (rim). */
  highlightOpacity?: number;
  rimOpacity?: number;
}

/**
 * Gotas dispersas con tamaño sesgado a pequeñas (t³). Cada gota es un
 * radialGradient con foco desplazado (especular arriba-izq) + menisco que
 * capta luz al 86%; las grandes proyectan una sombrita debajo.
 */
export function condensationSVG(opts: CondensationOptions = {}): string {
  const W = opts.width ?? 320;
  const H = opts.height ?? 200;
  const count = opts.count ?? 120;
  const rMin = opts.rMin ?? 0.7;
  const rMax = opts.rMax ?? 3.6;
  const hl = opts.highlightOpacity ?? 0.45;
  const rim = opts.rimOpacity ?? 0.22;

  const rnd = mulberry32(opts.seed ?? 9);
  const gid = nextId("cel-cond");
  let drops = "";
  for (let i = 0; i < count; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    let t = rnd();
    t = t * t * t;
    const r = rMin + (rMax - rMin) * t;
    if (r > 1.8) {
      // sombra sutil bajo las gotas grandes (~#02100c)
      drops += `<circle cx="${f(x + r * 0.18)}" cy="${f(y + r * 0.22)}" r="${f(r)}" style="fill:oklch(5% 0.04 178deg);fill-opacity:0.25"/>`;
    }
    drops += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="url(#${gid})"/>`;
  }
  // stop-color vía style="" (parser CSS → oklch garantizado).
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs><radialGradient id="${gid}" cx="50%" cy="50%" r="50%" fx="38%" fy="34%">` +
    `<stop offset="0%" style="stop-color:oklch(98% 0.012 172deg);stop-opacity:${hl}"/>` + // especular (glint)
    `<stop offset="22%" style="stop-color:oklch(88% 0.03 172deg);stop-opacity:0.13"/>` +
    `<stop offset="62%" style="stop-color:oklch(75% 0.045 165deg);stop-opacity:0.05"/>` +
    `<stop offset="86%" style="stop-color:oklch(92% 0.02 168deg);stop-opacity:${rim}"/>` + // menisco que capta luz
    `<stop offset="100%" style="stop-color:oklch(92% 0.02 168deg);stop-opacity:0"/>` +
    `</radialGradient></defs>${drops}</svg>`
  );
}
