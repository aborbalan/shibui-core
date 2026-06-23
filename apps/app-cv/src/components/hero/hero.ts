import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  ElementRef,
  afterNextRender,
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
          <lib-eyebrow slot="eyebrow" tone="accent" size="lg">{{ profile().title }}</lib-eyebrow>
        </lib-display-heading>

        <p class="hero__tagline">{{ profile().tagline }}</p>

        <div class="hero__actions">
          <nav class="hero__links" aria-label="Contacto">
            <a [href]="profile().github" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a [href]="profile().linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a [href]="'mailto:' + profile().email">Email</a>
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
        opacity: 0.05;
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
        border-radius: var(--lib-radius-sm, 4px);
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
      .hero__links a {
        position: relative;
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-sm, 0.8125rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        text-transform: uppercase;
        text-decoration: none;
        color: var(--text-primary);
        /* tap target cómodo en móvil */
        padding: 4px 0 6px;
        transition: color 0.2s ease;
      }
      .hero__links a::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background: var(--text-accent, currentColor);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      .hero__links a:hover {
        color: var(--text-accent);
      }
      .hero__links a:hover::after {
        transform: scaleX(1);
      }

      /* Parallax: --p (0→1) lo escribe el componente al hacer scroll.
         Capas a distinta velocidad = profundidad. Solo si el usuario no
         pidió reducir movimiento. */
      @media (prefers-reduced-motion: no-preference) {
        .hero__inner {
          transform: translateY(calc(var(--p, 0) * 70px));
          opacity: calc(1 - var(--p, 0) * 0.6);
          will-change: transform, opacity;
        }
        .hero__mark {
          transform: translateY(calc(var(--p, 0) * 26px));
          will-change: transform;
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
