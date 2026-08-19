import { Component, CUSTOM_ELEMENTS_SCHEMA, input, output } from '@angular/core';
import {
  KATACHI_BAND_COPY,
  KATACHI_IDS,
  KATACHI_KANJI,
  KATACHI_LABEL,
  type KatachiId,
} from '@data/katachi';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Banda «Sistema de diseño»: los 6 katachi sellados como swatches en vivo.
 * Clic → re-viste todo el CV (mismo estado que el switcher flotante, que
 * queda como atajo). Dumb: input value / output valueChange, como el switcher.
 */
@Component({
  selector: 'cv-katachi-band',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="kb">
      <cv-section-heading title="Sistema de diseño" kicker="Katachi" index="02" kanji="形" />
      <p class="kb__lede">{{ copy.lede }}</p>

      <div class="kb__grid" role="group" aria-label="Elegir katachi">
        @for (id of ids; track id) {
          <button
            type="button"
            class="kb__swatch"
            [class.kb__swatch--active]="id === value()"
            [attr.aria-pressed]="id === value()"
            (click)="valueChange.emit(id)"
          >
            <span class="kb__kanji" aria-hidden="true">{{ kanji[id] }}</span>
            <span class="kb__label">{{ label[id] }}</span>
          </button>
        }
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .kb__lede {
        margin: 0 0 var(--lib-space-lg, 24px);
        max-width: 58ch;
        color: var(--text-secondary);
        line-height: var(--leading-relaxed, 1.8);
      }
      .kb__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--lib-space-md, 16px);
      }
      .kb__swatch {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--lib-space-sm, 8px);
        padding: var(--lib-space-md, 16px);
        background: var(--bg-surface, transparent);
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition:
          border-color 0.2s ease,
          transform 0.2s ease;
      }
      .kb__swatch:hover {
        border-color: var(--text-accent);
      }
      @media (prefers-reduced-motion: no-preference) {
        .kb__swatch:hover {
          transform: translateY(-2px);
        }
      }
      .kb__swatch:focus-visible {
        outline: 2px solid var(--border-focus, currentColor);
        outline-offset: 2px;
      }
      .kb__swatch--active {
        border-color: var(--text-accent);
        box-shadow: inset 0 0 0 1px var(--text-accent);
      }
      .kb__kanji {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-2xl, 2rem);
        line-height: 1.2;
        color: var(--text-primary);
      }
      .kb__label {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        text-align: left;
        color: var(--text-muted);
      }
      .kb__swatch--active .kb__label {
        color: var(--text-accent);
      }
    `,
  ],
})
export class KatachiBand {
  readonly value = input.required<KatachiId>();
  readonly valueChange = output<KatachiId>();

  protected readonly ids = KATACHI_IDS;
  protected readonly kanji = KATACHI_KANJI;
  protected readonly label = KATACHI_LABEL;
  protected readonly copy = KATACHI_BAND_COPY;
}
