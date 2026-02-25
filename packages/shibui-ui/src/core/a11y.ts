/**
 * Accessibility (a11y) Utilities - Pillar 5
 *
 * This module provides utility functions to help ensure accessibility
 * for UI components. It includes helpers for generating unique IDs
 * and retrieving ARIA attributes.
 *
 * All functions here are pure TypeScript logic, with no direct DOM manipulation
 * beyond reading attributes, and are framework-agnostic.
 */

let uniqueIdCounter = 0;

/**
 * Generates a unique ID for a component or element.
 * Useful for associating elements via ARIA attributes (e.g., `aria-labelledby`, `aria-describedby`).
 * @param prefix An optional prefix for the ID. Defaults to 'lib-id-'.
 * @returns A unique ID string.
 */
export function generateUniqueId(prefix: string = 'lib-id-'): string {
  uniqueIdCounter++;
  return `${prefix}${uniqueIdCounter}`;
}

/**
 * Retrieves the `aria-label` attribute from an HTMLElement.
 * Provides a default fallback if `aria-label` is not explicitly set.
 * This function is meant to be used in conjunction with components that may not always have a visual label.
 * @param element The HTMLElement to check for `aria-label`.
 * @param defaultValue A fallback value to use if `aria-label` is not found.
 * @returns The value of `aria-label` or the `defaultValue`.
 */
export function getAriaLabel(element: HTMLElement, defaultValue: string = ''): string {
  return element.getAttribute('aria-label') || defaultValue;
}
