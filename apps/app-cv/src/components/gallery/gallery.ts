import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  computed,
  HostListener,
  input,
  signal,
} from '@angular/core';
import { Artwork } from '@data/portfolio';

/** Una foto suelta con referencia a su obra — unidad de navegación del lightbox. */
interface FlatPhoto {
  file: string;
  art: Artwork;
  /** Nº de foto dentro de la obra (1-based) */
  n: number;
  /** Total de fotos de la obra */
  of: number;
}

/**
 * Galería del portfolio — grid de obras (una portada por obra) con lightbox.
 *
 * El grid muestra una tarjeta por obra (título + material + dimensiones). Al
 * pulsar se abre el lightbox, que recorre TODAS las fotos de todas las obras
 * (←/→), mostrando en cada una la ficha de la obra a la que pertenece.
 *
 * Las imágenes viven en `public/portfolio/`. Si un fichero faltara, el `<img>`
 * se oculta (`data-failed`) y deja ver el placeholder (sello 渋).
 */
@Component({
  selector: 'cv-gallery',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ul class="gal">
      @for (art of items(); track art.slug) {
        <li class="gal__cell">
          <button
            type="button"
            class="gal__tile"
            (click)="openArtwork(art)"
            [attr.aria-label]="'Ver ' + art.title + ' (' + art.photos.length + ' fotos)'"
          >
            <span class="gal__mark" aria-hidden="true">渋</span>
            <img
              class="gal__img"
              [src]="base + art.photos[0]"
              [alt]="art.title + ' — ' + art.material"
              loading="lazy"
              decoding="async"
              (error)="onError($event)"
            />
            @if (art.photos.length > 1) {
              <span class="gal__badge">{{ art.photos.length }}</span>
            }
            <span class="gal__meta">
              <span class="gal__title">{{ art.title }}</span>
              <span class="gal__material">{{ art.material }}</span>
            </span>
          </button>
        </li>
      }
    </ul>

    @if (currentPhoto(); as photo) {
      <div
        class="lb"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="photo.art.title"
        (click)="close()"
      >
        <figure class="lb__figure" (click)="$event.stopPropagation()">
          <span class="lb__mark" aria-hidden="true">渋</span>
          <img
            class="lb__img"
            [src]="base + photo.file"
            [alt]="photo.art.title + ' — ' + photo.art.material"
            (error)="onError($event)"
          />
          <figcaption class="lb__cap">
            <span class="lb__title">{{ photo.art.title }}</span>
            <span class="lb__sub">
              <span>{{ photo.art.material }}</span>
              @if (photo.art.dimensions) {
                <span>{{ photo.art.dimensions }}</span>
              }
              @if (photo.of > 1) {
                <span class="lb__count">{{ photo.n }} / {{ photo.of }}</span>
              }
            </span>
          </figcaption>
        </figure>

        <button
          type="button"
          class="lb__btn lb__btn--prev"
          (click)="prev($event)"
          aria-label="Anterior"
        >
          ‹
        </button>
        <button
          type="button"
          class="lb__btn lb__btn--next"
          (click)="next($event)"
          aria-label="Siguiente"
        >
          ›
        </button>
        <button type="button" class="lb__btn lb__btn--close" (click)="close()" aria-label="Cerrar">
          ✕
        </button>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }

      /* ── Grid ────────────────────────────────────────────── */
      .gal {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: var(--lib-space-md, 16px);
      }
      .gal__cell {
        margin: 0;
      }
      .gal__tile {
        position: relative;
        display: block;
        width: 100%;
        aspect-ratio: 3 / 4;
        overflow: hidden;
        margin: 0;
        padding: 0;
        cursor: pointer;
        background: var(--surface-subtle, rgba(0, 0, 0, 0.04));
        border: 1px solid var(--border-default, currentColor);
        border-radius: var(--radius-md);
        transition:
          border-color 0.2s ease,
          transform 0.2s ease;
      }
      .gal__tile:hover {
        border-color: var(--text-accent, currentColor);
        transform: translateY(-2px);
      }
      .gal__tile:focus-visible {
        outline: 2px solid var(--border-focus, currentColor);
        outline-offset: 2px;
      }
      .gal__mark {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Shippori Mincho', var(--lib-font-body, serif);
        font-size: 4rem;
        color: var(--text-accent, currentColor);
        opacity: 0.12;
        pointer-events: none;
        user-select: none;
      }
      .gal__img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .gal__img[data-failed] {
        display: none;
      }
      .gal__badge {
        position: absolute;
        top: var(--lib-space-sm, 8px);
        right: var(--lib-space-sm, 8px);
        min-width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        color: #fff;
        background: rgba(0, 0, 0, 0.55);
        border-radius: 999px;
      }
      .gal__meta {
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: var(--lib-space-sm, 8px) var(--lib-space-md, 16px);
        background: linear-gradient(to top, rgba(0, 0, 0, 0.72), transparent);
      }
      .gal__title {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-md, 1.0625rem);
        color: #fff;
      }
      .gal__material {
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        line-height: 1.35;
        color: rgba(255, 255, 255, 0.8);
      }

      /* ── Lightbox ────────────────────────────────────────── */
      .lb {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--lib-space-lg, 24px);
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(2px);
      }
      .lb__figure {
        position: relative;
        margin: 0;
        max-width: min(92vw, 900px);
        max-height: 88vh;
        display: flex;
        flex-direction: column;
        gap: var(--lib-space-sm, 8px);
      }
      .lb__mark {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Shippori Mincho', serif;
        font-size: 8rem;
        color: #fff;
        opacity: 0.08;
        pointer-events: none;
      }
      .lb__img {
        max-width: 100%;
        max-height: 76vh;
        object-fit: contain;
        border-radius: var(--radius-md);
        background: rgba(255, 255, 255, 0.03);
      }
      .lb__img[data-failed] {
        display: none;
      }
      .lb__cap {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: var(--lib-space-sm, 8px) var(--lib-space-md, 16px);
        color: #fff;
      }
      .lb__title {
        font-family: var(--lib-font-body, serif);
        font-size: var(--text-lg, 1.25rem);
      }
      .lb__sub {
        display: flex;
        flex-wrap: wrap;
        gap: var(--lib-space-md, 16px);
        font-family: var(--lib-font-mono, monospace);
        font-size: var(--text-xs, 0.6875rem);
        letter-spacing: var(--tracking-wide, 0.08em);
        color: rgba(255, 255, 255, 0.72);
      }
      .lb__btn {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        font-size: 1.5rem;
        line-height: 1;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 50%;
        cursor: pointer;
        transition:
          background 0.2s ease,
          border-color 0.2s ease;
      }
      .lb__btn:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: rgba(255, 255, 255, 0.6);
      }
      .lb__btn:focus-visible {
        outline: 2px solid #fff;
        outline-offset: 2px;
      }
      .lb__btn--prev {
        left: var(--lib-space-md, 16px);
        top: 50%;
        transform: translateY(-50%);
      }
      .lb__btn--next {
        right: var(--lib-space-md, 16px);
        top: 50%;
        transform: translateY(-50%);
      }
      .lb__btn--close {
        top: var(--lib-space-md, 16px);
        right: var(--lib-space-md, 16px);
        font-size: 1.1rem;
      }

      @media (max-width: 480px) {
        .lb__btn--prev {
          left: 4px;
        }
        .lb__btn--next {
          right: 4px;
        }
      }
    `,
  ],
})
export class Gallery {
  readonly items = input.required<Artwork[]>();

  /** Ruta base de las imágenes (servidas desde `public/`). */
  protected readonly base = 'portfolio/';

  /** Todas las fotos aplanadas, en orden de obra → foto. */
  private readonly flat = computed<FlatPhoto[]>(() =>
    this.items().flatMap((art) =>
      art.photos.map((file, i) => ({ file, art, n: i + 1, of: art.photos.length })),
    ),
  );

  /** Índice en `flat` de la foto abierta; `null` = lightbox cerrado. */
  protected readonly activeIndex = signal<number | null>(null);

  protected readonly currentPhoto = computed<FlatPhoto | null>(() => {
    const i = this.activeIndex();
    return i === null ? null : (this.flat()[i] ?? null);
  });

  /** Abre el lightbox en la primera foto de la obra pulsada. */
  protected openArtwork(art: Artwork): void {
    const i = this.flat().findIndex((p) => p.art.slug === art.slug);
    if (i >= 0) this.activeIndex.set(i);
  }

  protected close(): void {
    this.activeIndex.set(null);
  }

  protected prev(event?: Event): void {
    event?.stopPropagation();
    const total = this.flat().length;
    this.activeIndex.update((i) => (i === null ? null : (i - 1 + total) % total));
  }

  protected next(event?: Event): void {
    event?.stopPropagation();
    const total = this.flat().length;
    this.activeIndex.update((i) => (i === null ? null : (i + 1) % total));
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (this.activeIndex() === null) return;
    switch (event.key) {
      case 'Escape':
        this.close();
        break;
      case 'ArrowLeft':
        this.prev();
        break;
      case 'ArrowRight':
        this.next();
        break;
    }
  }

  /** Imagen inexistente/rota → la marcamos para que el CSS la oculte. */
  protected onError(event: Event): void {
    (event.target as HTMLImageElement).dataset['failed'] = 'true';
  }
}
