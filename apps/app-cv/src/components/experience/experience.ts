import { Component, CUSTOM_ELEMENTS_SCHEMA, input } from '@angular/core';
import { ExperienceItem } from '@data/cv';
import { SectionHeading } from '../section-heading/section-heading';

/**
 * Experiencia en timeline (cronológico inverso). Empresas destacadas
 * con nodo de acento. Por rol: 1-2 logros + stack en línea mono.
 * Dumb component.
 */
@Component({
  selector: 'cv-experience',
  standalone: true,
  imports: [SectionHeading],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="xp">
      <cv-section-heading title="Experiencia" index="03" kanji="歴" />

      <lib-timeline size="lg">
        @for (job of items(); track job.company + job.period) {
          <!-- Roles destacados: card + logros. Los demás, línea compacta
               (empresa + rol + stack, sin card ni logros) para que la
               sección no se coma media pantalla en móvil. -->
          <lib-timeline-item
            node-type="dot"
            [nodeColor]="job.highlight ? 'accent' : 'default'"
            [timestamp]="job.period"
            [attr.card]="job.highlight ? '' : null"
          >
            <div class="xp__body" [class.xp__body--compact]="!job.highlight">
              <!-- Empresa por interpolación (no [title]: colisiona con el
                   atributo nativo y rompe el escapado del '&' en 1&ABS) -->
              <h3 class="xp__company">{{ job.company }}</h3>
              <p class="xp__role">
                {{ job.role }}
                @if (job.location) {
                  <span class="xp__loc">· {{ job.location }}</span>
                }
              </p>
              @if (job.highlight) {
                <ul class="xp__achievements">
                  @for (a of job.achievements; track a) {
                    <li>{{ a }}</li>
                  }
                </ul>
              }
            </div>

            <!-- Stack como línea mono, no chips: el chip se reserva a la
                 sección Stack para que allí conserve su peso visual. -->
            <span slot="meta" class="xp__stack">{{ job.stack.join(' · ') }}</span>
          </lib-timeline-item>
        }
      </lib-timeline>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .xp__company {
        margin: 0 0 2px;
        font-family: var(--lib-font-display, serif);
        font-weight: var(--weight-medium, 500);
        font-size: var(--text-xl, 1.5rem);
        line-height: var(--leading-tight, 1.2);
        color: var(--text-primary);
        overflow-wrap: anywhere;
      }
      /* Roles secundarios: empresa a menor escala, sin la presencia de card. */
      .xp__body--compact .xp__company {
        font-size: var(--text-md, 1.0625rem);
      }
      .xp__role {
        margin: 0 0 var(--lib-space-sm, 8px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-accent);
      }
      .xp__loc {
        color: var(--text-muted);
        text-transform: none;
        letter-spacing: 0;
      }
      .xp__achievements {
        margin: 0;
        padding-left: 1.1em;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 8px);
        color: var(--text-secondary);
        line-height: var(--leading-relaxed, 1.8);
        overflow-wrap: anywhere;
      }
      .xp__stack {
        display: block;
        margin-top: var(--lib-space-md, 16px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-muted);
      }
    `,
  ],
})
export class Experience {
  readonly items = input.required<ExperienceItem[]>();
}
