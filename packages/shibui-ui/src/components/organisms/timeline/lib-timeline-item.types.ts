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
  /* Handlers */
  onToggleCollapse: () => void;
}