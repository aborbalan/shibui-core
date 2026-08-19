import { Component, effect, input, signal } from '@angular/core';
import type { KatachiId } from '@data/katachi';

interface TypeStep {
  name: string;
  value: string;
}

interface ColorSwatch {
  name: string;
  value: string;
}

const TYPE_TOKENS = ['--text-xs', '--text-sm', '--text-base', '--text-md', '--text-lg', '--text-xl', '--text-2xl'];
const COLOR_TOKENS = [
  '--bg-base',
  '--bg-surface',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
  '--text-accent',
  '--text-link',
  '--border-default',
];

/**
 * Specimen de tokens en vivo: escala tipográfica y paleta semántica leídas
 * del computed style real de <html> — cambian solas con el katachi activo.
 * El input katachi solo dispara la relectura; los valores salen del DOM.
 */
@Component({
  selector: 'cv-token-specimen',
  standalone: true,
  template: `
    <div class="ts">
      <div class="ts__col">
        <span class="ts__title">Escala tipográfica</span>
        @for (s of typeScale(); track s.name) {
          <div class="ts__row">
            <span class="ts__sample" [style.font-size]="s.value">Shibui 渋</span>
            <span class="ts__meta">{{ s.name }} · {{ s.value }}</span>
          </div>
        }
      </div>

      <div class="ts__col">
        <span class="ts__title">Paleta semántica</span>
        <ul class="ts__swatches">
          @for (c of palette(); track c.name) {
            <li class="ts__swatch">
              <span class="ts__chip" [style.background]="c.value"></span>
              <span class="ts__meta">{{ c.name }}</span>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-top: var(--lib-space-xl, 32px);
      }
      .ts {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--lib-space-xl, 32px);
        padding: var(--lib-space-lg, 24px);
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-md);
      }
      .ts__col {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 8px);
        min-width: 0;
      }
      .ts__title {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-muted);
        margin-bottom: var(--lib-space-sm, 8px);
      }
      .ts__row {
        display: flex;
        align-items: baseline;
        gap: var(--lib-space-md, 16px);
        overflow: hidden;
      }
      .ts__sample {
        font-family: var(--lib-font-display, serif);
        line-height: 1.3;
        color: var(--text-primary);
        white-space: nowrap;
      }
      .ts__meta {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        color: var(--text-muted);
        white-space: nowrap;
      }
      .ts__swatches {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 8px);
      }
      .ts__swatch {
        display: flex;
        align-items: center;
        gap: var(--lib-space-md, 16px);
      }
      .ts__chip {
        flex: 0 0 auto;
        width: 40px;
        height: 20px;
        border-radius: 3px;
        border: 1px solid var(--border-default, currentColor);
      }
    `,
  ],
})
export class TokenSpecimen {
  /** Katachi activo — solo como disparador de relectura. */
  readonly katachi = input.required<KatachiId>();

  protected readonly typeScale = signal<TypeStep[]>([]);
  protected readonly palette = signal<ColorSwatch[]>([]);

  constructor() {
    effect((onCleanup) => {
      this.katachi();
      // El effect de App escribe data-katachi en el mismo flush de CD;
      // aplazamos la lectura un tick para medir el DOM ya actualizado. El
      // cleanup cancela el timeout pendiente si llega otro katachi antes o
      // el componente se destruye (sin lecturas huérfanas ni apilamiento).
      const t = setTimeout(() => this.read(), 0);
      onCleanup(() => clearTimeout(t));
    });
  }

  private read(): void {
    if (typeof document === 'undefined') return;
    const cs = getComputedStyle(document.documentElement);
    this.typeScale.set(
      TYPE_TOKENS.map((name) => ({ name, value: cs.getPropertyValue(name).trim() })).filter(
        (s) => s.value,
      ),
    );
    this.palette.set(
      COLOR_TOKENS.map((name) => ({ name, value: cs.getPropertyValue(name).trim() })).filter(
        (c) => c.value,
      ),
    );
  }
}
