# Styles Documentation

This section details the styling conventions, design tokens, and CSS layers used in the `src/styles/` directory.

## Philosophy

Pillar 2: Modern Native CSS - Use of CSS Variables and Layers. Avoid heavy style dependencies.

### Color Management with OKLCH

We utilize the `oklch()` color function for our design tokens. This modern approach provides:
-   Perceptually uniform colors, making color adjustments more intuitive.
-   Easier creation of light and dark themes by simply adjusting the `l` (lightness) channel.
-   Wider color gamut for richer, more vibrant colors.

## Structure

-   [Shared Styles](./shared/index.md): Contains global design tokens (prefixed with `--lib-`) and common utilities.
    *   [Spacing Scales](./spacing.md): Detailed explanation of the multimodal `rem` and `clamp()` spacing scales, including variable prefixes and usage guidelines.
-   [Katachi (形) — Migration Guide](./katachi-migration.md): How to opt into the aesthetic-context system from consumer apps (React / Angular / Svelte / plain HTML).
-   [CSS Nesting nativo](./css-nesting.md): Convenciones, patrones canónicos y hoja de progreso para la migración a CSS nesting en los componentes.
-   [lib-background — capa de calidad](./background-quality-layer.md): Técnica anti-tiling (motivos no tileables con `cover`) + capa de acabado compartida `--bg-*` (grano fino + viñeta) de la que tiran todos los fondos.
-   `index.css`: Main entry point for styles, importing shared styles and setting up global layers.
