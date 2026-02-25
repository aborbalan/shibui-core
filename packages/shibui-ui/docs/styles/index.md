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
-   `index.css`: Main entry point for styles, importing shared styles and setting up global layers.
