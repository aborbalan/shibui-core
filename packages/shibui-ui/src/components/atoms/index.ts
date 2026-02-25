/**
 * Atoms - Smallest UI Elements (Dumb / Presentational)
 *
 * This folder contains the fundamental building blocks of the UI.
 * Atoms are strictly **Stateless Components** and represent single HTML elements
 * or very simple UI elements that cannot be broken down further without losing their meaning.
 *
 * **Key Characteristics:**
 * - **100% Presentational:** Do not manage any internal state (`@state` or `@property`).
 * - **Data Input:** Receive all data from parent components via attributes/properties.
 * - **Event Output:** Communicate actions by emitting custom events.
 * - **Examples:** Button, Input (simple, uncontrolled), Icon, Spinner, Badge.
 */

// Atom exports will be added here
export { LibButton } from './button/lib-button.component.js';
export { LibSpinner } from './spinner/lib-spinner.component.js';
export const _placeholder = true;
