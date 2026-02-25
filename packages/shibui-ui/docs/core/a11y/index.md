# Accessibility (a11y) Utilities Documentation

This section documents the accessibility utilities located in `src/core/a11y.ts`.

## Philosophy

This module provides utility functions to help ensure accessibility for UI components. It includes helpers for generating unique IDs and retrieving ARIA attributes.

All functions here are pure TypeScript logic, with no direct DOM manipulation beyond reading attributes, and are framework-agnostic. This aligns with **Pillar 5: Accessibility (a11y): WAI-ARIA from the start.**

## Functions

### `generateUniqueId(prefix: string = 'lib-id-'): string`

*   **Description:** Generates a unique ID for a component or element. This is crucial for associating elements via ARIA attributes (e.g., `aria-labelledby`, `aria-describedby`) and for HTML forms.
*   **Parameters:**
    *   `prefix`: (Optional) A string prefix for the ID. Defaults to `lib-id-`.
*   **Returns:** A unique ID string (e.g., `lib-id-1`, `my-component-id-2`).

### `getAriaLabel(element: HTMLElement, defaultValue: string = ''): string`

*   **Description:** Retrieves the `aria-label` attribute from an `HTMLElement`. It provides a default fallback if `aria-label` is not explicitly set. This function is designed to be used with components that may not always have a visual label, ensuring a fallback for screen readers.
*   **Parameters:**
    *   `element`: The `HTMLElement` to check for `aria-label`.
    *   `defaultValue`: (Optional) A fallback string value to use if `aria-label` is not found. Defaults to an empty string.
*   **Returns:** The value of `aria-label` or the `defaultValue`.

