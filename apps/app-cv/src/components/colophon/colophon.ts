import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { EducationItem, LanguageItem, Profile, REPO } from '@data/cv';

/**
 * Colofón: banda final compacta que fusiona educación, idiomas, ubicación
 * y la firma del sitio. Deliberadamente sin cabecera ceremonial — es pie
 * de página, no una sección más del portfolio. Dumb component.
 */
@Component({
  selector: 'cv-colophon',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <footer class="col">
      <div class="col__grid">
        <section class="col__block" aria-label="Educación">
          <lib-eyebrow tone="neutral" line="none" size="sm">Educación</lib-eyebrow>
          <ul class="col__list">
            @for (item of education(); track item.title) {
              <li class="col__item">
                <span class="col__name">{{ item.title }}</span>
                <span class="col__meta">{{ item.place }} · {{ item.period }}</span>
              </li>
            }
          </ul>
        </section>

        <section class="col__block" aria-label="Idiomas y ubicación">
          <lib-eyebrow tone="neutral" line="none" size="sm">Idiomas</lib-eyebrow>
          <ul class="col__list">
            @for (item of languages(); track item.name) {
              <li class="col__item">
                <span class="col__name">{{ item.name }}</span>
                <span class="col__meta">{{ item.level }}</span>
              </li>
            }
          </ul>
          <lib-eyebrow tone="neutral" line="none" size="sm">Ubicación</lib-eyebrow>
          <p class="col__loc">{{ profile().location }}</p>
        </section>
      </div>

      <div class="col__foot">
        <span class="col__meta">
          © {{ year }} {{ profile().firstName }} {{ profile().lastName }}
        </span>
        <a class="mono-link" [href]="codeUrl" target="_blank" rel="noopener noreferrer">
          Construido con &#64;shibui-ui/ui — ver código ↗
        </a>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .col__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--lib-space-xl, 32px);
      }
      .col__block {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md, 16px);
      }
      .col__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 8px);
      }
      .col__item {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .col__name {
        font-size: var(--text-base, 0.9375rem);
        font-weight: var(--weight-medium, 500);
        color: var(--text-primary);
      }
      .col__meta {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        color: var(--text-muted);
      }
      .col__loc {
        margin: 0;
        font-size: var(--text-base, 0.9375rem);
        color: var(--text-secondary);
      }
      .col__foot {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px) var(--lib-space-lg, 24px);
        margin-top: var(--lib-space-xl, 32px);
        padding-top: var(--lib-space-lg, 24px);
        border-top: 1px solid var(--border-default, currentColor);
      }
    `,
  ],
})
export class Colophon {
  readonly education = input.required<EducationItem[]>();
  readonly languages = input.required<LanguageItem[]>();
  readonly profile = input.required<Profile>();

  protected readonly year = new Date().getFullYear();
  /** Deep-link a la propia app dentro del monorepo público. */
  protected readonly codeUrl = `${REPO}/apps/app-cv`;
}
