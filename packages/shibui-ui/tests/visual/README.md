# Visual regression tests

Snapshot-based regression suite for the **Katachi (形)** aesthetic context system. The fixture under `katachi.html` renders a 3×2 grid of tiles, each scoped to a `data-katachi="x"` block, so a single page covers all 6 contexts.

The fixture loads `dist/tokens.css` (the compiled artifact, not the source partials). This catches drift between the source tree and what consumers actually receive — including the `_katachi.css` partial reaching the bundle and computing OKLCH correctly across browsers.

## Running

The fixture depends on a built `dist/tokens.css`. From the package root:

```bash
pnpm build:shibui        # produces dist/tokens.css
pnpm test:visual         # runs the suite
```

First run on a fresh checkout (no baselines yet):

```bash
pnpm test:visual:update  # generates baselines under tests/visual/<spec>.<browser>/
```

Re-running after intentional visual changes:

```bash
pnpm test:visual:update  # overwrites baselines
git add tests/visual/**/*.png
```

## What gets snapshotted

| Snapshot | Scope |
|----------|-------|
| `katachi-wabi.png` … `katachi-celadon.png` | One per katachi, scoped to the tile element |
| `katachi-grid.png` | Full-page screenshot of all 6 tiles in a 3×2 grid |

Each tile screenshot is taken at the natural tile size (no viewport override). The grid screenshot uses 1280×920 to keep the layout stable across runs.

## Sanity assertion

Before snapshotting, each tile asserts:

```ts
getComputedStyle(tile).getPropertyValue('--katachi-id')  // → matches katachi id
```

If this fails, `dist/tokens.css` did not actually propagate the katachi bridge tokens — investigate the build before chasing pixel diffs.

## Browsers

The Playwright config runs three projects (chromium · firefox · webkit). Baselines are stored per-browser. A single katachi visual change therefore produces 3 baseline files per snapshot, 21 baselines total (7 snapshots × 3 browsers).

## What this does NOT cover

- **Component-level rendering** — these tests assert that the *tokens* propagate correctly. They do not exercise any `lib-*` web component. Component-level visual regression should live alongside its component or as a Storybook-based suite.
- **Effect compatibility** — glass blur, backdrop filters and other GPU-dependent effects are intentionally absent from the fixture to keep diffs stable across machines. The grid uses solid surfaces only.
- **Dark mode interaction** — `data-theme="dark"` and `data-katachi="x"` coexistence is asserted manually in `KATACHI.md`. A dedicated test could be added later.

## Updating baselines

Baselines change when:

- `_katachi.css` is edited (intentional palette/effect tweak)
- `tokens.css` reorders or removes a partial
- The fixture HTML changes (rare — keep it stable)

In any of those cases, run `pnpm test:visual:update`, eyeball the diff, and commit the new PNGs. Reviewers can pull the branch and re-run the suite to verify the diff matches the described intent.
