import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { SkillGroup } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Stack agrupado y escaneable: Core / Tooling / Familiar.
 * Dumb component.
 */
@Component({
  selector: 'cv-skills',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="sk">
      <cv-section-heading title="Stack" />

      <div class="sk__grid">
        @for (group of groups(); track group.label) {
          <div class="sk__group">
            <lib-eyebrow tone="neutral" line="none" size="sm">{{ group.label }}</lib-eyebrow>
            <div class="sk__chips">
              @for (item of group.items; track item) {
                <lib-chip [color]="group.primary ? 'accent' : 'default'">{{ item }}</lib-chip>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .sk__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: var(--lib-space-xl, 32px);
      }
      .sk__group {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-md, 16px);
      }
      .sk__chips {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-sm, 8px);
      }
    `,
  ],
})
export class Skills {
  readonly groups = input.required<SkillGroup[]>();
}
