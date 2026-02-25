# Validators Documentation

This section documents the pure validation functions located in `src/core/validators/`.

## Philosophy

All validation logic should be pure functions that:
-   Take input and return validation results.
-   Have no side effects.
-   Are framework-agnostic.
-   Can be tested independently.

