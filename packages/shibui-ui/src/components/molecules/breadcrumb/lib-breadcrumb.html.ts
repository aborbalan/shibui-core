import { html, nothing, TemplateResult } from 'lit';
import { classMap }                       from 'lit/directives/class-map.js';
import type {
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbSize,
  BreadcrumbSurface,
  BreadcrumbAccent,
} from './lib-breadcrumb.types';

export interface BreadcrumbTemplateProps {
  items: BreadcrumbItem[];
  separator: BreadcrumbSeparator;
  size: BreadcrumbSize;
  surface: BreadcrumbSurface;
  accent: BreadcrumbAccent;
  dark: boolean;
  /** Si > 0 y items.length > maxVisible, colapsa los crumbs intermedios. */
  maxVisible: number;
  /** Estado interno: ¿está expandido el truncado? */
  expanded: boolean;
  onExpand: () => void;
  onNavigate: (item: BreadcrumbItem, index: number) => void;
}

/* ── Separador ─────────────────────────────────────────── */
function renderSep(separator: BreadcrumbSeparator): TemplateResult {
  if (separator === 'chevron') {
    return html`
      <span class="bc-sep" aria-hidden="true">
        <lib-icon name="caret-right" size="xs"></lib-icon>
      </span>
    `;
  }
  return html`<span class="bc-sep" aria-hidden="true"></span>`;
}

/* ── Icono opcional dentro de un crumb ─────────────────── */
function renderIcon(icon?: string): TemplateResult | typeof nothing {
  if (!icon) return nothing;
  return html`<span class="bc-icon"><lib-icon name="${icon}" size="xs"></lib-icon></span>`;
}

/* ── Crumb enlazable (ancestro) ─────────────────────────── */
function renderLink(
  item: BreadcrumbItem,
  index: number,
  separator: BreadcrumbSeparator,
  onNavigate: BreadcrumbTemplateProps['onNavigate'],
): TemplateResult {
  return html`
    <li class="bc-item">
      <a
        class="bc-link"
        href="${item.href ?? '#'}"
        @click="${(e: Event):void => { e.preventDefault(); onNavigate(item, index); }}"
      >
        ${renderIcon(item.icon)}
        ${item.label ? html`${item.label}` : nothing}
      </a>
      ${renderSep(separator)}
    </li>
  `;
}

/* ── Crumb activo (último) ──────────────────────────────── */
function renderCurrent(item: BreadcrumbItem): TemplateResult {
  return html`
    <li class="bc-item">
      <span class="bc-current" aria-current="page">
        ${renderIcon(item.icon)}
        ${item.label ? html`${item.label}` : nothing}
      </span>
    </li>
  `;
}

/* ── Botón de ellipsis (truncado) ──────────────────────── */
function renderEllipsis(
  separator: BreadcrumbSeparator,
  onExpand: () => void,
): TemplateResult {
  return html`
    <li class="bc-item">
      <button
        class="bc-ellipsis"
        aria-label="Mostrar ruta completa"
        @click="${onExpand}"
      >…</button>
      ${renderSep(separator)}
    </li>
  `;
}

/* ── Lista de ítems con lógica de collapse ─────────────── */
function renderItems(p: BreadcrumbTemplateProps): TemplateResult[] {
  const { items, separator, maxVisible, expanded, onExpand, onNavigate } = p;

  const shouldCollapse =
    maxVisible > 0 &&
    items.length > maxVisible &&
    !expanded;

  if (shouldCollapse) {
    const first = items[0];
    const last  = items[items.length - 1];

    if (!first || !last) return [];

    return [
      renderLink(first, 0, separator, onNavigate),
      renderEllipsis(separator, onExpand),
      last.href
        ? renderLink(last, items.length - 1, separator, onNavigate)
        : renderCurrent(last),
    ];
  }

  return items.map((item, i) => {
    const isLast = i === items.length - 1;
    if (isLast || !item.href) return renderCurrent(item);
    return renderLink(item, i, separator, onNavigate);
  });
}

/* ── Template principal ─────────────────────────────────── */
export function breadcrumbTemplate(p: BreadcrumbTemplateProps): TemplateResult {
  const bcClasses = {
    'bc':            true,
    'bc-slash':      p.separator === 'slash',
    'bc-chevron':    p.separator === 'chevron',
    'bc-dot':        p.separator === 'dot',
    'bc-line':       p.separator === 'line',
    'bc-sm':         p.size === 'sm',
    'bc-lg':         p.size === 'lg',
    'bc-filled':     p.surface === 'filled',
    'bc-pill':       p.surface === 'pill',
    'bc-kaki':       p.accent === 'kaki',
    'bc-celadon':    p.accent === 'celadon',
    'bc-bold':       p.accent === 'bold',
    'bc-dark':       p.dark,
  };

  return html`
    <nav class="${classMap(bcClasses)}" aria-label="breadcrumb">
      <ol class="bc-list">
        ${renderItems(p)}
      </ol>
    </nav>
  `;
}