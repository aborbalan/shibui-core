# Multimodal Spacing System

We utilize a multimodal spacing system, offering both stable (relative) and dynamic (fluid) options. All spacing tokens are prefixed with `--lib-` to prevent conflicts.

### 1. Stable Mode (`rem` - PRIMARY and RECOMMENDED)

*   **Description:** This system uses `rem` units, which are relative to the base font size of the `<html>` element (typically 16px by default in browsers). It is designed for optimal accessibility, allowing the entire UI to scale when users adjust their browser's font size settings.
*   **Mental Model:** Think in multiples of 4 pixels (e.g., a mental grid of 4px). For example, `--lib-space-xs` (which is `0.25rem`) represents `4px` when the base font size is 16px.
*   **Benefits:** Enhanced accessibility, better responsiveness, consistency with typography scaling, and predictable behavior.
*   **Usage:** Prefer this scale for most padding, margin, gap, and fixed sizing values.
*   **Activation:** This mode is active by default on `:root` and can be explicitly applied using `[data-scale="stable"]`.
*   **Example Tokens:**
    ```css
    --lib-spacing-base: 0.25rem; /* 4px */
    --lib-space-xs: var(--lib-spacing-base);
    --lib-space-sm: calc(var(--lib-spacing-base) * 2); /* 8px */
    --lib-space-md: calc(var(--lib-spacing-base) * 4); /* 16px */
    --lib-space-lg: calc(var(--lib-spacing-base) * 6); /* 24px */
    --lib-space-xl: calc(var(--lib-spacing-base) * 8); /* 32px */
    ```

### 2. Dynamic Mode (Fluid Spacing - Use with CAUTION)

*   **Description:** This system uses `clamp()` to create fluid spacing values that adapt to the viewport width. It allows for more responsive designs where spacing scales smoothly between a minimum and maximum value.
*   **Mental Model:** Spacing values adjust dynamically based on screen size, providing a fluid feel.
*   **Benefits:** Highly responsive designs, reduces the need for numerous media queries for spacing.
*   **Usage:** Reserve for specific components or layouts where a fluid, viewport-dependent spacing is explicitly desired and beneficial for the user experience. Use with caution to avoid unexpected layout shifts.
*   **Activation:** Apply using the `[data-scale="dynamic"]` attribute on a parent element.
*   **Example Tokens:**
    ```css
    --lib-space-md: clamp(0.75rem, 1.5vw + 0.25rem, 1.25rem); /* Ranges from 12px to 20px */
    --lib-space-lg: clamp(1.25rem, 3vw + 0.5rem, 2.5rem);   /* Ranges from 20px to 40px */
    --lib-space-xl: clamp(2rem, 5vw, 4rem);                 /* Ranges from 32px to 64px */
    ```

**Recommendation:**
Always prioritize the **Stable Mode (`rem`)** spacing scale to adhere to the accessibility pillar of the project and ensure predictable behavior. Use the **Dynamic Mode (`fluid`)** only when there is a strong, justified design reason for fluid scaling that enhances the user experience, and ensure thorough testing across various screen sizes. Clearly document where dynamic spacing is applied.
