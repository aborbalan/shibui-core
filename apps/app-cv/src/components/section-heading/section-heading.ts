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
      @if (kanji()) {
        <span class="sh__kanji" aria-hidden="true">{{ kanji() }}</span>
      }
      <div class="sh__eyebrow">
        @if (index()) {
          <span class="sh__index">{{ index() }}</span>
        }
        <lib-eyebrow tone="accent" line="left" size="md">{{ kicker() || title() }}</lib-eyebrow>
      </div>
      <h2 class="sh__title">{{ title() }}</h2>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sh {
        position: relative;
        margin-bottom: var(--lib-space-lg, 24px);
      }
      /* Kanji watermark de sección: grande, tenue, detrás del título. */
      .sh__kanji {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        z-index: 0;
        font-family: 'Shippori Mincho', var(--lib-font-body, serif);
        font-size: clamp(5rem, 12vw, 9rem);
        line-height: 1;
        color: var(--text-accent, currentColor);
        opacity: 0.05;
        pointer-events: none;
        user-select: none;
      }
      .sh__eyebrow {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: baseline;
        gap: var(--lib-space-md, 16px);
      }
      /* Número editorial de sección (01, 02…). */
      .sh__index {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        color: var(--text-muted);
      }
      .sh__title {
        position: relative;
        z-index: 1;
        margin: var(--lib-space-xs, 4px) 0 0;
        font-family: var(--lib-font-display, serif);
        font-weight: var(--weight-medium, 500);
        /* fluido: ~32px en móvil → 44px en desktop */
        font-size: clamp(var(--text-2xl, 2rem), 1.5rem + 2.5vw, var(--text-3xl, 2.75rem));
        line-height: var(--leading-tight, 1.2);
        letter-spacing: var(--tracking-tight, -0.02em);
        color: var(--text-primary);
      }
      /* El watermark decorativo no imprime. */
      @media print {
        .sh__kanji {
          display: none;
        }
      }
    `,
  ],
})
export class SectionHeading {
  readonly title = input.required<string>();
  /** Texto del eyebrow; por defecto el propio título */
  readonly kicker = input<string>('');
  /** Número editorial de sección: '01', '02'… (opcional) */
  readonly index = input<string>('');
  /** Kanji watermark de la sección (opcional) */
  readonly kanji = input<string>('');
}
