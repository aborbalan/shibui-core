# Components Documentation

This section contains detailed documentation for each UI component in the library.

## Component Organization: Atomic Design Principles

We organize components following **Atomic Design**, a methodology that helps build robust, scalable, and maintainable component libraries by breaking the UI into hierarchical parts. This approach creates a clear system where smaller pieces combine to form increasingly complex interfaces.

### The Atomic Design Hierarchy

#### Atoms

**The fundamental building blocks of the interface.**

Atoms are the smallest, indivisible UI elements that cannot be broken down further without losing their meaning. They are the basic HTML elements styled and encapsulated as reusable components.

**Characteristics:**
- Completely independent and self-contained
- No dependencies on other components
- Purely presentational
- Highly reusable across different contexts
- Stateless components that depend entirely on external properties
- Do not manage any internal state
- Focused on rendering UI based on input

**Available Atoms:**
- Avatar
- Badge
- Button
- Card
- Checkbox
- Close Button
- Copy Button
- Glass Card
- Icon
- Kbd
- Label
- Lib Panel
- Select Option
- Skeleton
- Spinner
- Status Dot
- Switch
- Text List

---

#### Molecules

**Simple functional groups formed by combining atoms.**

Molecules are relatively simple UI components that combine two or more atoms to create a functional unit. They serve a single, well-defined purpose and represent the first level of composition in the design system.

**Characteristics:**
- Composed of multiple atoms working together
- Perform a specific, cohesive function
- More contextual than atoms but still reusable
- Often represent common UI patterns
- Manage their own internal state related to user interaction
- Encapsulate user interactions
- Emit events when internal state leads to meaningful actions

**Available Molecules:**
- Breadcrumb
- Button Group
- Form Field
- Input
- Lib Alert
- Modal
- Multiselect
- Profile Card
- Select
- Tabs

---

#### Organisms

**Complex, standalone interface sections.**

Organisms are relatively complex UI components formed by combining molecules and/or atoms. They represent distinct, self-contained sections of an interface and often function like "mini-applications" with their own internal logic and state management.

**Characteristics:**
- Composed of groups of molecules and atoms
- Form distinct sections of the interface
- Can manage complex internal state and logic
- More specific to particular contexts
- Often reusable across similar use cases
- Handle both user input data (via properties) and internal validation/interaction states
- Combine external properties with extensive internal state

**Available Organisms:**
- Dialog
- Lib Auth Form
- Lib List
- Sidebar

---

## Component Structure

Each component typically resides in its own folder within `src/components/`, organized by its atomic level:

```
src/components/
├── atoms/
│   ├── avatar/
│   ├── badge/
│   ├── button/
│   ├── card/
│   ├── checkbox/
│   ├── close-button/
│   ├── copy-button/
│   ├── glass-card/
│   ├── icon/
│   ├── kbd/
│   ├── label/
│   ├── lib-panel/
│   ├── select-option/
│   ├── skeleton/
│   ├── spinner/
│   ├── status-dot/
│   ├── switch/
│   └── text-list/
├── molecules/
│   ├── breadcrumb/
│   ├── button-group/
│   ├── form-field/
│   ├── input/
│   ├── lib-alert/
│   ├── modal/
│   ├── multiselect/
│   ├── profile-card/
│   ├── select/
│   └── tabs/
└── organisms/
    ├── dialog/
    ├── lib-auth-form/
    ├── lib-list/
    └── sidebar/
```

### Component File Structure

Each component folder should include:
- **Definition file** (`.component.ts`) - Component class and logic
- **Template** (`.html.ts`) - HTML template structure
- **Style** (`.css`) - Component styles
- **Storybook story** (`.stories.ts`) - Documentation and examples

---

## Technical Standards and Code Quality

### Technical Architecture

**Encapsulation:**
- Strict use of **Shadow DOM** to avoid style collisions
- Ensures component isolation and style scoping

**Styles:**
- Implementation via external CSS files imported as `?inline`
- Modular and maintainable styling approach

**Strict Typing:**
- Prohibition of `any` type in TypeScript
- Use specific Lit types:
  - `PropertyValues<this>` for the `updated` lifecycle method
  - `TemplateResult` for the `render` method

### Iconography System

**Source:** [Phosphor Icons](https://phosphoricons.com/) (Regular style)

**Integration:**
- Centralized registry in `icon-registry.ts`
- Static imports with `?raw` suffix to inject SVG directly
- Ensures consistent icon usage across components

**Usage Example:**
```typescript
<lib-icon .name="chevron-down"></lib-icon>
<lib-icon .name="user"></lib-icon>
<lib-icon .name="settings"></lib-icon>
```

### Documentation (Storybook)

**Autodocs:**
- Mandatory configuration of `tags: ['autodocs']` to automatically generate API tables
- Ensures consistent documentation across all components

**Gallery:**
- Icons should be documented in a Grid layout for easy visual inspection
- Visual examples for different component states and variations

---

## Benefits of Atomic Design

**Consistency:** Using the same atoms and molecules across the application ensures visual and functional consistency.

**Reusability:** Smaller components can be combined in multiple ways, reducing code duplication.

**Scalability:** New features can be built by combining existing components rather than creating everything from scratch.

**Maintainability:** Changes to atoms automatically propagate to all molecules and organisms that use them.

**Testability:** Small, focused components are easier to test in isolation.

**Documentation:** The hierarchical structure makes it easier to document and understand the component system.

---

## Component Documentation Standards

Each component's documentation should cover:

- **Purpose:** What the component does and when to use it
- **Usage:** Code examples for different frameworks (Vanilla JS, React, Vue, Angular)
- **Props/Attributes:** Available properties/attributes, their types, default values, and descriptions
- **Events:** Custom events the component dispatches
- **Styling:** How to customize appearance using CSS Variables or other styling methods
- **Accessibility:** Specific accessibility considerations and best practices
- **Dependencies:** Any internal or external dependencies
- **Examples:** Visual examples demonstrating different states and variations

---

## Component Categories by Data Flow

### Stateless Components (Atoms)
Components that depend entirely on external properties for their behavior and appearance.

**Characteristics:**
- Receive data via properties
- Do not remember anything internally (no internal state)
- Primarily focused on rendering UI based on input
- All atoms in this library are stateless

### Components with Internal State (Molecules / Organisms)
Components that manage their own internal state, typically related to user interaction.

**Characteristics:**
- Encapsulate user interactions
- Manage specific internal behaviors (e.g., open/closed status)
- Emit events when their internal state leads to a meaningful action
- Common in interactive molecules and organisms

### Hybrid Components (Molecules / Organisms)
Components that handle both user input data (controlled by properties) and internal validation/interaction states.

**Characteristics:**
- Can receive an initial or controlled `value` via properties
- Manage internal state such as `touched`, `isValid`, or temporary input values
- Often found in form elements
- Combine external control with internal state management