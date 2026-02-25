# Types Documentation

This section covers the global type definitions, interfaces, and type utilities used throughout the library (`src/types/`).

## Philosophy

This folder contains global TypeScript interfaces and shared type definitions used across the library. These types are framework-agnostic and can be used throughout the entire library (core, components, etc.).

## Structure

-   `index.ts`: Main entry point for global type exports. Currently includes:
    *   `LibSize`: Defines standard component sizes (e.g., 'sm', 'md').
    *   `LibVariant`: Defines standard component variants/themes (e.g., 'primary', 'dark').
    *   `UiClickEventDetail`: Interface for custom click event details.
-   Other files: Will contain specific interfaces, types, or enums as needed.
