# shibui-ui design-sync notes

## Setup (reconstructed from pilot 2026-06-22)

### Why a sideEffects mirror is needed
Shibui's dist/ chunks are named `index55.js` etc. (Vite output). The `sideEffects` array
in package.json only covers the original source paths, not the renamed chunks. So esbuild
tree-shakes the `customElements.define()` calls → 0/102 custom elements registered.

**Fix:** mirror dist/ into `.ds-sync/shibui-pkg/` with `package.json {"sideEffects":true}`.
Point `--entry` at the mirror. This forces all define() calls to survive bundling.

NOTE: the mirror must have a `name` field in its package.json — otherwise the walk-up
from ENTRY_OVERRIDE to find PKG_DIR stops at wrong package.json (emits bad global/version/dts).

### Why the Lit render fork is needed
The default preview-gen compose() returns `st.render(args, ctx)` directly. For Lit stories
this is a TemplateResult — not JSX. React can't render it. The fork wraps it in a React FC
that uses `litRender(result, container)` via useRef + useLayoutEffect.

`import { render as litRender } from 'lit'` in the generated TSX bundles lit from
`packages/shibui-ui/node_modules/lit`. This is the SAME lit instance used by the stories
(`import { html } from 'lit'`), so TemplateResults are compatible.

### Why storyImports.shim:[".component"] is needed
Stories do `import './lib-button.component'` (side-effect only). esbuild would try to
compile the .ts file which uses Lit/TypeScript decorators that cause parse errors.
The shim redirects this to window.ShibuiUiUi (a no-op), since the bundle already registers
all custom elements via the sideEffects mirror.

### titleMap
100 entries: story title last segment (whitespace removed) → bundle export name.
General pattern: `XyzAbc` → `LibXyzAbc`.
Special cases:
- `AreaChart` → `LibLineChart` (area chart stories live in lib-line-chart)
- `Bubble` → `LibBubbleChart`, `Combo` → `LibComboChart`, `Funnel` → `LibFunnelChart`, `Radar` → `LibRadarChart`
- `Burger` → `LibBurger`, `ButtonLiquid` → `LibButtonLiquid`
- `CardGlass` → `LibGlassCard`, `CardSpotlight` → `LibSpotlightCard`
- `ColorPalette` → `LibColorScale`
- `ParallaxContainer` → `LibParallaxContainer`, `Stagger` → `LibStaggerContainer`
- `ScatterChart3D` → `LibScatterChart3d` (lowercase d)
- `ContentPillar` → `LibContentPillar`
- `Katachi·System` → null (documentation story, no component)

### Known overlay/portal components (cardMode: single)
LibDialog, LibDrawer, LibModal, LibTooltip

### Grid overflow / wide components (cardMode: column)
Data-driven charts and data-table are typically wider than one grid cell.
Run package-validate.mjs to see current [GRID_OVERFLOW] warnings after first build.

### Environment
- Run converter and compare from: `packages/shibui-ui/`
- node_modules: `packages/shibui-ui/node_modules`
- entry: `.ds-sync/shibui-pkg/index.js`
- storybook reference: `.design-sync/sb-reference/`
- TLS issue on this machine: use `--strict-ssl=false` in `.ds-sync/.npmrc` if npm fails

### Building the Storybook reference (sb-reference)

DO NOT run `npx storybook build -c .storybook -o .design-sync/sb-reference` — the main
`.storybook/` config includes `@storybook/addon-vitest`, which causes Storybook 10 to inject
`vite-inject-mocker-entry.js` into the build. esbuild can't transform some modern destructuring
patterns in that file to the `firefox78`/`safari14` targets. Error:
"Transforming destructuring to the configured target environment is not supported yet"

**Fix:** Use the reference config at `.storybook-ref/` which:
1. Excludes `@storybook/addon-vitest`
2. Adds a `viteFinal` hook that overrides `build.target` to `esnext`

```bash
# Run from packages/shibui-ui/
npx storybook build -c .storybook-ref -o .design-sync/sb-reference
```

The `.storybook-ref/` directory is in `.gitignore` (since it's design-sync tooling, not
part of the main project).

### Accepted warnings (non-blocking)

- `[FONT_MISSING]` "Shippori Mincho" (--lib-font-body) and "DM Mono" (--lib-font-mono): loaded
  from Google Fonts at runtime — no @font-face shipped, designs render with system font fallbacks.
  Intentional: no woff2 assets in the repo. To fix, add via cfg.extraFonts.

### Re-sync risks
- titleMap entries: verify against actual exports if shibui components are renamed
- Area Chart/Line Chart: both map to LibLineChart; if a separate LibAreaChart is added, update titleMap
- The overlay cardMode components: verify after any Dialog/Modal/Drawer/Tooltip API changes
- The sideEffects mirror needs regeneration after each shibui dist build
