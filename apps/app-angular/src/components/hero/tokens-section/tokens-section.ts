import { Component } from '@angular/core';

interface Swatch {
  name: string;
  token: string;
}
interface SpacingItem {
  name: string;
  width: string;
}

/** Home · preview de design tokens en tres columnas: color · tipografía · espaciado. */
@Component({
  selector: 'app-tokens-section',
  standalone: true,
  template: `
    <section class="tok">
      <div class="tok__grid">
        <!-- Col 1 · Color -->
        <div class="tok__col">
          <span class="tok__label">Color · Washi</span>
          <div class="tok__swatches">
            @for (s of swatches; track s.token) {
              <div class="tok__swatch" [style.background]="'var(' + s.token + ')'" [title]="s.name"></div>
            }
          </div>
          <p class="tok__note">11 pasos OKLCH · washi-50 → washi-950</p>
        </div>

        <!-- Col 2 · Tipografía -->
        <div class="tok__col">
          <span class="tok__label">Display · Cormorant Garamond</span>
          <p class="tok__display">La belleza <em>austera</em></p>
          <div class="tok__divider"></div>
          <span class="tok__label">Body · Shippori Mincho</span>
          <p class="tok__body">
            Sistema de diseño basado en principios japoneses de austeridad y precisión.
          </p>
          <div class="tok__divider"></div>
          <span class="tok__label">Mono · DM Mono</span>
          <p class="tok__mono">COMPONENT · 66 · v0.1.0</p>
        </div>

        <!-- Col 3 · Espaciado -->
        <div class="tok__col">
          <span class="tok__label">Espaciado · Scale</span>
          <div class="tok__spacing">
            @for (item of spacing; track item.name) {
              <div class="tok__spacing-row">
                <div class="tok__bar" [style.width]="item.width"></div>
                <span class="tok__spacing-label">{{ item.name }}</span>
              </div>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .tok {
        background: var(--color-washi-950);
        padding: clamp(3rem, 6vh, 5rem) clamp(1.5rem, 5vw, 3rem);
        border-top: 1px solid color-mix(in oklch, var(--color-white), transparent 95%);
        border-bottom: 1px solid color-mix(in oklch, var(--color-white), transparent 95%);
      }
      .tok__grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1px;
        background: color-mix(in oklch, var(--color-white), transparent 95%);
      }
      .tok__col {
        background: var(--color-washi-950);
        padding: 1.5rem 1.75rem;
      }
      .tok__label {
        display: block;
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.6rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        color: color-mix(in oklch, var(--text-accent), transparent 50%);
        margin-bottom: 0.75rem;
      }
      .tok__swatches {
        display: flex;
        border-radius: 3px;
        overflow: hidden;
      }
      .tok__swatch {
        flex: 1;
        height: 48px;
      }
      .tok__note {
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.6rem;
        letter-spacing: 0.14em;
        color: color-mix(in oklch, var(--color-washi-50), transparent 75%);
        margin: 0.75rem 0 0;
      }
      .tok__display {
        font-family: var(--lib-font-display, 'Cormorant Garamond', serif);
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        font-weight: 300;
        letter-spacing: -0.02em;
        line-height: 1.2;
        color: color-mix(in oklch, var(--color-washi-50), transparent 45%);
        margin: 0 0 1.25rem;
      }
      .tok__display em {
        font-style: italic;
        color: var(--text-accent);
      }
      .tok__body {
        font-family: var(--lib-font-body, 'Shippori Mincho', serif);
        font-size: 0.9375rem;
        color: color-mix(in oklch, var(--color-washi-50), transparent 60%);
        line-height: 1.8;
        margin: 0 0 1.25rem;
      }
      .tok__mono {
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.8125rem;
        letter-spacing: 0.08em;
        color: color-mix(in oklch, var(--color-washi-50), transparent 65%);
        margin: 0 0 1.25rem;
      }
      .tok__divider {
        border-top: 1px solid color-mix(in oklch, var(--color-white), transparent 93%);
        margin: 1.25rem 0;
      }
      .tok__spacing {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .tok__spacing-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .tok__bar {
        height: 5px;
        background: color-mix(in oklch, var(--text-accent), transparent 65%);
        flex-shrink: 0;
      }
      .tok__spacing-label {
        font-family: var(--lib-font-mono, 'DM Mono', monospace);
        font-size: 0.6rem;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: color-mix(in oklch, var(--color-washi-50), transparent 75%);
      }
      @media (max-width: 860px) {
        .tok__grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class TokensSectionComponent {
  readonly swatches: Swatch[] = [
    { name: 'washi-50', token: '--color-washi-50' },
    { name: 'washi-100', token: '--color-washi-100' },
    { name: 'washi-200', token: '--color-washi-200' },
    { name: 'washi-300', token: '--color-washi-300' },
    { name: 'washi-400', token: '--color-washi-400' },
    { name: 'washi-500', token: '--color-washi-500' },
    { name: 'washi-600', token: '--color-washi-600' },
    { name: 'washi-700', token: '--color-washi-700' },
    { name: 'washi-800', token: '--color-washi-800' },
    { name: 'washi-900', token: '--color-washi-900' },
    { name: 'washi-950', token: '--color-washi-950' },
  ];

  readonly spacing: SpacingItem[] = [
    { name: 'SP-1 · 0.25rem', width: '4px' },
    { name: 'SP-2 · 0.5rem', width: '8px' },
    { name: 'SP-4 · 1rem', width: '16px' },
    { name: 'SP-6 · 1.5rem', width: '24px' },
    { name: 'SP-8 · 2rem', width: '32px' },
    { name: 'SP-12 · 3rem', width: '48px' },
    { name: 'SP-16 · 4rem', width: '64px' },
    { name: 'SP-24 · 6rem', width: '96px' },
  ];
}
