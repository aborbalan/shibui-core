import { defineSukashi, type ShibuiSukashi } from '../src/web';
import { rasterize, coverageFromRGBA, type GraySource } from '../src/motif';
import {
  kasaneWeave,
  kasaneCoverWeave,
  rngFrom,
  systemSeed,
  type Bitmap,
  type Layer,
  type SeedSource,
} from '../src/core';
import { PATTERNS_BY_NAME, type PatternName } from '../src/pattern';
import { warpAll } from '../src/warp';
import {
  seal,
  openWithManifest,
  manifestMatch,
  manifestFromTrustReport,
  type SealManifest,
  type Warifu,
} from '../src/warifu';
import hankoReport from './fixtures/hanko-trust-report.json';
import { openSky } from '../src/entropy';
import { cameraSky } from '../src/entropy/camera';

defineSukashi();

const MOTIF = 26;
type GlyphFn = (ctx: CanvasRenderingContext2D, n: number) => void;

function drawFuji(ctx: CanvasRenderingContext2D, n: number): void {
  ctx.beginPath();
  ctx.moveTo(n * 0.5, n * 0.18);
  ctx.lineTo(n * 0.86, n * 0.82);
  ctx.lineTo(n * 0.14, n * 0.82);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(n * 0.5, n * 0.18);
  ctx.lineTo(n * 0.66, n * 0.42);
  ctx.lineTo(n * 0.56, n * 0.37);
  ctx.lineTo(n * 0.5, n * 0.45);
  ctx.lineTo(n * 0.44, n * 0.37);
  ctx.lineTo(n * 0.34, n * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#000';
}

function drawHeart(ctx: CanvasRenderingContext2D, n: number): void {
  const x = n / 2;
  const y = n * 0.32;
  const w = n * 0.42;
  const h = n * 0.42;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.3);
  ctx.bezierCurveTo(x, y, x - w, y, x - w, y + h * 0.35);
  ctx.bezierCurveTo(x - w, y + h * 0.78, x, y + h * 1.15, x, y + h * 1.5);
  ctx.bezierCurveTo(x, y + h * 1.15, x + w, y + h * 0.78, x + w, y + h * 0.35);
  ctx.bezierCurveTo(x + w, y, x, y, x, y + h * 0.3);
  ctx.closePath();
  ctx.fill();
}

function drawStar(ctx: CanvasRenderingContext2D, n: number): void {
  const cx = n / 2;
  const cy = n / 2 + 1;
  const R = n * 0.42;
  const r = n * 0.17;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r : R;
    const X = cx + Math.cos(ang) * rad;
    const Y = cy + Math.sin(ang) * rad;
    if (i) ctx.lineTo(X, Y);
    else ctx.moveTo(X, Y);
  }
  ctx.closePath();
  ctx.fill();
}

