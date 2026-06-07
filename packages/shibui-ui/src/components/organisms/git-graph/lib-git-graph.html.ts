import { html, svg, nothing, TemplateResult } from 'lit';
import type {
  GitGraphTemplateProps,
  CommitLayout,
  GitGraphTooltip,
  GitCommit,
} from './lib-git-graph.types';

/* ─── Layout constants ───────────────────────────────────── */
const PADDING_TOP   = 16;
const PADDING_LEFT  = 16;
const NODE_RADIUS   = 6;
const TEXT_GAP      = 14;
const REF_CHAR_W    = 6.5;
const REF_PAD_H     = 10;
const REF_GAP       = 4;
const REF_HEIGHT    = 14;
const REF_MAX_CHARS = 22;

/* ─── Helpers ────────────────────────────────────────────── */

function nodeX(lane: number, laneWidth: number): number {
  return PADDING_LEFT + lane * laneWidth;
}

function nodeY(row: number, rowHeight: number): number {
  return PADDING_TOP + row * rowHeight + rowHeight / 2;
}

function computeMaxLane(layouts: CommitLayout[]): number {
  return layouts.reduce((m, l) => Math.max(m, l.lane), 0);
}

function truncate(s: string, max: number): string {
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString('es', { day: '2-digit', month: 'short', year: '2-digit' });
}

function parseRefLabel(ref: string): string {
  if (ref.startsWith('HEAD -> ')) return ref.slice(8);
  return ref;
}

function isHeadRef(ref: string): boolean {
  return ref.startsWith('HEAD');
}

function refPillWidth(label: string): number {
  return Math.min(label.length, REF_MAX_CHARS) * REF_CHAR_W + REF_PAD_H;
}

/* ─── Edge rendering ─────────────────────────────────────── */

function renderEdges(
  layouts:    CommitLayout[],
  posMap:     Map<string, CommitLayout>,
  laneWidth:  number,
  rowHeight:  number,
): TemplateResult {
  return svg`
    <g class="git-edges">
      ${layouts.map((l) => {
        const x1 = nodeX(l.lane, laneWidth);
        const y1 = nodeY(l.row,  rowHeight);
        return svg`${l.commit.parents.map((ph) => {
          const p = posMap.get(ph);
          if (!p) return nothing;
          const x2   = nodeX(p.lane, laneWidth);
          const y2   = nodeY(p.row,  rowHeight);
          const midY = (y1 + y2) / 2;
          if (l.lane === p.lane) {
            return svg`
              <line x1=${x1} y1=${y1} x2=${x2} y2=${y2}
                stroke=${l.color} stroke-width="2" stroke-opacity="0.75" />
            `;
          }
          return svg`
            <path
              d="M ${x1} ${y1} C ${x1} ${midY} ${x2} ${midY} ${x2} ${y2}"
              stroke=${l.color} stroke-width="2" stroke-opacity="0.75"
              fill="none"
            />
          `;
        })}`;
      })}
    </g>
  `;
}

/* ─── Node rendering ─────────────────────────────────────── */

function renderNodes(
  layouts:   CommitLayout[],
  laneWidth: number,
  rowHeight: number,
  onEnter:   (e: MouseEvent, c: GitCommit, color: string) => void,
  onLeave:   () => void,
): TemplateResult {
  return svg`
    <g class="git-nodes">
      ${layouts.map((l) => {
        const cx      = nodeX(l.lane, laneWidth);
        const cy      = nodeY(l.row,  rowHeight);
        const isMerge = l.commit.parents.length > 1;
        const r       = isMerge ? NODE_RADIUS + 1 : NODE_RADIUS;
        return svg`
          <circle
            cx=${cx} cy=${cy} r=${r}
            fill=${l.color}
            stroke=${isMerge ? 'var(--bg-surface)' : 'none'}
            stroke-width=${isMerge ? '2' : '0'}
            class="git-node"
            @mouseenter=${(e: MouseEvent): void => { onEnter(e, l.commit, l.color); }}
            @mouseleave=${(): void => { onLeave(); }}
          />
        `;
      })}
    </g>
  `;
}

/* ─── Ref pills ──────────────────────────────────────────── */

