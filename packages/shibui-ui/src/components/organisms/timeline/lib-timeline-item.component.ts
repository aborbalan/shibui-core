import { LitElement, css, unsafeCSS, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import timelineCss from './lib-timeline.css?inline';
import sharedTokens from '../../../styles/shared/tokens.css?inline';
import { timelineItemTemplate } from './lib-timeline-item.html';
// ✅ side-effect: registra <lib-tooltip> usado en el nodo
import '../../atoms/tooltip/lib-tooltip.component';
import type {
  TimelineNodeType,
  TimelineNodeColor,
  TimelineItemStatus,
  TimelineLineVariant,
  TooltipPosition,
  TooltipVariant,
} from './lib-timeline-item.types';

/**
 * @element lib-timeline-item
 *
 * Ítem de timeline. Debe usarse dentro de `<lib-timeline>`.
 *
 * @prop {TimelineNodeType}    node-type     — Tipo de nodo: dot · icon · avatar (default: 'dot')
 * @prop {TimelineNodeColor}   node-color    — Color del nodo: default · accent · info · error · muted
 * @prop {string}              icon          — Nombre de icono Phosphor (node-type='icon')
 * @prop {string}              avatar        — Iniciales (node-type='avatar')
 * @prop {TimelineItemStatus}  status        — Estado: default · active · done · error · pending
 * @prop {TimelineLineVariant} line-variant  — Estilo de línea: solid · dashed · progress
 * @prop {number}              line-progress — Progreso de la línea 0–100 (line-variant='progress')
 * @prop {boolean}             hide-line     — Oculta la línea (útil en el último ítem)
 * @prop {string}              timestamp     — Texto de fecha/hora
 * @prop {string}              title         — Título del evento
 * @prop {string}              body          — Texto descriptivo (alternativa al slot)
 * @prop {boolean}             card          — Envuelve el contenido en una tarjeta con borde
 * @prop {boolean}             collapsible   — Muestra botón de expandir/contraer
 * @prop {string}              tooltip          — Texto que muestra el nodo en hover (lib-tooltip)
 * @prop {TooltipPosition}     tooltip-position — Posición de la burbuja (default: 'right')
 * @prop {TooltipVariant}      tooltip-variant  — Variante de color de la burbuja (default: 'dark')
 *
 * @slot         — Contenido libre (body del evento)
 * @slot meta    — Badges, avatares y metadatos en fila
 * @slot media   — Imágenes o bloques adjuntos (solo dentro de card)
 * @slot tooltip — Contenido rico del tooltip del nodo (tip-title, tip-body…)
 */
@customElement('lib-timeline-item')
export class LibTimelineItem extends LitElement {
  static override styles = [
    css`${unsafeCSS(sharedTokens)}`,
    css`${unsafeCSS(timelineCss)}`,
  ];

  /* ── Nodo ── */

  @property({ type: String, reflect: true, attribute: 'node-type' })
  nKind: TimelineNodeType = 'dot';

  @property({ type: String, reflect: true, attribute: 'node-color' })
  nodeColor: TimelineNodeColor = 'default';

  @property({ type: String })
  icon = 'circle';

  @property({ type: String })
  avatar = '';

  /* ── Estado ── */

  @property({ type: String, reflect: true })
  status: TimelineItemStatus = 'default';

  /* ── Línea ── */

  @property({ type: String, reflect: true, attribute: 'line-variant' })
  lineVariant: TimelineLineVariant = 'solid';

  @property({ type: Number, attribute: 'line-progress' })
  lineProgress = 0;

  @property({ type: Boolean, reflect: true, attribute: 'hide-line' })
  hideLine = false;

  /* ── Contenido ── */

  @property({ type: String })
  timestamp = '';

  @property({ type: String })
  override title = '';

  @property({ type: String })
  body = '';

  @property({ type: Boolean, reflect: true })
  card = false;

  /* ── Collapsible ── */

  @property({ type: Boolean, reflect: true })
  collapsible = false;

  @state() private _collapsed = false;

  /* ── Tooltip del nodo ── */

  @property({ type: String })
  tooltip = '';

  @property({ type: String, attribute: 'tooltip-position' })
  tooltipPosition: TooltipPosition = 'right';

  @property({ type: String, attribute: 'tooltip-variant' })
  tooltipVariant: TooltipVariant = 'dark';

  /* ── API pública ── */

  /** Expande el ítem si es collapsible */
  public expand(): void {
    this._collapsed = false;
  }

  /** Contrae el ítem si es collapsible */
  public collapse(): void {
    this._collapsed = true;
  }

  /* ── Render ── */

  protected override render(): TemplateResult {
    return timelineItemTemplate({
      nodeType:    this.nKind,
      nodeColor:   this.nodeColor,
      icon:        this.icon,
      avatar:      this.avatar,
      status:      this.status,
      lineVariant: this.lineVariant,
      lineProgress: this.lineProgress,
      hideLine:    this.hideLine,
      timestamp:   this.timestamp,
      title:       this.title,
      body:        this.body,
      card:        this.card,
      collapsed:   this._collapsed,
      collapsible: this.collapsible,
      tooltip:         this.tooltip,
      tooltipPosition: this.tooltipPosition,
      tooltipVariant:  this.tooltipVariant,
      hasTooltipSlot:  this.querySelector(':scope > [slot="tooltip"]') !== null,
      onToggleCollapse: (): void => { this._collapsed = !this._collapsed; },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lib-timeline-item': LibTimelineItem;
  }
}