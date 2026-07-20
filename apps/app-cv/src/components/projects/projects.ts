import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ProjectItem } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Proyectos — trabajo propio del ecosistema Shibui. Vitrina de diseño:
 * usa lib-card (slots tag/title/footer + kanji watermark) y lib-chip.
 * Cada card enlaza a su demo en vivo y/o a su subcarpeta del monorepo.
 * Dumb component.
 */
@Component({
  selector: 'cv-projects',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="pr">
      <cv-section-heading title="Proyectos" />

      <div class="pr__grid">
        @for (p of items(); track p.name) {
          <lib-card
            class="pr__card"
            [attr.variant]="p.highlight ? 'featured' : 'solid'"
            [attr.kanji]="p.kanji ?? null"
          >
            <span slot="tag">{{ p.tag }}</span>
            <h3 slot="title" class="pr__name">{{ p.name }}</h3>

            <p class="pr__desc">{{ p.description }}</p>
            <div class="pr__chips">
              @for (s of p.stack; track s) {
                <lib-chip color="default">{{ s }}</lib-chip>
              }
            </div>

            @if (p.demo || p.code) {
              <div slot="footer" class="pr__links">
                @if (p.demo) {
                  <a class="mono-link" [href]="p.demo" target="_blank" rel="noopener noreferrer"
                    >Demo ↗</a
                  >
                }
                @if (p.code) {
                  <a class="mono-link" [href]="p.code" target="_blank" rel="noopener noreferrer"
                    >Código ↗</a
                  >
                }
              </div>
            }
          </lib-card>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pr__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--lib-space-lg, 24px);
      }
      .pr__card {
        display: block;
        height: 100%;
      }
      .pr__name {
        margin: 0;
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-lg, 1.25rem);
        font-weight: var(--weight-medium, 500);
        color: var(--text-primary);
      }
      .pr__desc {
        margin: 0 0 var(--lib-space-md, 16px);
        font-size: var(--text-base, 0.9375rem);
        line-height: var(--leading-relaxed, 1.7);
        color: var(--text-secondary);
      }
      .pr__chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-xs, 4px) var(--lib-space-sm, 8px);
      }
      .pr__links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-lg, 24px);
      }
      /* Los enlaces usan .mono-link global; aquí solo el layout del footer. */
    `,
  ],
})
export class Projects {
  readonly items = input.required<ProjectItem[]>();
}
