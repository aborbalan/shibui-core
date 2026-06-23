import { Component, CUSTOM_ELEMENTS_SCHEMA, input, signal } from '@angular/core';
import { SkillGroup } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Stack agrupado y escaneable (Core / Styling / Tooling / Familiar).
 * La columna principal va curada; el stack exhaustivo se muestra bajo
 * demanda en un lib-drawer («Ver stack completo») para no recargar.
 * Dumb component con estado de UI local (apertura del drawer).
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

      @if (fullStack().length) {
        <button
          type="button"
          class="sk__more no-print"
          [attr.aria-expanded]="open()"
          (click)="open.set(true)"
        >
          Ver stack completo →
        </button>

        <lib-drawer
          placement="right"
          size="md"
          label="Stack completo"
          eyebrow="Tecnologías"
          drawer-label="Stack técnico completo"
          [open]="open()"
          (ui-lib-drawer-close)="open.set(false)"
        >
          <div class="sk__full">
            @for (group of fullStack(); track group.label) {
              <div class="sk__group">
                <lib-eyebrow tone="neutral" line="none" size="sm">{{ group.label }}</lib-eyebrow>
                <div class="sk__chips">
                  @for (item of group.items; track item) {
                    <lib-chip color="default">{{ item }}</lib-chip>
                  }
                </div>
              </div>
            }
          </div>
        </lib-drawer>
      }
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
      .sk__more {
        margin-top: var(--lib-space-xl, 32px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-primary);
        background: transparent;
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--lib-radius-sm, 4px);
        padding: 8px 16px;
        cursor: pointer;
        transition:
          color 0.2s ease,
          border-color 0.2s ease;
      }
      .sk__more:hover {
        color: var(--text-accent);
        border-color: var(--text-accent);
      }
      .sk__more:focus-visible {
        outline: 2px solid var(--border-focus, currentColor);
        outline-offset: 2px;
      }
      /* Stack completo dentro del drawer */
      .sk__full {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-xl, 32px);
      }
    `,
  ],
})
export class Skills {
  readonly groups = input.required<SkillGroup[]>();
  /** Stack exhaustivo para el drawer; vacío ⇒ no se muestra el botón. */
  readonly fullStack = input<SkillGroup[]>([]);

  /** Estado de apertura del drawer (UI local). */
  protected readonly open = signal(false);
}
