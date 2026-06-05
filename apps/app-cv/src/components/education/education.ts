import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { EducationItem } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Educación — breve, al final. Solo lo relevante.
 * Dumb component.
 */
@Component({
  selector: 'cv-education',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="ed">
      <cv-section-heading title="Educación" />

      <ul class="ed__list">
        @for (item of items(); track item.title) {
          <li class="ed__item">
            <div class="ed__head">
              <h3 class="ed__title">{{ item.title }}</h3>
              <span class="ed__period">{{ item.period }}</span>
            </div>
            <span class="ed__place">{{ item.place }}</span>
          </li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .ed__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-lg, 24px);
      }
      .ed__head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px);
      }
      .ed__title {
        margin: 0;
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-md, 1.0625rem);
        font-weight: var(--weight-medium, 500);
        color: var(--text-primary);
      }
      .ed__period {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        color: var(--text-muted);
      }
      .ed__place {
        font-size: var(--text-base, 0.9375rem);
        color: var(--text-secondary);
      }
    `,
  ],
})
export class Education {
  readonly items = input.required<EducationItem[]>();
}
