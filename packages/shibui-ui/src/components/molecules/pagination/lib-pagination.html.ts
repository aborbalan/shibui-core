import { html, nothing, TemplateResult } from 'lit';
import type { LibPagination } from './lib-pagination.component';

/* ── Chevrons inline — sin dependencia de lib-icon ── */
const chevronLeft: TemplateResult = html`
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/>
  </svg>`;

const chevronRight: TemplateResult = html`
  <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">
    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
  </svg>`;

/**
 * Genera la secuencia de páginas con ellipsis.
 *
 * Ejemplo (current=5, total=10, siblings=1):
 *   [1] … [4][5][6] … [10]
 *
 * Retorna un array de números o null (null = ellipsis).
 */
function buildPageSequence(current: number, total: number, siblings: number): (number | null)[] {
  if (total <= 1) return [1];

  const left  = Math.max(2, current - siblings);
  const right = Math.min(total - 1, current + siblings);

  const pages: (number | null)[] = [1];

  if (left > 2)        pages.push(null);           // ellipsis izquierdo
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push(null);         // ellipsis derecho
  if (total > 1) pages.push(total);

  return pages;
}

export function paginationTemplate(ctx: LibPagination): TemplateResult {
  const total   = ctx.totalPages;
  const current = ctx.currentPage;
  const sequence = buildPageSequence(current, total, ctx.siblings);

  /* Info de resultados */
  const infoText = ctx.showInfo
    ? (():TemplateResult => {
        const from = (current - 1) * ctx.itemsPerPage + 1;
        const to   = Math.min(current * ctx.itemsPerPage, ctx.totalItems);
        return html`
          <span class="pg-info" part="info">
            ${from}–${to} de ${ctx.totalItems}
          </span>`;
      })()
    : nothing;

  return html`
    <nav class="pg" part="root" aria-label="${ctx.ariaLabel}">

      ${ctx.showInfo ? infoText : nothing}

      <!-- ← Anterior -->
      <button
        class="pg-btn pg-btn--nav"
        part="btn-prev"
        ?disabled="${current === 1}"
        aria-label="Página anterior"
        @click="${(): void => ctx._changePage(current - 1)}"
      >
        ${chevronLeft}
        ${ctx.size !== 'sm' ? html`<span>Ant</span>` : nothing}
      </button>

      <!-- Números -->
      <div class="pg-numbers" part="numbers" role="list">
        ${sequence.map((page, /*idx*/) =>
          page === null
            ? html`<span class="pg-ellipsis" role="listitem" aria-hidden="true">…</span>`
            : html`
              <button
                class="pg-btn ${page === current ? 'pg-btn--active' : ''}"
                part="btn-page${page === current ? ' btn-page-active' : ''}"
                role="listitem"
                aria-label="Página ${page}"
                aria-current="${page === current ? 'page' : nothing}"
                ?disabled="${page === current}"
                @click="${(): void => ctx._changePage(page as number)}"
              >${page}</button>`
        )}
      </div>

      <!-- → Siguiente -->
      <button
        class="pg-btn pg-btn--nav"
        part="btn-next"
        ?disabled="${current === total}"
        aria-label="Página siguiente"
        @click="${(): void => ctx._changePage(current + 1)}"
      >
        ${ctx.size !== 'sm' ? html`<span>Sig</span>` : nothing}
        ${chevronRight}
      </button>

    </nav>
  `;
}