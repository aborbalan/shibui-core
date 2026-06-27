// Genera docs/contrast-report.html: recorre varios motivos × covers, teje con
// kasaneMultiCoverWeave (F6) y vuelca la métrica de contraste/fidelidad a HTML.
//
//   pnpm --filter @shibui-ui/sukashi report
//
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { makeBitmap, setPixel, type Bitmap } from '../src/core/bitmap';
import { kasaneMultiCoverWeave } from '../src/core/multicover';
import { seeded } from '../src/core/rng';
import { seigaiha } from '../src/pattern/seigaiha';
import { asanoha } from '../src/pattern/asanoha';
import { sashiko } from '../src/pattern/sashiko';
import { moire } from '../src/pattern/moire';
import { renderContrastReport, type ContrastReportEntry } from '../src/render/report';

const N = 28;

function diamond(t: number): Bitmap {
  const m = makeBitmap(N, N);
  const c = (N - 1) / 2;
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++)
      if (Math.abs(x - c) + Math.abs(y - c) < N * t) setPixel(m, x, y, 1);
  return m;
}

function ring(): Bitmap {
  const m = makeBitmap(N, N);
  const c = (N - 1) / 2;
  for (let y = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const r = Math.hypot(x - c, y - c);
      if (r < N * 0.42 && r > N * 0.26) setPixel(m, x, y, 1);
    }
  return m;
}

const S = N * 2;
const small = diamond(0.28);
const big = diamond(0.5);
const anillo = ring();

const cases: ContrastReportEntry[] = [];

function run(
  title: string,
  coverLabel: string,
  motifs: Bitmap[],
  cover: Parameters<typeof kasaneMultiCoverWeave>[1]['cover'],
  opts: Partial<Parameters<typeof kasaneMultiCoverWeave>[1]> = {},
): void {
  const { metric, fellBack } = kasaneMultiCoverWeave(motifs, {
    cover,
    rng: seeded(42),
    ...opts,
  });
  cases.push({ title, cover: coverLabel, metric, fellBack });
}

run('rombo · seigaiha (cover único)', 'seigaiha', [small], seigaiha({ width: S, height: S, scale: 10 }));

run('rombo × anillo · seigaiha', 'seigaiha (pivote+2)', [small, anillo], seigaiha({ width: S, height: S, scale: 10 }));

run('rombo × anillo · covers distintos', 'seigaiha + asanoha + sashiko', [small, anillo], {
  pivot: seigaiha({ width: S, height: S, scale: 10, seed: 0 }),
  petals: [asanoha({ width: S, height: S, scale: 12, seed: 1 }), sashiko({ width: S, height: S, scale: 9, seed: 2 })],
});

run('rombo grande × anillo · moiré', 'moire', [big, anillo], moire({ width: S, height: S, scale: 8 }));

run('umbral de fidelidad exigente (aviso)', 'seigaiha', [small, anillo], seigaiha({ width: S, height: S, scale: 10 }), {
  minFidelity: 0.95,
});

run('umbral inalcanzable → fallback a ruido', 'seigaiha', [small, anillo], seigaiha({ width: S, height: S, scale: 10 }), {
  minFidelity: 0.99,
  fallback: true,
});

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../docs/contrast-report.html');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, renderContrastReport(cases), 'utf8');
console.log(`contrast-report → ${out} (${cases.length} casos)`);
