import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { LanguageItem } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Idiomas — breve, escaneable. Nombre + nivel descriptivo.
 * Dumb component.
 */
@Component({
  selector: 'cv-languages',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="lang">
      <cv-section-heading title="Idiomas" />

      <ul class="lang__list">
        @for (item of items(); track item.name) {
          <li class="lang__item">
            <span class="lang__name">{{ item.name }}</span>
            <span class="lang__level">{{ item.level }}</span>
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
      .lang__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-xl, 32px);
      }
      .lang__item {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-xs, 4px);
      }
      .lang__name {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-md, 1.0625rem);
        font-weight: var(--weight-medium, 500);
        color: var(--text-primary);
      }
      .lang__level {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        color: var(--text-muted);
      }
    `,
  ],
})
export class Languages {
  readonly items = input.required<LanguageItem[]>();
}
