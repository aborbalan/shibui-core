/* ============================================================
   LIB-TIMELINE — Tipos públicos
   ============================================================ */

import type { TooltipPosition, TooltipVariant } from '../../atoms/tooltip/lib-tooltip.component';

/** Re-export de los tipos del tooltip que consume el ítem en su nodo */
export type { TooltipPosition, TooltipVariant };

/** Tamaño del timeline — aplica en el contenedor */
export type TimelineSize = 'sm' | 'md' | 'lg';

/** Tipo de nodo del ítem */
export type TimelineNodeType = 'dot' | 'icon' | 'avatar';

/** Color del nodo */
export type TimelineNodeColor = 'default' | 'accent' | 'info' | 'error' | 'muted';

/** Estado del ítem — afecta nodo + contenido + card */
export type TimelineItemStatus = 'default' | 'active' | 'done' | 'error' | 'pending';

/** Variante de la línea que conecta ítems */
export type TimelineLineVariant = 'solid' | 'dashed' | 'progress';

/**
 * Detalle del evento `ui-lib-timeline-item-click`.
 * Se emite al activar (click / Enter / Space) un ítem `clickable` o con `href`.
 * Es `cancelable`: llama a `preventDefault()` para anular la navegación nativa por `href`.
 */
export interface TimelineItemClickDetail {
  /** Identificador libre que el consumidor asocia al ítem (routing, analytics…) */
  value:         string;
  /** URL de navegación, si se definió */
  href:          string;
  /** Título del ítem */
  title:         string;
  /** Timestamp del ítem */
  timestamp:     string;
  /** Evento DOM original (click o keydown) */
  originalEvent: Event;
}

/** Props del template de lib-timeline-item */
export interface TimelineItemTemplateProps {
  /* Nodo */
  nodeType:    TimelineNodeType;
  nodeColor:   TimelineNodeColor;
  icon:        string;
  avatar:      string;
  /* Estado */
  status:      TimelineItemStatus;
  /* Línea */
  lineVariant:    TimelineLineVariant;
  lineProgress:   number;
  hideLine:       boolean;
  /* Contenido */
  timestamp:   string;
  title:       string;
  body:        string;
  /* Card */
  card:        boolean;
  /* Collapsible */
  collapsed:       boolean;
  collapsible:     boolean;
  /* Tooltip en el nodo */
  tooltip:         string;
  tooltipPosition: TooltipPosition;
  tooltipVariant:  TooltipVariant;
  hasTooltipSlot:  boolean;
  /* Clickable / navegación */
  clickable:   boolean;
  href:        string;
  /* Handlers */
  onToggleCollapse: () => void;
  onActivate:       (e: Event) => void;
  onKeydown:        (e: KeyboardEvent) => void;
}