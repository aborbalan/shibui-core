import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Gallery } from '@components/gallery/gallery';
import {
  artist,
  artworks,
  education,
  experience,
  languages,
  software,
} from '@data/portfolio';

/**
 * Portfolio + CV de Sandra Ortega Arévalo — página independiente (ruta `/sandra`).
 * Smart component: inyecta los datos estáticos y los reparte. No comparte datos
 * ni layout con el CV de la home.
 */
@Component({
  selector: 'cv-portfolio',
  standalone: true,
  imports: [Gallery],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <lib-background variant="kaki-glow" class="bg">
      <main class="page">
        <!-- Hero -->
        <header class="intro">
          <div class="intro__text">
            <lib-display-heading
              tag="h1"
              size="lg"
              [line1]="artist.firstName"
              [accent]="artist.lastName"
            >
              <lib-eyebrow slot="eyebrow" tone="accent" size="lg">{{ artist.title }}</lib-eyebrow>
            </lib-display-heading>

            <p class="intro__tagline">{{ artist.tagline }}</p>
            <p class="intro__statement">{{ artist.statement }}</p>

            <nav class="intro__links" aria-label="Contacto">
              <a [href]="'mailto:' + artist.email">Email</a>
              @if (artist.instagram) {
                <a [href]="artist.instagram" target="_blank" rel="noopener noreferrer">Instagram</a>
              }
            </nav>
          </div>

          <figure class="intro__portrait">
            <img
              [src]="'portfolio/' + artist.photo"
              [alt]="artist.firstName + ' ' + artist.lastName + ', escultora, tallando'"
              loading="eager"
              decoding="async"
            />
          </figure>
        </header>

        <lib-divider></lib-divider>

        <!-- Obra -->
        <section class="work" aria-labelledby="obra-h">
          <header class="sh">
            <lib-eyebrow tone="accent" line="left" size="md">Obra</lib-eyebrow>
            <h2 id="obra-h" class="sh__title">Selección de obra</h2>
          </header>
          <cv-gallery [items]="artworks" />
        </section>

        <lib-divider></lib-divider>

        <!-- CV -->
        <section class="cv" aria-labelledby="cv-h">
          <header class="sh">
            <lib-eyebrow tone="accent" line="left" size="md">Trayectoria</lib-eyebrow>
            <h2 id="cv-h" class="sh__title">Currículum</h2>
          </header>

          <div class="cv__grid">
            <div class="cv__col">
              <h3 class="cv__label">Formación</h3>
              <ul class="cv__list">
                @for (e of education; track e.role) {
                  <li class="cv__item" [class.cv__item--hl]="e.highlight">
                    <div class="cv__head">
                      <span class="cv__role">{{ e.role }}</span>
                      <span class="cv__period">{{ e.period }}</span>
                    </div>
                    <span class="cv__place">{{ e.place }}</span>
                  </li>
                }
              </ul>
            </div>

            <div class="cv__col">
              <h3 class="cv__label">Experiencia</h3>
              <ul class="cv__list">
                @for (e of experience; track e.role) {
                  <li class="cv__item" [class.cv__item--hl]="e.highlight">
                    <div class="cv__head">
                      <span class="cv__role">{{ e.role }}</span>
                      <span class="cv__period">{{ e.period }}</span>
                    </div>
                    <span class="cv__place">{{ e.place }}</span>
                  </li>
                }
              </ul>
            </div>
          </div>

          <div class="cv__grid cv__grid--tight">
            <div class="cv__col">
              <h3 class="cv__label">Software</h3>
              <div class="cv__chips">
                @for (s of software; track s) {
                  <lib-chip color="default">{{ s }}</lib-chip>
                }
              </div>
            </div>

            <div class="cv__col">
              <h3 class="cv__label">Idiomas</h3>
              <ul class="cv__langs">
                @for (l of languages; track l.name) {
                  <li class="cv__lang">
                    <span class="cv__lang-name">{{ l.name }}</span>
                    <span class="cv__lang-level">{{ l.level }}</span>
                  </li>
                }
              </ul>
            </div>
          </div>
        </section>

        <footer class="page__foot">
          <span>© {{ year }} {{ artist.firstName }} {{ artist.lastName }}</span>
          <span>{{ artist.location }}</span>
        </footer>
      </main>
    </lib-background>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .bg {
        display: block;
        min-height: 100svh;
      }
      .page {
        max-width: 1040px;
        margin-inline: auto;
        padding-inline: var(--lib-space-lg, 24px);
        padding-block: var(--lib-space-xl, 32px);
      }

      .intro {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--lib-space-xl, 32px);
        align-items: center;
        padding-block: var(--lib-space-lg, 24px);
      }
      @media (min-width: 720px) {
        .intro {
          grid-template-columns: 1.4fr 1fr;
        }
      }
      .intro__text {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md, 16px);
      }
      .intro__tagline {
        margin: 0;
        max-width: 46ch;
        font-size: clamp(var(--text-md, 1.0625rem), 1rem + 1.2vw, var(--text-xl, 1.5rem));
        font-weight: var(--weight-light, 300);
        line-height: var(--leading-snug, 1.4);
        color: var(--text-secondary);
      }
      .intro__statement {
        margin: 0;
        max-width: 58ch;
        font-size: var(--text-base, 0.9375rem);
        line-height: var(--leading-relaxed, 1.7);
        color: var(--text-secondary);
      }
      .intro__links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-md, 16px) var(--lib-space-lg, 24px);
        margin-top: var(--lib-space-xs, 4px);
      }
      .intro__links a {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        text-decoration: none;
        text-underline-offset: 5px;
        color: var(--text-primary);
        padding: 4px 0 6px;
        transition: color 0.2s ease;
      }
      .intro__links a:hover {
        color: var(--text-accent);
        text-decoration: underline;
      }
      .intro__portrait {
        margin: 0;
        justify-self: center;
      }
      .intro__portrait img {
        display: block;
        width: 100%;
        max-width: 320px;
        aspect-ratio: 3 / 4;
        object-fit: cover;
        border-radius: var(--lib-radius-md, 8px);
        border: 1px solid var(--border-default, currentColor);
      }

      .sh {
        margin-bottom: var(--lib-space-lg, 24px);
      }
      .sh__title {
        margin: var(--lib-space-xs, 4px) 0 0;
        font-family: var(--lib-font-display, serif);
        font-weight: var(--weight-medium, 500);
        font-size: clamp(var(--text-2xl, 2rem), 1.5rem + 2.5vw, var(--text-3xl, 2.75rem));
        line-height: var(--leading-tight, 1.2);
        letter-spacing: var(--tracking-tight, -0.02em);
        color: var(--text-primary);
      }

      lib-divider {
        display: block;
        margin-block: var(--lib-space-xl, 32px);
      }

      .cv__grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--lib-space-xl, 32px);
      }
      @media (min-width: 640px) {
        .cv__grid {
          grid-template-columns: 1fr 1fr;
        }
      }
      .cv__grid--tight {
        margin-top: var(--lib-space-xl, 32px);
      }
      .cv__label {
        margin: 0 0 var(--lib-space-md, 16px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-accent);
      }
      .cv__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-lg, 24px);
      }
      .cv__item {
        padding-left: var(--lib-space-md, 16px);
        border-left: 2px solid var(--border-default, currentColor);
      }
      .cv__item--hl {
        border-left-color: var(--text-accent, currentColor);
      }
      .cv__head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px);
      }
      .cv__role {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-md, 1.0625rem);
        font-weight: var(--weight-medium, 500);
        color: var(--text-primary);
      }
      .cv__period {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        color: var(--text-muted);
      }
      .cv__place {
        font-size: var(--text-base, 0.9375rem);
        color: var(--text-secondary);
      }
      .cv__chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-xs, 4px) var(--lib-space-sm, 8px);
      }
      .cv__langs {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-lg, 24px) var(--lib-space-xl, 32px);
      }
      .cv__lang {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .cv__lang-name {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-md, 1.0625rem);
        color: var(--text-primary);
      }
      .cv__lang-level {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        color: var(--text-muted);
      }

      .page__foot {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px);
        margin-top: var(--lib-space-xl, 32px);
        padding-top: var(--lib-space-lg, 24px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        color: var(--text-muted);
      }
    `,
  ],
})
export class PortfolioPage {
  protected readonly artist = artist;
  protected readonly artworks = artworks;
  protected readonly education = education;
  protected readonly experience = experience;
  protected readonly software = software;
  protected readonly languages = languages;
  protected readonly year = new Date().getFullYear();

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    title.setTitle(`${artist.firstName} ${artist.lastName} — ${artist.title}`);
    meta.updateTag({ name: 'description', content: artist.tagline });
  }
}
