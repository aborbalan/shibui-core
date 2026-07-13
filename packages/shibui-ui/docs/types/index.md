# Types Documentation

This section covers the global type definitions, interfaces, and type utilities used throughout the library (`src/types/`).

## Philosophy

This folder contains global TypeScript interfaces and shared type definitions used across the library. These types are framework-agnostic and can be used throughout the entire library (core, components, etc.).

## Structure

-   `index.ts`: Main entry point for global type exports. Includes:
    *   `LibSize` = `'xs' | 'sm' | 'md' | 'lg' | 'xl'` — dimensional scale (+ `LibOverlaySize`, `LibAvatarSize`, `LibDisplaySize` extensions with `'full'` / `'2xl'`).
    *   `LibSemanticTone` / `LibTone` — semantic color/state (`LibTone = LibSemanticTone | 'muted'`).
    *   `LibVariant` = `'solid' | 'outlined' | 'ghost' | 'subtle'` — visual treatment. **Note:** the legacy `'primary' | 'dark'` hierarchy was migrated away (see `prop-migration-map.md`).
    *   `LibSurface` = `'default' | 'light' | 'dark' | 'inverse'`, `LibTint` = `'neutral' | 'warm' | 'cool' | 'inverse'`.
    *   `LibStatus`, `LibOrientation`, `LibShape` — structural axes.
    *   `UiClickEventDetail`: Interface for custom click event details.
-   See `props-contract.md` and `component-props-testing.md` for the full canonical contract.
