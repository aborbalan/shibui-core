import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
} from '@angular/core';
import { Profile } from '@data/cv';

/**
 * Above the fold: nombre + título + tagline + 3 links. Nada más.
 *
 * Parallax de profundidad: un 渋 gigante tenue (capa de fondo) y el
 * contenido (capa frontal) se desplazan a distinta velocidad al hacer
 * scroll → sensación de profundidad. Solo transform/opacity, throttle por
 * requestAnimationFrame, desactivado con prefers-reduced-motion y en print.
 * Dumb component.
 */
@Component({
  selector: 'cv-hero',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <section class="hero">
      <div class="hero__mark" aria-hidden="true">渋</div>

      <div class="hero__inner">
        <lib-display-heading
          tag="h1"
          size="lg"
          [line1]="profile().firstName"
          [accent]="profile().lastName"
        >
          <div slot="eyebrow" class="hero__kicker">
            <lib-eyebrow tone="accent" size="lg">{{ titleParts().head }}</lib-eyebrow>
            @if (titleParts().meta.length) {
              <p class="hero__kicker-meta">
                @for (seg of titleParts().meta; track $index) {
                  <span class="hero__kicker-seg">{{ seg }}</span>
                }
              </p>
            }
          </div>
        </lib-display-heading>

        <p class="hero__tagline">{{ profile().tagline }}</p>

        <div class="hero__actions">
          <nav class="hero__links" aria-label="Contacto">
            <a class="mono-link" [href]="profile().github" target="_blank" rel="noopener noreferrer"
              >GitHub</a
            >
            <a class="mono-link" [href]="profile().linkedin" target="_blank" rel="noopener noreferrer"
              >LinkedIn</a
            >
            <a class="mono-link" [href]="'mailto:' + profile().email">Email</a>
          </nav>

          <button type="button" class="hero__print no-print" (click)="onPrint()">
            Descargar PDF
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .hero {
        position: relative;
        overflow: hidden;
        min-height: 100svh;
        display: flex;
        align-items: center;
      }
      /* Capa de fondo: sello 渋 sobredimensionado, tenue, sangrando a la derecha */
      .hero__mark {
        position: absolute;
        inset: 0;
        z-index: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-family: 'Shippori Mincho', var(--lib-font-body, serif);
        font-size: clamp(18rem, 48vw, 38rem);
        line-height: 1;
        color: var(--text-accent, currentColor);
        opacity: 0.06;
        pointer-events: none;
        user-select: none;
      }
      /* Capa frontal: el contenido real */
      .hero__inner {
        position: relative;
        z-index: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-lg, 24px);
        padding-block: var(--lib-space-xl, 32px);
      }
      .hero__kicker {
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-xs, 4px);
      }
      /* Segunda línea del titular: especialidades en mono muted. Cada
         segmento es no-partible: los saltos caen siempre en los separadores. */
      .hero__kicker-meta {
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-xs, 4px) var(--lib-space-sm, 8px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-muted);
      }
      .hero__kicker-seg {
        white-space: nowrap;
      }
      /* Separador decorativo entre segmentos, en CSS (con alt vacío para AT). */
      .hero__kicker-seg:not(:last-child)::after {
        content: '·' / '';
        margin-left: var(--lib-space-sm, 8px);
      }
      .hero__tagline {
        margin: 0;
        max-width: 46ch;
        /* fluido: ~17px en móvil → 24px en desktop */
        font-size: clamp(var(--text-md, 1.0625rem), 1rem + 1.2vw, var(--text-xl, 1.5rem));
        font-weight: var(--weight-light, 300);
        line-height: var(--leading-snug, 1.4);
        color: var(--text-secondary);
        overflow-wrap: anywhere;
      }
      .hero__actions {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--lib-space-md, 16px) var(--lib-space-xl, 32px);
        margin-top: var(--lib-space-sm, 8px);
      }
      .hero__links {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-md, 16px) var(--lib-space-lg, 24px);
      }
      .hero__print {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        color: var(--text-primary);
        background: transparent;
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-md);
        padding: 8px 16px;
        cursor: pointer;
        transition:
          color 0.2s ease,
          border-color 0.2s ease,
          background 0.2s ease;
      }
      .hero__print:hover {
        color: var(--text-accent);
        border-color: var(--text-accent);
      }
      .hero__print:focus-visible {
        outline: 2px solid var(--border-focus, currentColor);
        outline-offset: 2px;
      }
      /* tap target cómodo en móvil (el resto lo da .mono-link global) */
      .hero__links .mono-link {
        padding: 4px 0 6px;
      }

      /* Parallax: --p (0→1) lo escribe el componente al hacer scroll.
         Las capas DIVERGEN — el contenido baja, el sello sube + deriva y
         escala — para que la separación se note. Solo si el usuario no
         pidió reducir movimiento. */
      @media (prefers-reduced-motion: no-preference) {
        .hero__inner {
          transform: translateY(calc(var(--p, 0) * 64px));
          opacity: calc(1 - var(--p, 0) * 0.65);
          will-change: transform, opacity;
        }
        .hero__mark {
          transform: translate3d(
              calc(var(--p, 0) * 40px),
              calc(var(--p, 0) * -72px),
              0
            )
            scale(calc(1 + var(--p, 0) * 0.12));
          opacity: calc(0.06 + var(--p, 0) * 0.04);
          will-change: transform, opacity;
        }
      }

      /* En papel: sin parallax ni sello decorativo. */
      @media print {
        .hero__inner {
          transform: none !important;
          opacity: 1 !important;
        }
        .hero__mark {
          display: none !important;
        }
      }
    `,
  ],
})
export class Hero {
  readonly profile = input.required<Profile>();

  /** Titular troceado por ' · ': head = rol (eyebrow), meta = especialidades. */
  protected readonly titleParts = computed(() => {
    const [head = '', ...meta] = this.profile().title.split(' · ');
    return { head, meta };
  });

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      // prefers-reduced-motion → no enganchamos nada (el CSS ya lo respeta).
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const el = this.host.nativeElement;
      let ticking = false;

      const update = (): void => {
        ticking = false;
        const vh = window.innerHeight || 1;
        // Progreso 0→1 mientras el hero sale por la parte superior.
        const p = Math.min(Math.max(window.scrollY / vh, 0), 1);
        el.style.setProperty('--p', p.toFixed(3));
      };

      const onScroll = (): void => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      update();
      this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
    });
  }

  /** Abre el diálogo de impresión del navegador (→ «Guardar como PDF»). */
  protected onPrint(): void {
    window.print();
  }
}