function drawKanji(ctx: CanvasRenderingContext2D, n: number): void {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.round(n * 0.9)}px serif`;
  ctx.fillText('光', n / 2, n / 2 + 1);
}

const GLYPHS: ReadonlyArray<{ label: string; draw: GlyphFn }> = [
  { label: 'Montaña', draw: drawFuji },
  { label: 'Corazón', draw: drawHeart },
  { label: 'Estrella', draw: drawStar },
  { label: '光', draw: drawKanji },
];

function makeMotif(draw: GlyphFn): Bitmap {
  const c = document.createElement('canvas');
  c.width = MOTIF;
  c.height = MOTIF;
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('canvas 2d no disponible');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, MOTIF, MOTIF);
  ctx.fillStyle = '#000';
  draw(ctx, MOTIF);
  const img = ctx.getImageData(0, 0, MOTIF, MOTIF);
  const src: GraySource = coverageFromRGBA({ width: MOTIF, height: MOTIF, data: img.data }, 'luma');
  return rasterize(src, { threshold: 128 });
}

const overlay = document.getElementById('overlay') as ShibuiSukashi;
const layerA = document.getElementById('layerA') as ShibuiSukashi;
const layerB = document.getElementById('layerB') as ShibuiSukashi;
const statusEl = document.getElementById('status') as HTMLElement;
const splitStatus = document.getElementById('split-status') as HTMLElement;

// Cada capa puede llevar un cover decorativo: vista sola parece arte, no ruido.
const COVERS: ReadonlyArray<{ label: string; name: PatternName | null; scale: number }> = [
  { label: 'Ruido', name: null, scale: 0 },
  { label: 'Seigaiha', name: 'seigaiha', scale: 12 },
  { label: 'Asanoha', name: 'asanoha', scale: 12 },
  { label: 'Sashiko', name: 'sashiko', scale: 12 },
  { label: 'Mon', name: 'mon', scale: 16 },
  { label: 'Moiré', name: 'moire', scale: 6 },
  { label: 'Uzumaki', name: 'uzumaki', scale: 9 },
];
let cover = COVERS[1] ?? COVERS[0]!; // por defecto, seigaiha

let motif = makeMotif(drawFuji);

// Fuente de semilla: sistema por defecto; «Del cielo» (kumo) la mezcla sin reemplazarla.
let seedSource: SeedSource = systemSeed;

// Remolino uzumaki (Ω en radianes): deforma ambas capas por igual. 0 = sin deformación.
let swirl = 0;

function reweave(): void {
  let layers: readonly [Layer, Layer];
  if (cover.name) {
    const c = PATTERNS_BY_NAME[cover.name]({ width: MOTIF * 2, height: MOTIF * 2, scale: cover.scale });
    const res = kasaneCoverWeave(motif, { cover: c, rng: rngFrom(seedSource) });
    layers = res.layers;
    const [fa, fb] = res.metric.fidelity;
    splitStatus.textContent =
      `Cada capa, sola, es un patrón ${cover.label.toLowerCase()} ` +
      `(parecido A ${fa.toFixed(2)} · B ${fb.toFixed(2)}). El motivo solo existe en la superposición.`;
  } else {
    layers = kasaneWeave(motif, { rng: rngFrom(seedSource) });
    splitStatus.textContent =
      'Cada capa, por separado, es ruido uniforme. El motivo solo existe en la superposición.';
  }
  if (swirl !== 0) {
    const [a, b] = warpAll([layers[0], layers[1]], swirl);
    layers = [a!, b!];
  }
  overlay.layers = layers;
  layerA.layers = [layers[0]];
  layerB.layers = [layers[1]];
}

const motifsEl = document.getElementById('motifs') as HTMLElement;
GLYPHS.forEach((g, i) => {
  const b = document.createElement('button');
  b.textContent = g.label;
  if (i === 0) b.classList.add('on');
  b.addEventListener('click', () => {
    motifsEl.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    motif = makeMotif(g.draw);
    reweave();
    void reseal();
  });
  motifsEl.appendChild(b);
});

const coversEl = document.getElementById('covers') as HTMLElement;
COVERS.forEach((c) => {
  const b = document.createElement('button');
  b.textContent = c.label;
  if (c === cover) b.classList.add('on');
  b.addEventListener('click', () => {
    coversEl.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    cover = c;
    reweave();
  });
  coversEl.appendChild(b);
});

const overlayView = document.getElementById('overlay-view') as HTMLElement;
const splitView = document.getElementById('split-view') as HTMLElement;
const vOverlay = document.getElementById('view-overlay') as HTMLElement;
const vSplit = document.getElementById('view-split') as HTMLElement;
function setView(overlayOn: boolean): void {
  overlayView.hidden = !overlayOn;
  splitView.hidden = overlayOn;
  vOverlay.classList.toggle('on', overlayOn);
  vSplit.classList.toggle('on', !overlayOn);
}
vOverlay.addEventListener('click', () => setView(true));
vSplit.addEventListener('click', () => setView(false));

const snapBtn = document.getElementById('snap') as HTMLElement;
snapBtn.addEventListener('click', () => {
  const on = overlay.hasAttribute('snap');
  if (on) overlay.removeAttribute('snap');
  else overlay.setAttribute('snap', '');
  snapBtn.classList.toggle('on', !on);
});

document.getElementById('reweave')?.addEventListener('click', reweave);

// Remolino: el deslizador (grados) deforma ambas capas; conmuta con el reveal (motivo girado).
const swirlEl = document.getElementById('swirl') as HTMLInputElement;
const swirlVal = document.getElementById('swirl-val') as HTMLElement;
swirlEl.addEventListener('input', () => {
  const deg = Number(swirlEl.value);
  swirl = (deg * Math.PI) / 180;
  swirlVal.textContent = `${deg}°`;
  reweave();
});

// Semilla: sistema (default) vs. del cielo (kumo).
const seedStatus = document.getElementById('seed-status') as HTMLElement;
const seedSystemBtn = document.getElementById('seed-system') as HTMLButtonElement;
const seedSkyBtn = document.getElementById('seed-sky') as HTMLButtonElement;

function setSeedButtons(skyOn: boolean): void {
  seedSkyBtn.classList.toggle('on', skyOn);
  seedSystemBtn.classList.toggle('on', !skyOn);
}

seedSystemBtn.addEventListener('click', () => {
  seedSource = systemSeed;
  setSeedButtons(false);
  seedStatus.textContent = 'Sembrado con la aleatoriedad del sistema.';
  reweave();
});

seedSkyBtn.addEventListener('click', async () => {
  seedSkyBtn.disabled = true;
  seedStatus.textContent = 'Mirando al cielo…';
  const sky = await openSky(cameraSky());
  seedSource = sky.source;
  setSeedButtons(sky.usedSky);
  seedStatus.textContent = sky.usedSky
    ? `Mezclado con el cielo (${sky.entropy?.toFixed(1)} bits/byte) — sin reemplazar la semilla del sistema.`
    : `Sin cielo (${sky.reason}); se mantiene la semilla del sistema.`;
  seedSkyBtn.disabled = false;
  reweave();
});

overlay.addEventListener('sukashi-reveal', (e: Event) => {
  const aligned = (e as CustomEvent<{ aligned: boolean }>).detail.aligned;
  statusEl.textContent = aligned ? 'alineado · el motivo se revela' : 'desalineado · el motivo se disgrega';
  statusEl.classList.toggle('aligned', aligned);
});

reweave();
statusEl.textContent = 'alineado · el motivo se revela — arrástralo para romperlo';
statusEl.classList.add('aligned');

// ── Candado · tablilla (warifu) ─────────────────────────────────────────────
// El motivo se sella contra el roster de hanko: solo abre cuando todo está sellado.
const tablilla = document.getElementById('tablilla') as ShibuiSukashi;
const tablillaStatus = document.getElementById('tablilla-status') as HTMLElement;
const manifestsEl = document.getElementById('manifests') as HTMLElement;

const ROSTER: readonly string[] = hankoReport.components.map((c) => c.tagName);
const sealedManifest: SealManifest = { entries: ROSTER.map((name) => ({ name, sealed: true })) };
const almostManifest: SealManifest = {
  entries: ROSTER.map((name, i) => ({ name, sealed: i !== ROSTER.length - 1 })),
};

interface ManifestSource {
  readonly label: string;
  readonly manifest: SealManifest;
  readonly hint: string;
}
const SOURCES: readonly ManifestSource[] = [
  {
    label: 'Proyecto sellado',
    manifest: sealedManifest,
    hint: `los ${hankoReport.total} componentes sellados`,
  },
  {
    label: 'Trust Report real (hoy)',
    manifest: manifestFromTrustReport(hankoReport),
    hint: `${hankoReport.trusted}/${hankoReport.total} sellados`,
  },
  { label: 'Casi (falta 1)', manifest: almostManifest, hint: 'todos menos uno' },
];
let manifestSource = SOURCES[0]!;

// La tablilla se sella siempre contra el roster completo (el «futuro cumplido»).
let targetMatch: Uint8Array | null = null;
let lock: Warifu | null = null;

async function reseal(): Promise<void> {
  if (!targetMatch) targetMatch = await manifestMatch(sealedManifest);
  lock = await seal(motif, targetMatch!);
  await retally();
}

async function retally(): Promise<void> {
  if (!lock) return;
  const opened = await openWithManifest(lock, manifestSource.manifest);
  if (opened) {
    tablilla.layers = opened;
    tablillaStatus.textContent = `abierta · las mitades encajan y el motivo se compone (${manifestSource.hint})`;
    tablillaStatus.classList.add('aligned');
  } else {
    // Sin match: mostramos la mitad guardada sola — ruido. La tablilla sigue cerrada.
    tablilla.layers = [lock.tally];
    tablillaStatus.textContent = `cerrada · ${manifestSource.hint} — se abrirá cuando se cumpla hanko`;
    tablillaStatus.classList.remove('aligned');
  }
}

SOURCES.forEach((s) => {
  const b = document.createElement('button');
  b.textContent = s.label;
  if (s === manifestSource) b.classList.add('on');
  b.addEventListener('click', () => {
    manifestsEl.querySelectorAll('button').forEach((x) => x.classList.remove('on'));
    b.classList.add('on');
    manifestSource = s;
    void retally();
  });
  manifestsEl.appendChild(b);
});

void reseal();
