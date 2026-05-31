import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import sharedTokens        from '../../../styles/shared/tokens.css?inline';
import componentCss        from './lib-git-graph.css?inline';
import { gitGraphTemplate } from './lib-git-graph.html';
import type { GitCommit, CommitLayout, GitGraphTooltip } from './lib-git-graph.types';

/** Paleta de colores por carril — coherente con scatter-chart y bar-chart. */
const LANE_COLORS: readonly string[] = [
  'oklch(45.54% 0.059 173.23deg)',  /* celadon-500 */
  'oklch(51.65% 0.134  46.13deg)',  /* kaki-500    */
  'oklch(65%    0.15  300deg)',
  'oklch(55%    0.18  240deg)',
  'oklch(65%    0.12   60deg)',
  'oklch(60%    0.14    0deg)',
];

/**
 * @element lib-git-graph
 *
 * Organismo de visualización: grafo de ramas de git SVG nativo.
 * Renderiza el historial de commits con sus relaciones de parentesco,
 * carriles de rama y etiquetas de referencia (HEAD, branches, tags).
 * Katachi-aware — consume tokens semánticos del ancestro data-katachi.
 *
 * El componente recibe datos puros (`commits`) y no sabe cómo obtenerlos:
 * en Tauri llegan por `invoke()` desde Rust; en web, por API REST.
 *
 * @prop {GitCommit[]} commits      — Array en orden topológico (más reciente primero).
 * @prop {number}      height       — Alto del área scrolleable en px. Default 400.
 * @prop {number}      row-height   — Separación entre filas en px. Default 32.
 * @prop {number}      lane-width   — Ancho de cada carril en px. Default 24.
 * @prop {boolean}     show-author  — Muestra el nombre del autor bajo cada mensaje.
 * @prop {boolean}     show-date    — Muestra la fecha bajo cada mensaje.
 *
 * @example
 * <lib-git-graph
 *   .commits=${misCommits}
 *   height="500"
 *   show-date
 * ></lib-git-graph>
 */
@customElement('lib-git-graph')
export class LibGitGraph extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(componentCss)}`,
  ];

  @property({ type: Array })
  commits: GitCommit[] = [];

  @property({ type: Number })
  height = 400;

  @property({ type: Number, attribute: 'row-height' })
  rowHeight = 32;

  @property({ type: Number, attribute: 'lane-width' })
  laneWidth = 24;

  @property({ type: Boolean, attribute: 'show-author', reflect: true })
  showAuthor = false;

  @property({ type: Boolean, attribute: 'show-date', reflect: true })
  showDate = false;

  @state() private _svgWidth = 700;
  @state() private _tooltip: GitGraphTooltip | null = null;

  private _ro: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w !== undefined && Math.round(w) !== Math.round(this._svgWidth)) {
        this._svgWidth = w;
      }
    });
    this._ro.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
  }

  override firstUpdated(): void {
    this._svgWidth = this.clientWidth || 700;
  }

  /**
   * Asigna carriles a cada commit mediante un algoritmo greedy de slots activos.
   *
   * Cada slot representa un carril en tránsito hacia un commit padre.
   * Un commit hereda el carril de su primer hijo procesado (primer slot coincidente);
   * los padres adicionales (merges) abren nuevos carriles.
   */
  private _computeLayout(): { layouts: CommitLayout[]; positionMap: Map<string, CommitLayout> } {
    const layouts:    CommitLayout[]                                          = [];
    const positionMap = new Map<string, CommitLayout>();
    const slots:      Array<{ targetHash: string; lane: number; color: string }> = [];

    for (const commit of this.commits) {
      const matchedIndices = slots
        .map((s, i) => (s.targetHash === commit.hash ? i : -1))
        .filter((i) => i >= 0);

      let lane:  number;
      let color: string;

      if (matchedIndices.length > 0) {
        const primary = slots[matchedIndices[0]!]!;
        lane  = primary.lane;
        color = primary.color;
        /* Eliminar en orden inverso para no desplazar índices. */
        for (let i = matchedIndices.length - 1; i >= 0; i--) {
          slots.splice(matchedIndices[i]!, 1);
        }
      } else {
        const usedLanes = new Set(slots.map((s) => s.lane));
        lane = 0;
        while (usedLanes.has(lane)) lane++;
        color = LANE_COLORS[lane % LANE_COLORS.length]!;
      }

      const item: CommitLayout = { commit, lane, row: layouts.length, color };
      layouts.push(item);
      positionMap.set(commit.hash, item);

      for (let pi = 0; pi < commit.parents.length; pi++) {
        const parentHash = commit.parents[pi]!;
        if (slots.some((s) => s.targetHash === parentHash)) continue;

        if (pi === 0) {
          slots.push({ targetHash: parentHash, lane, color });
        } else {
          const usedLanes = new Set(slots.map((s) => s.lane));
          let newLane = 0;
          while (usedLanes.has(newLane)) newLane++;
          const newColor = LANE_COLORS[newLane % LANE_COLORS.length]!;
          slots.push({ targetHash: parentHash, lane: newLane, color: newColor });
        }
      }
    }

    return { layouts, positionMap };
  }

  private _handleNodeEnter(e: MouseEvent, commit: GitCommit, color: string): void {
    const wrapper  = this.shadowRoot?.querySelector('.git-graph-wrapper') as HTMLElement | null;
    const node     = e.currentTarget as SVGCircleElement;
    const wrapRect = wrapper?.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    if (!wrapRect) return;
    this._tooltip = {
      x:      nodeRect.left - wrapRect.left + nodeRect.width  / 2,
      y:      nodeRect.top  - wrapRect.top,
      commit,
      color,
    };
  }

  private _handleNodeLeave(): void {
    this._tooltip = null;
  }

  override render(): TemplateResult {
    const { layouts, positionMap } = this._computeLayout();
    return gitGraphTemplate({
      layouts,
      positionMap,
      laneWidth:    this.laneWidth,
      rowHeight:    this.rowHeight,
      scrollHeight: this.height,
      svgWidth:     this._svgWidth,
      showAuthor:   this.showAuthor,
      showDate:     this.showDate,
      tooltip:      this._tooltip,
      onNodeEnter:  (e, c, col) => { this._handleNodeEnter(e, c, col); },
      onNodeLeave:  () => { this._handleNodeLeave(); },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-git-graph': LibGitGraph;
  }
}
