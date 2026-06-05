import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { Profile } from '@data/cv';

/**
 * Above the fold: nombre + título + tagline + 3 links. Nada más.
 * Dumb component.
 */
@Component({
  selector: 'cv-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="hero">
      <lib-display-heading
        tag="h1"
        size="lg"
        [line1]="profile().firstName"
        [accent]="profile().lastName"
      >
        <lib-eyebrow slot="eyebrow" tone="accent" size="lg">{{ profile().title }}</lib-eyebrow>
      </lib-display-heading>

      <p class="hero__tagline">{{ profile().tagline }}</p>

      <nav class="hero__links" aria-label="Contacto">
        <a [href]="profile().github" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a [href]="profile().linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a [href]="'mailto:' + profile().email">Email</a>
      </nav>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .hero {
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: var(--lib-space-lg, 24px);
        padding-block: var(--lib-space-xl, 32px);
      }
      .hero__tagline {
        margin: 0;
        max-width: 46ch;
        /* fluido: ~17px en móvil → 24px en desktop */
        font-size: clamp(var(--text-md, 1.0625rem), 1rem + 1.2vw, var(--text-xl, 1.5rem));
        font-weight: var(--weight-light, 300);
        line-height: var(--leading-snug, 1.4);
        color: var(--text-secondary);
        overflow-wrap: anywhere;
      }
      .hero__links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-md, 16px) var(--lib-space-lg, 24px);
        margin-top: var(--lib-space-sm, 8px);
      }
      .hero__links a {
        position: relative;
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        text-decoration: none;
        color: var(--text-primary);
        /* tap target cómodo en móvil */
        padding: 4px 0 6px;
        transition: color 0.2s ease;
      }
      .hero__links a::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: var(--text-accent, currentColor);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      .hero__links a:hover {
        color: var(--text-accent);
      }
      .hero__links a:hover::after {
        transform: scaleX(1);
      }
    `,
  ],
})
export class Hero {
  readonly profile = input.required<Profile>();
}
