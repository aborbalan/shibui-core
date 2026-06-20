import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';

/**
 * Cabecera de sección reutilizable: eyebrow kaki + título.
 * Dumb component — solo recibe inputs.
 */
@Component({
  selector: 'cv-section-heading',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <header class="sh">
      <lib-eyebrow tone="accent" line="left" size="md">{{ kicker() || title() }}</lib-eyebrow>
      <h2 class="sh__title">{{ title() }}</h2>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sh {
        margin-bottom: var(--lib-space-lg, 24px);
      }
      .sh__title {
        margin: var(--lib-space-xs, 4px) 0 0;
        font-family: var(--lib-font-display, serif);
        font-weight: var(--weight-medium, 500);
        /* fluido: ~32px en móvil → 44px en desktop */
        font-size: clamp(var(--text-2xl, 2rem), 1.5rem + 2.5vw, var(--text-3xl, 2.75rem));
        line-height: var(--leading-tight, 1.2);
        letter-spacing: var(--tracking-tight, -0.02em);
        color: var(--text-primary);
      }
    `,
  ],
})
export class SectionHeading {
  readonly title = input.required<string>();
  /** Texto del eyebrow; por defecto el propio título */
  readonly kicker = input<string>('');
}
