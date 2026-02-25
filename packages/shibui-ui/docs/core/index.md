# Core Documentation

This section explains the core logic, utilities, and state management within the `src/core/` directory.

## Philosophy

The `core/` folder contains pure TypeScript logic with NO dependencies on:
-   DOM APIs
-   HTML
-   CSS
-   Lit or any UI framework

This code is designed to work independently of any UI framework. If we decide to remove Lit in the future, this code will continue to function.

For a general understanding of component data flow, refer to [Properties vs. Internal State](../../index.md#properties-vs-internal-state).

## Structure

-   [A11y](./a11y/index.md): Accessibility utilities (ID generation, ARIA helpers).
-   [Validators](./validators/index.md): Pure validation functions.
-   [State](./state/index.md): State management logic.
-   [Utils](./utils/index.md): Pure utility functions.

