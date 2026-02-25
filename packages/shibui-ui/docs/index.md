# UI Library Documentation

Welcome to the UI Library documentation. This section provides detailed information about the project's architecture, technical pillars, components, core logic, styling conventions, and types.

## Structure

This documentation mirrors the `src/` folder structure to make it easy to find relevant information for each part of the codebase:

- [Components](./components/index.md): Documentation for individual UI components.
- [Core](./core/index.md): Explanations for core logic, utilities, and state management.
- [Styles](./styles/index.md): Details on styling conventions, design tokens, and CSS layers.
- [Types](./types/index.md): Global type definitions and interfaces.

## Technical Pillars (from README.md)

1.  **Strict TypeScript**: Typed code to prevent development errors.
2.  **Modern Native CSS**: Use of CSS Variables and Layers. Avoid heavy style dependencies.
3.  **Modular Architecture**: Focused on real tree-shaking (Zero-Bloat).
4.  **Hybrid Pattern**: Solid logic with an elegant, easy-to-customize base design.
5.  **Accessibility (a11y)**: WAI-ARIA from the start.

## Gold Rule (from README.md)

**Do not install external libraries without consultation.** Prioritize readability and clear documentation for less experienced developers.

## Properties vs. Internal State

Understanding the distinction between properties and internal state is crucial for building robust and predictable components in this UI library.

*   **Property (External Input):**
    *   **Definition:** An order or value that comes from the *outside* (parent component or consumer application).
    *   **Behavior:** The component *obeys* properties; it reacts to changes in properties but does not directly modify them.
    *   **Analogy:** Think of them as function parameters or configuration options.
    *   **Example:** `variant="primary"`, `disabled={true}`, `size="md"`.

*   **State (Internal Knowledge):**
    *   **Definition:** What the component *knows about itself* and manages internally. It's information that typically doesn't need to be dictated from the outside (though its initial value might come from a property).
    *   **Behavior:** The component *manages* its own internal state. It can change its state based on user interaction or internal logic.
    *   **Analogy:** Think of it as the component's private memory or internal variables.
    *   **Example:** Whether a dropdown is open or closed, the current step in a stepper, the internal value of a controlled input.

**Key Principle:**
Properties drive external configuration, while internal state drives a component's self-managed behavior. Strive to make components *controlled* by properties whenever possible to enhance predictability and reusability.