function renderRefPills(
  refs:    string[],
  startX:  number,
  cy:      number,
): { el: TemplateResult; usedWidth: number } {
  let x = startX;

  const pills = refs.slice(0, 4).map((ref) => {
    const label  = truncate(parseRefLabel(ref), REF_MAX_CHARS);
    const isHead = isHeadRef(ref);
    const w      = refPillWidth(label);
    const pill   = svg`
      <g class="ref-pill">
        <rect
          x=${x} y=${cy - REF_HEIGHT / 2}
          width=${w} height=${REF_HEIGHT}
          rx="3"
          fill=${isHead ? 'oklch(51.65% 0.134 46.13deg)' : 'var(--bg-elevated)'}
          stroke="var(--border-default)" stroke-width="1"
        />
        <text
          x=${x + w / 2} y=${cy + 4}
          text-anchor="middle"
          class="ref-text"
          fill=${isHead ? 'oklch(98% 0.01 46deg)' : 'var(--text-primary)'}
        >${label}</text>
      </g>
    `;
    x += w + REF_GAP;
    return pill;
  });

  return { el: svg`${pills}`, usedWidth: x - startX };
}

/* ─── Text rows ──────────────────────────────────────────── */

function renderTextRows(
  layouts:    CommitLayout[],
  laneWidth:  number,
  rowHeight:  number,
  maxLane:    number,
  showAuthor: boolean,
  showDate:   boolean,
): TemplateResult {
  const baseX    = PADDING_LEFT + (maxLane + 1) * laneWidth + TEXT_GAP;
  const hasExtra = showAuthor || showDate;

  return svg`
    <g class="git-text">
      ${layouts.map((l) => {
        const cy   = nodeY(l.row, rowHeight);
        const refs = l.commit.refs.filter((r) => r !== 'origin/HEAD');

        let msgX   = baseX;
        let refEls: TemplateResult = svg`${nothing}`;

        if (refs.length > 0) {
          const { el, usedWidth } = renderRefPills(refs, baseX, cy);
          refEls = el;
          msgX   = baseX + usedWidth + 4;
        }

        const msg = truncate(l.commit.message, 55);

        return svg`
          ${refEls}
          <text x=${msgX} y=${cy + 4} class="commit-message">${msg}</text>
          ${hasExtra ? svg`
            <text
              x=${baseX}
              y=${cy + rowHeight * 0.38}
              class="commit-meta"
            >${showAuthor ? l.commit.author : ''}${showAuthor && showDate ? ' · ' : ''}${showDate ? fmtDate(l.commit.date) : ''}</text>
          ` : nothing}
        `;
      })}
    </g>
  `;
}

/* ─── Tooltip ────────────────────────────────────────────── */

function renderTooltip(tooltip: GitGraphTooltip | null): TemplateResult {
  if (!tooltip) return html`${nothing}`;
  const { x, y, commit, color } = tooltip;
  return html`
    <div class="git-tooltip" style="left: ${x}px; top: ${y}px;">
      <span class="tooltip-swatch" style="background: ${color}"></span>
      <span class="tooltip-body">
        <code class="tooltip-hash">${commit.hash}</code>
        <span class="tooltip-msg">${commit.message}</span>
        <span class="tooltip-meta">${commit.author} · ${fmtDate(commit.date)}</span>
      </span>
    </div>
  `;
}

/* ─── Main template ──────────────────────────────────────── */

export function gitGraphTemplate(props: GitGraphTemplateProps): TemplateResult {
  const {
    layouts, positionMap, laneWidth, rowHeight, scrollHeight, svgWidth,
    showAuthor, showDate, tooltip, onNodeEnter, onNodeLeave,
  } = props;

  if (layouts.length === 0) {
    return html`
      <div class="git-graph-wrapper">
        <div class="git-graph-empty" style="height: ${scrollHeight}px;">Sin commits</div>
      </div>
    `;
  }

  const maxLane = computeMaxLane(layouts);
  const svgH    = PADDING_TOP * 2 + layouts.length * rowHeight;

  return html`
    <div class="git-graph-wrapper">
      <div class="git-graph-scroll" style="height: ${scrollHeight}px;">
        <svg
          class="git-graph-svg"
          width=${svgWidth}
          height=${svgH}
          role="img"
          aria-label="Git branch graph"
        >
          ${renderEdges(layouts, positionMap, laneWidth, rowHeight)}
          ${renderNodes(layouts, laneWidth, rowHeight, onNodeEnter, onNodeLeave)}
          ${renderTextRows(layouts, laneWidth, rowHeight, maxLane, showAuthor, showDate)}
        </svg>
      </div>
      ${renderTooltip(tooltip)}
    </div>
  `;
}
