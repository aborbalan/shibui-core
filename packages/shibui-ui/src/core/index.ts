/**
 * Core - The Brain
 *
 * This folder contains pure TypeScript logic with NO dependencies on:
 * - DOM APIs
 * - HTML
 * - CSS
 * - Lit or any UI framework
 *
 * Contents:
 * - Pure functions
 * - Validations
 * - State management logic
 * - Business logic
 * - Utilities
 *
 * Philosophy:
 * This code should work independently of any UI framework.
 * If we decide to remove Lit in the future, this code will continue to function.
 *
 * Structure:
 * - a11y/          - Accessibility utilities (ID generation, ARIA helpers)
 * - validators/    - Validation functions
 * - state/         - State management logic
 * - utils/         - Pure utility functions
 * - types/         - Core type definitions (if not in src/types)
 */

// Core exports will be added here
export { generateUniqueId, getAriaLabel } from './a11y';
