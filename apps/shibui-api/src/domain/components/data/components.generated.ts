/* ============================================================
   AUTO-GENERADO — NO EDITAR A MANO.
   Fuente: packages/shibui-ui/dist/custom-elements.json (cem analyze)
   Overlay editorial: packages/shibui-ui/scripts/components-editorial.ts
   Regenerar: pnpm --filter @shibui-ui/ui generate:components-api
   ============================================================ */
import type { ComponentApi } from '../entities/component.entity';

export type GeneratedStatus = 'stable' | 'draft' | 'deprecated';

export interface GeneratedComponent {
  id: string;
  name: string;
  slug: string;
  tagName: string;
  description: string;
  version: string;
  status: GeneratedStatus;
  categoryId: string;
  packageName: string | null;
  tags: string[];
  docsUrl: string | null;
  api: ComponentApi;
}

export const COMPONENTS_GENERATED: GeneratedComponent[] = [
  {
    "id": "cmp-lib-accordion",
    "name": "Accordion",
    "slug": "lib-accordion",
    "tagName": "lib-accordion",
    "description": "Vertically stacked set of collapsible panels with exclusive mode support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "display",
          "type": "LibAccordionDisplay",
          "default": "'default'",
          "description": "Modo de presentación (default · flush · separated)",
          "attribute": "display",
          "options": [
            "default",
            "flush",
            "separated"
          ]
        },
        {
          "name": "tone",
          "type": "LibAccordionTone",
          "default": "'default'",
          "description": "Tinte semántico (default · accent)",
          "attribute": "tone",
          "options": [
            "default",
            "accent"
          ]
        },
        {
          "name": "exclusive",
          "type": "boolean",
          "default": "false",
          "description": "Si true, solo un item puede estar abierto a la vez.\nAl abrir uno, los demas se cierran automaticamente.",
          "attribute": "exclusive"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "lib-accordion-item elements"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-accordion-item",
    "name": "Accordion Item",
    "slug": "lib-accordion-item",
    "tagName": "lib-accordion-item",
    "description": "Individual collapsible panel for use inside lib-accordion.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Texto del trigger (cabecera del item)",
          "attribute": "label"
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "Estado abierto/cerrado",
          "attribute": "open"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido colapsable"
        }
      ],
      "events": [
        {
          "name": "accordion-toggle",
          "type": "CustomEvent",
          "description": "Emitido al hacer clic en el trigger. detail: { open: boolean }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-alert",
    "name": "Alert",
    "slug": "lib-alert",
    "tagName": "lib-alert",
    "description": "Inline notification banner for success, warning, error and info messages.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "type",
          "type": "AlertType",
          "default": "'default'",
          "attribute": "type",
          "options": [
            "default",
            "info",
            "warning",
            "error",
            "success"
          ]
        },
        {
          "name": "heading",
          "type": "string",
          "default": "''",
          "attribute": "heading"
        },
        {
          "name": "closable",
          "type": "boolean",
          "default": "false",
          "attribute": "closable"
        },
        {
          "name": "glass",
          "type": "boolean",
          "default": "false",
          "attribute": "glass"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Cuerpo del mensaje"
        }
      ],
      "events": [
        {
          "name": "ui-lib-alert-close",
          "type": "CustomEvent",
          "description": "— { type } — al pulsar el botón de cierre"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-aspect-ratio",
    "name": "Aspect Ratio",
    "slug": "lib-aspect-ratio",
    "tagName": "lib-aspect-ratio",
    "description": "Container that enforces a specific aspect ratio for its content.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "ratio",
          "type": "string",
          "default": "'1/1'",
          "description": "El ratio deseado. Ejemplos: \"16/9\", \"4/3\", \"1/1\", \"21/9\"",
          "attribute": "ratio"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-avatar",
    "name": "Avatar",
    "slug": "lib-avatar",
    "tagName": "lib-avatar",
    "description": "User avatar with image, initials fallback, size, shape and status slot.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "src",
          "type": "string",
          "default": "''",
          "description": "URL de la imagen",
          "attribute": "src"
        },
        {
          "name": "name",
          "type": "string",
          "default": "''",
          "description": "Nombre completo — genera las iniciales automáticamente",
          "attribute": "name"
        },
        {
          "name": "size",
          "type": "LibAvatarSize",
          "default": "'md'",
          "description": "Escala de tamaño",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl",
            "2xl"
          ]
        },
        {
          "name": "shape",
          "type": "LibAvatarShape",
          "default": "'circle'",
          "description": "Forma del avatar",
          "attribute": "shape",
          "options": [
            "circle",
            "squircle",
            "square"
          ]
        },
        {
          "name": "tint",
          "type": "LibTint",
          "default": "'neutral'",
          "description": "Tinte decorativo del fondo de iniciales/icono (no semántico)",
          "attribute": "tint",
          "options": [
            "neutral",
            "warm",
            "cool",
            "inverse"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Icono de fallback cuando no hay imagen ni iniciales"
        },
        {
          "name": "status",
          "description": "Indicador de estado (lib-status-dot)"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-background",
    "name": "Background",
    "slug": "lib-background",
    "tagName": "lib-background",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "visual"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "theme",
          "type": "LibBackgroundTheme",
          "default": "'washi'",
          "description": "— Fondo activo (default: 'washi')",
          "attribute": "theme",
          "options": [
            "washi",
            "washi-grain",
            "washi-weave",
            "seigaiha",
            "tatami",
            "asanoha",
            "sashiko",
            "komon",
            "kasuri",
            "nishiki",
            "kagome",
            "shoji",
            "shibori",
            "ori",
            "chirimen",
            "celadon-wash",
            "sumi",
            "sumi-grain",
            "kintsugi",
            "ash-grid",
            "ink-dot",
            "mokume",
            "kumo",
            "temari",
            "dusk",
            "embers",
            "obsidian",
            "forge",
            "void",
            "yami",
            "midnight",
            "celadon",
            "aurora-light",
            "kaki-glow",
            "celadon-mist",
            "noctiluca",
            "horizon",
            "sakura",
            "twilight",
            "jade-deep",
            "breathing",
            "aurora-drift",
            "scan",
            "ink-drop",
            "shimmer",
            "pulse",
            "fog",
            "static",
            "glitch",
            "particles",
            "rain",
            "wave-mesh",
            "constellation",
            "fireflies",
            "ink-wash"
          ]
        },
        {
          "name": "paused",
          "type": "boolean",
          "default": "false",
          "description": "— Pausa animaciones CSS (a11y)",
          "attribute": "paused"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Contenido que se renderiza sobre el fondo"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-badge",
    "name": "Badge",
    "slug": "lib-badge",
    "tagName": "lib-badge",
    "description": "Small status label with semantic color variants, dot mode and pill shape.",
    "version": "2.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "status"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "tone",
          "type": "LibBadgeTone",
          "default": "'default'",
          "description": "Tono semántico del badge",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "strong",
            "error",
            "success",
            "warning"
          ]
        },
        {
          "name": "size",
          "type": "LibBadgeSize",
          "default": "'md'",
          "description": "Tamaño del badge",
          "attribute": "size",
          "options": [
            "sm",
            "md"
          ]
        },
        {
          "name": "dot",
          "type": "boolean",
          "default": "false",
          "description": "Muestra un punto indicador de color a la izquierda del texto",
          "attribute": "dot"
        },
        {
          "name": "pill",
          "type": "boolean",
          "default": "false",
          "description": "Aplica border-radius completo (estilo píldora)",
          "attribute": "pill"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido del badge (texto o icono)"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-bar-chart",
    "name": "Bar Chart",
    "slug": "lib-bar-chart",
    "tagName": "lib-bar-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "series",
          "type": "BarSeries[]",
          "default": "[]",
          "description": "— Datos de cada serie. Usar binding `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "categories",
          "type": "string[]",
          "default": "[]",
          "description": "— Etiquetas del eje X. Usar binding `.categories=${...}`.",
          "attribute": "categories"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje Y.",
          "attribute": "y-label"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la rejilla horizontal.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la leyenda cuando hay más de una serie.",
          "attribute": "show-legend"
        },
        {
          "name": "mode",
          "type": "BarChartMode",
          "default": "'grouped'",
          "description": "— 'grouped' (default) | 'stacked'.",
          "attribute": "mode",
          "options": [
            "grouped",
            "stacked"
          ]
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px del gráfico. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-bento-grid",
    "name": "Bento Grid",
    "slug": "lib-bento-grid",
    "tagName": "lib-bento-grid",
    "description": "CSS Grid-based layout system for building bento-style dashboards.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "grid"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "columns",
          "type": "number",
          "default": "4",
          "description": "— Número de columnas (default 4)",
          "attribute": "columns"
        },
        {
          "name": "gap",
          "type": "BentoGapSize",
          "default": "'md'",
          "description": "— Espacio entre celdas: 'xs'|'sm'|'md'(default)|'lg'|'xl'",
          "attribute": "gap",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "rowHeight",
          "type": "string",
          "default": "'150px'",
          "description": "— Altura base de cada fila (default '150px')",
          "attribute": "row-height"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "lib-bento-item elements"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-bento-item",
    "name": "Bento Item",
    "slug": "lib-bento-item",
    "tagName": "lib-bento-item",
    "description": "Grid cell for use inside lib-bento-grid with configurable column and row span.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "grid"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "cols",
          "type": "number",
          "default": "1",
          "description": "— Columnas que ocupa (default 1)",
          "attribute": "cols"
        },
        {
          "name": "rows",
          "type": "number",
          "default": "1",
          "description": "— Filas que ocupa (default 1)",
          "attribute": "rows"
        },
        {
          "name": "interactive",
          "type": "boolean",
          "default": "false",
          "description": "— Añade hover y cursor pointer",
          "attribute": "interactive"
        },
        {
          "name": "flush",
          "type": "boolean",
          "default": "false",
          "description": "— Elimina el padding interno (para imágenes a sangre)",
          "attribute": "flush"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Contenido de la celda"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-breadcrumb",
    "name": "Breadcrumb",
    "slug": "lib-breadcrumb",
    "tagName": "lib-breadcrumb",
    "description": "Navigation trail showing the current page location within the site hierarchy.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "items",
          "type": "BreadcrumbItem[]",
          "default": "[]",
          "attribute": "items"
        },
        {
          "name": "separator",
          "type": "BreadcrumbSeparator",
          "default": "\"slash\"",
          "attribute": "separator",
          "options": [
            "slash",
            "chevron",
            "dot",
            "line"
          ]
        },
        {
          "name": "size",
          "type": "BreadcrumbSize",
          "default": "\"md\"",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "display",
          "type": "BreadcrumbDisplay",
          "default": "\"default\"",
          "attribute": "display",
          "options": [
            "default",
            "filled",
            "pill"
          ]
        },
        {
          "name": "tone",
          "type": "BreadcrumbTone",
          "default": "\"default\"",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "strong"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "attribute": "dark"
        },
        {
          "name": "maxVisible",
          "type": "number",
          "default": "0",
          "attribute": "max-visible"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-navigate",
          "type": "CustomEvent",
          "description": "Disparado al hacer clic en un crumb con href."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-bubble-chart",
    "name": "Bubble Chart",
    "slug": "lib-bubble-chart",
    "tagName": "lib-bubble-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "series",
          "type": "BubbleSeries[]",
          "default": "[]",
          "description": "— Series con puntos { x, y, size, label? }. `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "''",
          "description": "— Etiqueta del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "''",
          "description": "— Etiqueta del eje Y.",
          "attribute": "y-label"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Rejilla de fondo. Default true.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Leyenda con más de una serie. Default true.",
          "attribute": "show-legend"
        },
        {
          "name": "minRadius",
          "type": "number",
          "default": "4",
          "description": "— Radio mínimo en px. Default 4.",
          "attribute": "min-radius"
        },
        {
          "name": "maxRadius",
          "type": "number",
          "default": "28",
          "description": "— Radio máximo en px. Default 28.",
          "attribute": "max-radius"
        },
        {
          "name": "height",
          "type": "number",
          "default": "360",
          "description": "— Altura en px. Default 360.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-burger",
    "name": "Burger",
    "slug": "lib-burger",
    "tagName": "lib-burger",
    "description": "lib-burger — Botón hamburguesa Shibui (SG-48)",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "theme",
          "type": "BurgerTheme",
          "default": "'filled'",
          "description": "— 'filled' | 'kanji' | 'neutral' | 'framed' | 'inverse' | 'glitch'",
          "attribute": "theme",
          "options": [
            "filled",
            "kanji",
            "neutral",
            "framed",
            "inverse",
            "glitch"
          ]
        },
        {
          "name": "size",
          "type": "BurgerSize",
          "default": "'md'",
          "description": "— 'sm' | 'md' | 'lg'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— estado abierto/cerrado (refleja en atributo)",
          "attribute": "open"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "— texto opcional junto al botón ('menú' / labelOpen)",
          "attribute": "label"
        },
        {
          "name": "labelOpen",
          "type": "string",
          "default": "'cerrar'",
          "description": "— texto en estado abierto (default: 'cerrar')",
          "attribute": "label-open"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "'Menú'",
          "description": "— aria-label del button (default: 'Menú')",
          "attribute": "aria-label"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-burger-change",
          "type": "CustomEvent",
          "description": "— { detail: { open: boolean } }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-button",
    "name": "Button",
    "slug": "lib-button",
    "tagName": "lib-button",
    "description": "A versatile button component supporting primary, secondary, ghost and danger variants, sizes and loading state.",
    "version": "1.3.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "interactive",
      "form",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "variant",
          "type": "\"primary\" | \"secondary\" | \"ghost\" | \"accent\" | \"danger\"",
          "default": "'primary'",
          "attribute": "variant",
          "options": [
            "primary",
            "secondary",
            "ghost",
            "accent",
            "danger"
          ]
        },
        {
          "name": "size",
          "type": "\"sm\" | \"md\" | \"lg\" | \"xl\"",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "attribute": "disabled"
        },
        {
          "name": "glass",
          "type": "boolean",
          "default": "false",
          "attribute": "glass"
        },
        {
          "name": "spotlight",
          "type": "boolean",
          "default": "false",
          "attribute": "spotlight"
        },
        {
          "name": "type",
          "type": "'button' | 'submit' | 'reset'",
          "default": "'button'",
          "attribute": "type",
          "options": [
            "button",
            "submit",
            "reset"
          ]
        },
        {
          "name": "customPadding",
          "type": "string",
          "default": "''",
          "attribute": "custom-padding"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "''",
          "attribute": "aria-label"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-click",
          "type": "CustomEvent",
          "description": "Evento personalizado disparado al hacer clic."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-button-group",
    "name": "Button Group",
    "slug": "lib-button-group",
    "tagName": "lib-button-group",
    "description": "Container that groups related buttons with shared border treatment.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "shape",
          "type": "ButtonGroupShape",
          "default": "'flat'",
          "description": "Forma de los extremos del grupo",
          "attribute": "shape",
          "options": [
            "flat",
            "rounded",
            "pill"
          ]
        },
        {
          "name": "orientation",
          "type": "ButtonGroupOrientation",
          "default": "'horizontal'",
          "description": "Orientación del grupo",
          "attribute": "orientation",
          "options": [
            "horizontal",
            "vertical"
          ]
        },
        {
          "name": "block",
          "type": "boolean",
          "default": "false",
          "description": "Ancho completo",
          "attribute": "block"
        },
        {
          "name": "toggle",
          "type": "boolean",
          "default": "false",
          "description": "Activa comportamiento toggle (click activa/desactiva)",
          "attribute": "toggle"
        },
        {
          "name": "multi",
          "type": "boolean",
          "default": "false",
          "description": "Permite selección múltiple (requiere toggle=true)",
          "attribute": "multi"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "Propaga dark a todos los lib-button hijos",
          "attribute": "dark"
        },
        {
          "name": "gold",
          "type": "boolean",
          "default": "false",
          "description": "Propaga gold (borde dorado fractura) a botones accent adyacentes",
          "attribute": "gold"
        },
        {
          "name": "size",
          "type": "LibSize | undefined",
          "description": "Tamaño propagado a todos los hijos (sin set = no propaga)",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-group-change",
          "type": "CustomEvent"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-button-liquid",
    "name": "Button Liquid",
    "slug": "lib-button-liquid",
    "tagName": "lib-button-liquid",
    "description": "Botón con física de agua en canvas.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "variant",
          "type": "LiquidVariant",
          "default": "'filled'",
          "description": "— 'filled' | 'outlined' | 'accent' | 'info' | 'ghost' | 'error'",
          "attribute": "variant",
          "options": [
            "filled",
            "outlined",
            "accent",
            "info",
            "ghost",
            "error"
          ]
        },
        {
          "name": "size",
          "type": "LiquidSize",
          "default": "'md'",
          "description": "— 'sm' | 'md' | 'lg'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— bloquea interacción y detiene el canvas",
          "attribute": "disabled"
        },
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "description": "— muestra spinner, bloquea interacción",
          "attribute": "loading"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— ajusta colores en surface oscura",
          "attribute": "dark"
        },
        {
          "name": "block",
          "type": "boolean",
          "default": "false",
          "description": "— ancho 100% Slots: default · prefix · suffix",
          "attribute": "block"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-click",
          "type": "CustomEvent",
          "description": "— {detail: { originalEvent: MouseEvent }}"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-button-sep",
    "name": "Button Sep",
    "slug": "lib-button-sep",
    "tagName": "lib-button-sep",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "attribute": "dark"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-button-split",
    "name": "Button Split",
    "slug": "lib-button-split",
    "tagName": "lib-button-split",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "variant",
          "type": "LibButtonVariant",
          "default": "'primary'",
          "attribute": "variant",
          "options": [
            "primary",
            "secondary",
            "ghost",
            "accent",
            "danger"
          ]
        },
        {
          "name": "size",
          "type": "LibSize",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "attribute": "dark"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "attribute": "disabled"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "attribute": "label"
        },
        {
          "name": "items",
          "type": "string",
          "default": "''",
          "description": "JSON array de items: '[{\"label\":\"Publicar\",\"value\":\"publish\"}]'",
          "attribute": "items"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-split-action",
          "type": "CustomEvent"
        },
        {
          "name": "ui-lib-split-select",
          "type": "CustomEvent"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-canvas",
    "name": "Canvas",
    "slug": "lib-canvas",
    "tagName": "lib-canvas",
    "description": "`<lib-canvas>` — wrapper que activa un katachi (形) en su subárbol.\n\nEl atributo `katachi` se refleja como `data-katachi` en el host;\nlas custom properties definidas en `_katachi.css` se propagan a\ntodos los hijos (atraviesan Shadow DOM por herencia).",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "visual"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "katachi",
          "type": "KatachiId | ''",
          "default": "''",
          "attribute": "katachi",
          "options": [
            "shizen",
            "wabi",
            "kintsugi",
            "celadon",
            "sabi",
            "terminal"
          ]
        },
        {
          "name": "display",
          "type": "LibCanvasDisplay",
          "default": "'contents'",
          "attribute": "display",
          "options": [
            "contents",
            "block",
            "flex"
          ]
        },
        {
          "name": "pad",
          "type": "LibCanvasPad",
          "default": "''",
          "attribute": "pad",
          "options": [
            "lg",
            "xl",
            "2xl"
          ]
        },
        {
          "name": "minH",
          "type": "'' | 'screen'",
          "default": "''",
          "attribute": "min-h"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-card",
    "name": "Card",
    "slug": "lib-card",
    "tagName": "lib-card",
    "description": "Flexible container with header, body and footer slots and accent color support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "container"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "variant",
          "type": "LibCardVariant",
          "default": "\"default\"",
          "attribute": "variant",
          "options": [
            "default",
            "inverse",
            "accent",
            "featured"
          ]
        },
        {
          "name": "accentColor",
          "type": "string | undefined",
          "default": "undefined",
          "attribute": "accent-color"
        },
        {
          "name": "kanji",
          "type": "string",
          "default": "\"\"",
          "description": "Carácter kanji decorativo mostrado como marca de agua en la esquina superior derecha",
          "attribute": "kanji"
        },
        {
          "name": "clickable",
          "type": "boolean",
          "default": "false",
          "attribute": "clickable"
        },
        {
          "name": "decoration",
          "type": "string",
          "default": "\"\"",
          "description": "Decoraciones celadon opt-in, separadas por espacio (ej: \"craquelure mist depth\").",
          "attribute": "decoration"
        }
      ],
      "slots": [
        {
          "name": "tag",
          "description": "Etiqueta o metadata en el header (fuente mono, uppercase)."
        },
        {
          "name": "title",
          "description": "Título principal de la card."
        },
        {
          "name": "",
          "description": "Cuerpo de la card (default slot)."
        },
        {
          "name": "footer",
          "description": "Acciones o información en el footer."
        }
      ],
      "events": [
        {
          "name": "ui-lib-card-click",
          "type": "CustomEvent",
          "description": "{ variant, kanji, originalEvent } — solo si `clickable`."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-carousel",
    "name": "Carousel",
    "slug": "lib-carousel",
    "tagName": "lib-carousel",
    "description": "Scrollable content slider with optional navigation arrows.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "mode",
          "type": "LibCarouselMode",
          "default": "'slide'",
          "description": "Mecanismo de transición.\n- slide : desplazamiento horizontal (transform)\n- fade  : crossfade por opacidad",
          "attribute": "mode",
          "options": [
            "slide",
            "fade"
          ]
        },
        {
          "name": "peek",
          "type": "number",
          "default": "1",
          "description": "Número de slides visibles simultáneamente.\npeek=1 (default): carousel estándar.\npeek=3: card carousel con tres columnas.",
          "attribute": "peek"
        },
        {
          "name": "arrows",
          "type": "boolean",
          "default": "true",
          "description": "Muestra flechas de navegación prev/next (solo en modo slide).",
          "attribute": "arrows"
        },
        {
          "name": "dots",
          "type": "boolean",
          "default": "true",
          "description": "Muestra dots de navegación.",
          "attribute": "dots"
        },
        {
          "name": "counter",
          "type": "boolean",
          "default": "false",
          "description": "Muestra contador numérico.",
          "attribute": "counter"
        },
        {
          "name": "loop",
          "type": "boolean",
          "default": "false",
          "description": "Navegación circular (el último slide vuelve al primero).",
          "attribute": "loop"
        },
        {
          "name": "autoplay",
          "type": "number",
          "default": "0",
          "description": "Intervalo de autoplay en milisegundos.\n0 = desactivado (default).",
          "attribute": "autoplay"
        }
      ],
      "slots": [
        {
          "name": "(default)",
          "description": "— slides del carousel"
        },
        {
          "name": "thumbnail",
          "description": "— tira de miniaturas (opcional, modo fade)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-slide-change",
          "type": "CustomEvent",
          "description": "— `{ current: number, total: number }`"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-checkbox",
    "name": "Checkbox",
    "slug": "lib-checkbox",
    "tagName": "lib-checkbox",
    "description": "Checkbox input with support for indeterminate state, labels, sublabels and multiple visual variants.",
    "version": "1.1.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible",
      "input"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "checked",
          "type": "boolean",
          "default": "false",
          "description": "Estado marcado",
          "attribute": "checked"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Estado deshabilitado",
          "attribute": "disabled"
        },
        {
          "name": "indeterminate",
          "type": "boolean",
          "default": "false",
          "description": "Estado indeterminate — seleccion parcial de grupo.\nMuestra un dash en lugar del check.",
          "attribute": "indeterminate"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Texto principal del label",
          "attribute": "label"
        },
        {
          "name": "sublabel",
          "type": "string",
          "default": "''",
          "description": "Texto secundario bajo el label",
          "attribute": "sublabel"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "Valor enviado en el evento change",
          "attribute": "value"
        },
        {
          "name": "size",
          "type": "LibCheckboxSize",
          "default": "'md'",
          "description": "Tamano del checkbox",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tone",
          "type": "LibCheckboxTone",
          "default": "'default'",
          "description": "Tono de color",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "error"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido de label alternativo (cuando no se usa prop label)"
        }
      ],
      "events": [
        {
          "name": "change",
          "type": "CustomEvent",
          "description": "Emitido al cambiar el estado. detail: { checked: boolean, value: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-checkbox-card",
    "name": "Checkbox Card",
    "slug": "lib-checkbox-card",
    "tagName": "lib-checkbox-card",
    "description": "lib-checkbox-card — Tarjeta seleccionable Shibui (SG-57)\n\nLa mecánica de checked se gestiona con CSS puro vía\n`input:checked ~ .cc-body`. El componente solo gestiona\nel estado, el ripple y los eventos.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "checked",
          "type": "boolean",
          "default": "false",
          "description": "— Estado checked (refleja en atributo)",
          "attribute": "checked"
        },
        {
          "name": "inputType",
          "type": "CheckboxCardInputType",
          "default": "'checkbox'",
          "description": "— 'checkbox' | 'radio'",
          "attribute": "input-type",
          "options": [
            "checkbox",
            "radio"
          ]
        },
        {
          "name": "name",
          "type": "string",
          "default": "''",
          "description": "— Nombre del grupo (requerido en radio)",
          "attribute": "name"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "— Valor del input",
          "attribute": "value"
        },
        {
          "name": "tone",
          "type": "CheckboxCardTone",
          "default": "'accent'",
          "description": "— 'accent' | 'info'",
          "attribute": "tone",
          "options": [
            "accent",
            "info"
          ]
        },
        {
          "name": "layout",
          "type": "CheckboxCardLayout",
          "default": "'vertical'",
          "description": "— 'vertical' | 'horizontal' | 'compact'",
          "attribute": "layout",
          "options": [
            "vertical",
            "horizontal",
            "compact"
          ]
        },
        {
          "name": "cardTitle",
          "type": "string",
          "default": "''",
          "description": "— Título (alternativa a slot)",
          "attribute": "card-title"
        },
        {
          "name": "desc",
          "type": "string",
          "default": "''",
          "description": "— Descripción (alternativa a slot)",
          "attribute": "desc"
        },
        {
          "name": "checkShape",
          "type": "'square' | 'pill'",
          "default": "'square'",
          "description": "— 'square' | 'pill'",
          "attribute": "check-shape",
          "options": [
            "square",
            "pill"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Surface oscura",
          "attribute": "dark"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Estado deshabilitado",
          "attribute": "disabled"
        },
        {
          "name": "error",
          "type": "boolean",
          "default": "false",
          "description": "— Estado de error",
          "attribute": "error"
        },
        {
          "name": "image",
          "type": "boolean",
          "default": "false",
          "description": "— Modo imagen (sin padding en .cc-body)",
          "attribute": "image"
        }
      ],
      "slots": [
        {
          "name": "icon",
          "description": "— Icono SVG o imagen"
        },
        {
          "name": "badge",
          "description": "— Badge/etiqueta"
        },
        {
          "name": "title",
          "description": "— Título (sobreescribe card-title prop)"
        },
        {
          "name": "desc",
          "description": "— Descripción (sobreescribe desc prop)"
        },
        {
          "name": "price",
          "description": "— Bloque de precio"
        },
        {
          "name": "divider",
          "description": "— Línea divisoria"
        },
        {
          "name": "features",
          "description": "— Lista de características"
        },
        {
          "name": "image",
          "description": "— Imagen con aspect-ratio 16/9"
        },
        {
          "name": "—",
          "description": "Contenido libre"
        }
      ],
      "events": [
        {
          "name": "ui-lib-checkbox-card-change",
          "type": "CustomEvent",
          "description": "— { detail: { checked: boolean, value: string } }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-chip",
    "name": "Chip",
    "slug": "lib-chip",
    "tagName": "lib-chip",
    "description": "Compact element representing an attribute or action, with removable and selectable modes.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "kind",
          "type": "ChipKind",
          "default": "'static'",
          "description": "— 'static' | 'toggle' | 'input'",
          "attribute": "kind",
          "options": [
            "static",
            "toggle",
            "input"
          ]
        },
        {
          "name": "size",
          "type": "ChipSize",
          "default": "'md'",
          "description": "— 'xs' | 'sm' | 'md' | 'lg'",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tone",
          "type": "ChipTone",
          "default": "'default'",
          "description": "— 'default' | 'accent' | 'info' | 'error' | 'strong'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error",
            "strong"
          ]
        },
        {
          "name": "selected",
          "type": "boolean",
          "default": "false",
          "description": "— Estado seleccionado (solo kind=toggle)",
          "attribute": "selected"
        },
        {
          "name": "dot",
          "type": "boolean",
          "default": "false",
          "description": "— Dot de color antes del texto",
          "attribute": "dot"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "''",
          "description": "— Texto accesible del chip",
          "attribute": "aria-label"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Texto/label del chip"
        },
        {
          "name": "icon",
          "description": "— Icono a la izquierda del texto"
        },
        {
          "name": "avatar",
          "description": "— Avatar circular (solo kind=input, opcionalmente static)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-chip-toggle",
          "type": "CustomEvent",
          "description": "— { detail: { selected: boolean } }  (kind=toggle)"
        },
        {
          "name": "ui-lib-chip-remove",
          "type": "CustomEvent",
          "description": "— { detail: {} }                     (kind=input)"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-close-button",
    "name": "Close Button",
    "slug": "lib-close-button",
    "tagName": "lib-close-button",
    "description": "Compact icon-only button designed for dismissing dialogs, toasts and overlays.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "interactive",
      "icon"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "variant",
          "type": "LibCloseVariant",
          "default": "'ghost'",
          "description": "Variante visual",
          "attribute": "variant",
          "options": [
            "ghost",
            "subtle",
            "outlined",
            "filled",
            "filled-round",
            "error",
            "on-dark"
          ]
        },
        {
          "name": "size",
          "type": "LibCloseSize",
          "default": "'md'",
          "description": "Tamaño: sm (24px) · md (32px) · lg (40px) · xl (48px)",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "icon",
          "type": "LibCloseIcon",
          "default": "'x'",
          "description": "Icono Phosphor a mostrar.\nx → simple · x-circle → con circulo · x-square → con cuadrado",
          "attribute": "icon",
          "options": [
            "x",
            "x-circle",
            "x-square"
          ]
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Estado deshabilitado",
          "attribute": "disabled"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "'Cerrar'",
          "description": "Texto accesible del boton",
          "attribute": "aria-label"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "lib-close",
          "type": "CustomEvent",
          "description": "Emitido al hacer click. Sin detail."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-code-block",
    "name": "Code Block",
    "slug": "lib-code-block",
    "tagName": "lib-code-block",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "code",
          "type": "string",
          "default": "''",
          "description": "Código a mostrar como texto plano",
          "attribute": "code"
        },
        {
          "name": "language",
          "type": "LibCodeBlockLanguage",
          "default": "'bash'",
          "description": "Etiqueta de lenguaje mostrada en el header (decorativa)",
          "attribute": "language",
          "options": [
            "bash",
            "ts",
            "js",
            "html",
            "css",
            "json",
            "text"
          ]
        },
        {
          "name": "filename",
          "type": "string",
          "default": "''",
          "description": "Nombre de fichero opcional mostrado en el header",
          "attribute": "filename"
        },
        {
          "name": "copyable",
          "type": "boolean",
          "default": "true",
          "description": "Muestra u oculta el botón de copiar",
          "attribute": "copyable"
        },
        {
          "name": "variant",
          "type": "LibCodeBlockVariant",
          "default": "'default'",
          "description": "Variante visual: default (oscuro) | ghost (claro)",
          "attribute": "variant",
          "options": [
            "default",
            "ghost"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Código a mostrar. Si se usa este slot, tiene prioridad sobre el atributo `code`."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-color-picker",
    "name": "Color Picker",
    "slug": "lib-color-picker",
    "tagName": "lib-color-picker",
    "description": "Color picker input with hex value output and label support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "input"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "string",
          "default": "'#B85A1E'",
          "description": "— Color inicial en HEX (#RRGGBB)",
          "attribute": "value"
        },
        {
          "name": "display",
          "type": "ColorPickerDisplay",
          "default": "'inline'",
          "description": "— inline · trigger (default: inline)",
          "attribute": "display",
          "options": [
            "inline",
            "trigger"
          ]
        },
        {
          "name": "showAlpha",
          "type": "boolean",
          "default": "false",
          "attribute": "show-alpha"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Modo oscuro",
          "attribute": "dark"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Desactivado",
          "attribute": "disabled"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "— Texto del trigger (variant=trigger)",
          "attribute": "label"
        },
        {
          "name": "saved",
          "type": "string",
          "default": "''",
          "description": "— Colores guardados iniciales (JSON array)",
          "attribute": "saved"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-apply",
          "type": "CustomEvent",
          "description": "— Igual a change pero solo al pulsar \"Aplicar\""
        },
        {
          "name": "ui-lib-change",
          "type": "CustomEvent",
          "description": "— {detail: {value: string, hex: string, r, g, b, h, s, l, alpha}}"
        },
        {
          "name": "ui-lib-swatch-click",
          "description": "— {detail: {value: string, name?: string}} al clickar un swatch"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-color-scale",
    "name": "Color Scale",
    "slug": "lib-color-scale",
    "tagName": "lib-color-scale",
    "description": "lib-color-scale — Shibui UI\n\nEscala de color horizontal con 11 pasos (50 → 950).\nCada swatch expande en hover y revela el número del paso.\nLos extremos muestran el nombre y el valor hex.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "name",
          "type": "string",
          "default": "'scale'",
          "description": "— Nombre de la paleta (ej: \"washi\", \"kaki\").",
          "attribute": "name"
        },
        {
          "name": "steps",
          "type": "ColorStep[]",
          "default": "[]",
          "description": "— Array de pasos de la escala. Orden de izquierda a derecha.",
          "attribute": "steps"
        },
        {
          "name": "showLabels",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra las etiquetas de los extremos (activo por defecto).",
          "attribute": "show-labels"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-color-swatches",
    "name": "Color Swatches",
    "slug": "lib-color-swatches",
    "tagName": "lib-color-swatches",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "attribute": "dark"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "— Color seleccionado (hex)",
          "attribute": "value"
        },
        {
          "name": "rowsJson",
          "type": "string",
          "default": "''",
          "attribute": "rowsJson"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-swatch-click",
          "type": "CustomEvent",
          "description": "— {detail: {value, name}}"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-combo-chart",
    "name": "Combo Chart",
    "slug": "lib-combo-chart",
    "tagName": "lib-combo-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "categories",
          "type": "string[]",
          "default": "[]",
          "description": "— Etiquetas del eje X. `.categories=${...}`.",
          "attribute": "categories"
        },
        {
          "name": "barSeries",
          "type": "ChartSeries[]",
          "default": "[]",
          "description": "— Series de barras (agrupadas). `.barSeries=${...}`.",
          "attribute": "barSeries"
        },
        {
          "name": "lineSeries",
          "type": "ChartSeries[]",
          "default": "[]",
          "description": "— Series de línea. `.lineSeries=${...}`.",
          "attribute": "lineSeries"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje Y izquierdo.",
          "attribute": "y-label"
        },
        {
          "name": "yLabelRight",
          "type": "string",
          "default": "''",
          "attribute": "y-label-right"
        },
        {
          "name": "dualAxis",
          "type": "boolean",
          "default": "false",
          "description": "— Eje Y independiente para las líneas. Default false.",
          "attribute": "dual-axis"
        },
        {
          "name": "smooth",
          "type": "boolean",
          "default": "false",
          "description": "— Suaviza las líneas.",
          "attribute": "smooth"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Rejilla de fondo. Default true.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Leyenda. Default true.",
          "attribute": "show-legend"
        },
        {
          "name": "height",
          "type": "number",
          "default": "340",
          "description": "— Altura en px. Default 340.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-component-grid",
    "name": "Component Grid",
    "slug": "lib-component-grid",
    "tagName": "lib-component-grid",
    "description": "`<lib-component-grid>` — Grid contenedor de `<lib-component-card>`.\n\nGestiona el layout CSS Grid y aplica automáticamente `grid-column: span 2`\na las tarjetas con el atributo `featured`.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [],
      "slots": [
        {
          "name": "",
          "description": "Acepta uno o más `<lib-component-card>`."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-content-pillar",
    "name": "Content Pillar",
    "slug": "lib-content-pillar",
    "tagName": "lib-content-pillar",
    "description": "`<lib-content-pillar>` — Pilar filosófico con kanji, label y descripción.\n\nPatrón recurrente del sistema Shibui: kanji decorativo a la izquierda +\netiqueta en DM Mono + cuerpo de texto en Shippori Mincho.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "kanji",
          "type": "string",
          "default": "''",
          "description": "Carácter kanji decorativo",
          "attribute": "kanji"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Etiqueta en DM Mono uppercase",
          "attribute": "label"
        },
        {
          "name": "description",
          "type": "string",
          "default": "''",
          "description": "Descripción inline (alternativa al slot)",
          "attribute": "description"
        },
        {
          "name": "surface",
          "type": "'dark' | 'light'",
          "default": "'dark'",
          "description": "Superficie de fondo",
          "attribute": "surface",
          "options": [
            "dark",
            "light"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Descripción como rich content (alternativa al atributo `description`)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-copy-button",
    "name": "Copy Button",
    "slug": "lib-copy-button",
    "tagName": "lib-copy-button",
    "description": "Button that copies a value to the clipboard with visual feedback and customizable labels.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "interactive",
      "clipboard"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "Texto que se copia al portapapeles",
          "attribute": "value"
        },
        {
          "name": "variant",
          "type": "LibCopyVariant",
          "default": "'ghost'",
          "description": "Variante visual",
          "attribute": "variant",
          "options": [
            "ghost",
            "outlined",
            "filled",
            "subtle",
            "on-dark"
          ]
        },
        {
          "name": "size",
          "type": "LibCopySize",
          "default": "'md'",
          "description": "Tamaño",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "iconOnly",
          "type": "boolean",
          "default": "false",
          "description": "Modo icono-solo (sin label, cuadrado)",
          "attribute": "icon-only"
        },
        {
          "name": "label",
          "type": "string",
          "default": "'Copiar'",
          "description": "Label en estado idle",
          "attribute": "label"
        },
        {
          "name": "successLabel",
          "type": "string",
          "default": "'Copiado'",
          "description": "Label en estado copiado",
          "attribute": "success-label"
        },
        {
          "name": "tooltip",
          "type": "boolean",
          "default": "false",
          "description": "Muestra un tooltip \"Copiado\" al copiar",
          "attribute": "tooltip"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Estado deshabilitado",
          "attribute": "disabled"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "lib-copy",
          "type": "CustomEvent",
          "description": "Emitido al copiar con exito. detail: { value: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-counter",
    "name": "Counter",
    "slug": "lib-counter",
    "tagName": "lib-counter",
    "description": "Animated number counter with configurable duration, prefix and suffix.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "animation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "description": "Valor numérico a mostrar.",
          "attribute": "value"
        },
        {
          "name": "prefix",
          "type": "string",
          "default": "''",
          "description": "Carácter prefijo (€, $, …).",
          "attribute": "prefix"
        },
        {
          "name": "suffix",
          "type": "string",
          "default": "''",
          "description": "Carácter sufijo (%, k, …).",
          "attribute": "suffix"
        },
        {
          "name": "thousands",
          "type": "string",
          "default": "'.'",
          "description": "Separador de miles. Default: punto. Vacío = sin separador.",
          "attribute": "thousands"
        },
        {
          "name": "decimals",
          "type": "number | null",
          "default": "null",
          "description": "Dígitos decimales a mostrar después de coma.\nEjemplo: decimals=\"73\" → \",73\"",
          "attribute": "decimals"
        },
        {
          "name": "size",
          "type": "LibCounterSize",
          "default": "'md'",
          "description": "Tamaño del contador.",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "tone",
          "type": "LibCounterTone",
          "default": "'default'",
          "description": "Tono de color.",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error",
            "muted"
          ]
        },
        {
          "name": "surface",
          "type": "LibSurface",
          "default": "'default'",
          "description": "Superficie/contexto (p.ej. 'dark' para fondos oscuros).",
          "attribute": "surface",
          "options": [
            "default",
            "light",
            "dark",
            "inverse"
          ]
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Etiqueta inferior en font-mono uppercase.",
          "attribute": "label"
        },
        {
          "name": "delta",
          "type": "string",
          "default": "''",
          "description": "Texto del indicador de variación (e.g. \"+14,7%\").",
          "attribute": "delta"
        },
        {
          "name": "deltaDir",
          "type": "LibCounterDeltaDir",
          "default": "'up'",
          "description": "Dirección del delta — controla color e icono.",
          "attribute": "delta-dir",
          "options": [
            "up",
            "down",
            "flat"
          ]
        },
        {
          "name": "playOnVisible",
          "type": "boolean",
          "default": "false",
          "description": "Si está presente, el contador arranca desde 0 y anima\nhasta `value` cuando entra en el viewport (IntersectionObserver).\nNombre: play-on-visible (evita colisión con HTMLElement.animate).",
          "attribute": "play-on-visible"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-cursor-follower",
    "name": "Cursor Follower",
    "slug": "lib-cursor-follower",
    "tagName": "lib-cursor-follower",
    "description": "Custom cursor that smoothly follows the mouse with configurable lerp interpolation.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "mode",
          "type": "CursorMode",
          "default": "'filled'",
          "description": "— filled · minimal · accent · ghost (default: 'filled')",
          "attribute": "mode",
          "options": [
            "filled",
            "minimal",
            "accent",
            "ghost"
          ]
        },
        {
          "name": "lerp",
          "type": "number",
          "default": "0",
          "description": "— Factor de interpolación del ring 0–1 (override del modo)",
          "attribute": "lerp"
        },
        {
          "name": "trail",
          "type": "boolean",
          "default": "false",
          "description": "— Activa la cola de tinta al mover rápido",
          "attribute": "trail"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-data-table",
    "name": "Data Table",
    "slug": "lib-data-table",
    "tagName": "lib-data-table",
    "description": "Feature-rich data table with configurable columns, data binding and loading state.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "columns",
          "type": "TableColumn[]",
          "default": "[]",
          "description": "Definición de columnas",
          "attribute": "columns"
        },
        {
          "name": "data",
          "type": "TableRowData[]",
          "default": "[]",
          "description": "Dataset de filas",
          "attribute": "data"
        },
        {
          "name": "display",
          "type": "TableDisplay",
          "default": "'lines'",
          "description": "lines | grid | striped | borderless",
          "attribute": "display",
          "options": [
            "lines",
            "grid",
            "striped",
            "borderless"
          ]
        },
        {
          "name": "size",
          "type": "TableSize",
          "default": "'md'",
          "description": "sm | md | lg",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "Superficie oscura",
          "attribute": "dark"
        },
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "description": "Muestra skeleton de carga",
          "attribute": "loading"
        },
        {
          "name": "selectable",
          "type": "boolean",
          "default": "false",
          "description": "Columna de checkboxes",
          "attribute": "selectable"
        },
        {
          "name": "stickyHead",
          "type": "boolean",
          "default": "false",
          "description": "Cabecera sticky (max-height 380px)",
          "attribute": "sticky-head"
        },
        {
          "name": "caption",
          "type": "string",
          "default": "''",
          "description": "Título accesible de la tabla",
          "attribute": "caption"
        },
        {
          "name": "emptyTitle",
          "type": "string",
          "default": "'Sin resultados'",
          "description": "Título del estado vacío",
          "attribute": "empty-title"
        },
        {
          "name": "emptyDesc",
          "type": "string",
          "default": "'Ningún elemento coincide con los filtros activos'",
          "description": "Descripción del estado vacío",
          "attribute": "empty-desc"
        },
        {
          "name": "toolbar",
          "type": "boolean",
          "default": "false",
          "description": "Muestra barra de herramientas",
          "attribute": "toolbar"
        },
        {
          "name": "toolbarTitle",
          "type": "string",
          "default": "''",
          "description": "Título de la toolbar",
          "attribute": "toolbar-title"
        },
        {
          "name": "pageSize",
          "type": "number",
          "default": "0",
          "description": "Filas por página (0 = sin paginación)",
          "attribute": "page-size"
        },
        {
          "name": "page",
          "type": "number",
          "default": "1",
          "description": "Página activa (1-indexed, reflected)",
          "attribute": "page"
        },
        {
          "name": "skeletonRows",
          "type": "number",
          "default": "3",
          "description": "Número de filas skeleton (default: 3)",
          "attribute": "skeleton-rows"
        }
      ],
      "slots": [
        {
          "name": "toolbar-actions",
          "description": "Botones/acciones extra en la toolbar"
        },
        {
          "name": "pagination",
          "description": "Paginación externa (si no se usa page-size)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-table-sort",
          "type": "CustomEvent",
          "description": "{ key, dir }"
        },
        {
          "name": "ui-lib-table-filter",
          "type": "CustomEvent",
          "description": "{ query }"
        },
        {
          "name": "ui-lib-table-row-action",
          "type": "CustomEvent",
          "description": "{ row, index }"
        },
        {
          "name": "ui-lib-table-select",
          "type": "CustomEvent",
          "description": "{ indices, rows }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-dialog",
    "name": "Dialog",
    "slug": "lib-dialog",
    "tagName": "lib-dialog",
    "description": "Lightweight confirmation dialog with title and slot-based content.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "accessible",
      "overlay"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "eyebrow",
          "type": "string",
          "default": "''",
          "description": "— Texto pequeño encima del título",
          "attribute": "eyebrow"
        },
        {
          "name": "dlgTitle",
          "type": "string",
          "default": "''",
          "description": "`title` está reservado en HTMLElement — usamos `dlgTitle` + attribute `dlg-title`.",
          "attribute": "dlg-title"
        },
        {
          "name": "variant",
          "type": "DialogVariant",
          "default": "'default'",
          "description": "— default · danger · warning · dark",
          "attribute": "variant",
          "options": [
            "default",
            "error",
            "warning",
            "dark"
          ]
        },
        {
          "name": "size",
          "type": "DialogSize",
          "default": "'md'",
          "description": "— sm · md · lg · xl · full (default: md)",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg",
            "xl",
            "full"
          ]
        },
        {
          "name": "layout",
          "type": "DialogLayout",
          "default": "'dialog'",
          "description": "— dialog · drawer-right · drawer-bottom · alert (default: dialog)",
          "attribute": "layout",
          "options": [
            "dialog",
            "drawer-right",
            "drawer-bottom",
            "alert"
          ]
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— Estado controlado del panel",
          "attribute": "open"
        },
        {
          "name": "footerMeta",
          "type": "string",
          "default": "''",
          "description": "— Texto auxiliar izquierdo en el footer",
          "attribute": "footer-meta"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Cuerpo del dialog (dlg-body)"
        },
        {
          "name": "header",
          "description": "— Override completo del título (dentro de dlg-header-text)"
        },
        {
          "name": "footer",
          "description": "— Botones del footer (a la derecha del footer-meta)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-dialog-close",
          "type": "CustomEvent",
          "description": "— Emitido tras la animación de cierre (bubbles, composed)"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-display-heading",
    "name": "Display Heading",
    "slug": "lib-display-heading",
    "tagName": "lib-display-heading",
    "description": "`<lib-display-heading>` — Titular de display editorial.\n\nHeading en Cormorant Garamond con peso 300 y acento itálico en kaki.\nPatrón recurrente del sistema: primera línea normal + segunda línea con\ntexto itálico en `--color-kaki-400`. Acepta un `<lib-eyebrow>` por slot.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "line1",
          "type": "string",
          "default": "''",
          "description": "Primera línea del titular",
          "attribute": "line1"
        },
        {
          "name": "line2Prefix",
          "type": "string",
          "default": "''",
          "description": "Texto antes del acento en la segunda línea",
          "attribute": "line2-prefix"
        },
        {
          "name": "accent",
          "type": "string",
          "default": "''",
          "description": "Texto en itálica kaki",
          "attribute": "accent"
        },
        {
          "name": "description",
          "type": "string",
          "default": "''",
          "description": "Párrafo de descripción inline",
          "attribute": "description"
        },
        {
          "name": "surface",
          "type": "DisplayHeadingSurface",
          "default": "'light'",
          "description": "Superficie sobre la que aparece",
          "attribute": "surface",
          "options": [
            "default",
            "light",
            "dark"
          ]
        },
        {
          "name": "size",
          "type": "DisplayHeadingSize",
          "default": "'md'",
          "description": "Tamaño tipográfico fluido",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tag",
          "type": "DisplayHeadingTag",
          "default": "'h2'",
          "description": "Tag semántico del heading",
          "attribute": "tag",
          "options": [
            "h1",
            "h2",
            "h3",
            "h4"
          ]
        },
        {
          "name": "centered",
          "type": "boolean",
          "default": "false",
          "description": "Centra el bloque",
          "attribute": "centered"
        }
      ],
      "slots": [
        {
          "name": "eyebrow",
          "description": "Acepta un `<lib-eyebrow>` como prefijo."
        },
        {
          "name": "description",
          "description": "Descripción como rich content (alternativa a `description`)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-divider",
    "name": "Divider",
    "slug": "lib-divider",
    "tagName": "lib-divider",
    "description": "Horizontal or vertical separator with optional label and ornament.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "orientation",
          "type": "LibDividerOrientation",
          "default": "'horizontal'",
          "description": "Dirección del separador",
          "attribute": "orientation",
          "options": [
            "horizontal",
            "vertical"
          ]
        },
        {
          "name": "styleVariant",
          "type": "LibDividerStyle",
          "default": "'hairline'",
          "description": "Estilo de la línea.\nNota: el atributo es `style-variant` para no colisionar\ncon el atributo nativo `style` del DOM.",
          "attribute": "style-variant",
          "options": [
            "hairline",
            "default",
            "strong",
            "heavy",
            "dashed",
            "dotted",
            "gradient"
          ]
        },
        {
          "name": "tone",
          "type": "LibDividerTone",
          "default": "'default'",
          "description": "Tono de acento de la línea",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "align",
          "type": "LibDividerAlign",
          "default": "'center'",
          "description": "Alineación del label u ornamento.\n`left` y `right` acortan el segmento opuesto a 24px.",
          "attribute": "align",
          "options": [
            "left",
            "center",
            "right"
          ]
        },
        {
          "name": "ornament",
          "type": "LibDividerOrnament",
          "default": "'none'",
          "description": "Ornamento visual entre las líneas.\nToma prioridad sobre el contenido del slot si ambos están presentes.",
          "attribute": "ornament",
          "options": [
            "none",
            "dot",
            "diamond"
          ]
        },
        {
          "name": "labelStyle",
          "type": "LibDividerLabelStyle",
          "default": "'mono'",
          "description": "Tipografía del label slotado",
          "attribute": "label-style",
          "options": [
            "mono",
            "display",
            "kanji"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Texto o elemento entre las dos líneas (label)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-drawer",
    "name": "Drawer",
    "slug": "lib-drawer",
    "tagName": "lib-drawer",
    "description": "Side panel overlay with configurable placement (top, right, bottom, left).",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "accessible",
      "overlay"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— Abre / cierra el drawer",
          "attribute": "open"
        },
        {
          "name": "placement",
          "type": "DrawerPlacement",
          "default": "'right'",
          "description": "— 'right'(default) | 'left' | 'top' | 'bottom'",
          "attribute": "placement",
          "options": [
            "right",
            "left",
            "top",
            "bottom"
          ]
        },
        {
          "name": "size",
          "type": "DrawerSize",
          "default": "'md'",
          "description": "— 'sm' | 'md'(default) | 'lg' | 'xl' | 'full'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg",
            "xl",
            "full"
          ]
        },
        {
          "name": "theme",
          "type": "DrawerTheme",
          "default": "'default'",
          "description": "— 'default' | 'dark' | 'inverse' | 'inverse-dark' | 'glitch' | 'glitch-dark'",
          "attribute": "theme",
          "options": [
            "default",
            "dark",
            "inverse",
            "inverse-dark",
            "glitch",
            "glitch-dark"
          ]
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "— Texto del título (también rellenable via slot[name=\"title\"])",
          "attribute": "label"
        },
        {
          "name": "eyebrow",
          "type": "string",
          "default": "''",
          "description": "— Texto del eyebrow (también via slot[name=\"eyebrow\"])",
          "attribute": "eyebrow"
        },
        {
          "name": "subtitle",
          "type": "string",
          "default": "''",
          "description": "— Texto del subtítulo (también via slot[name=\"subtitle\"])",
          "attribute": "subtitle"
        },
        {
          "name": "drawerLabel",
          "type": "string",
          "default": "''",
          "description": "— Aria-label del dialog (default = label)",
          "attribute": "drawer-label"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Contenido del body"
        },
        {
          "name": "title",
          "description": "— Reemplaza el título"
        },
        {
          "name": "eyebrow",
          "description": "— Reemplaza el eyebrow"
        },
        {
          "name": "subtitle",
          "description": "— Reemplaza el subtítulo"
        },
        {
          "name": "footer",
          "description": "— Botones de pie (oculto si vacío)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-drawer-close",
          "type": "CustomEvent",
          "description": "— Cuando el drawer se cierra (backdrop, Escape, botón X)"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-dropdown",
    "name": "Dropdown",
    "slug": "lib-dropdown",
    "tagName": "lib-dropdown",
    "description": "Toggleable menu anchored to a trigger element.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "'Opciones'",
          "description": "— Texto del trigger (si no hay slot \"trigger\")",
          "attribute": "label"
        },
        {
          "name": "variant",
          "type": "DropdownTriggerVariant",
          "default": "'default'",
          "description": "— 'default' | 'ghost' | 'filled' | 'accent'",
          "attribute": "variant",
          "options": [
            "default",
            "ghost",
            "filled",
            "accent"
          ]
        },
        {
          "name": "align",
          "type": "DropdownAlign",
          "default": "'left'",
          "description": "— 'left' (default) | 'right'",
          "attribute": "align",
          "options": [
            "left",
            "right"
          ]
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— Estado abierto (refleja en atributo)",
          "attribute": "open"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Menú con tema oscuro",
          "attribute": "dark"
        },
        {
          "name": "minWidth",
          "type": "string",
          "default": "''",
          "description": "— Ancho mínimo del panel (e.g. '240px')",
          "attribute": "min-width"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "''",
          "description": "— aria-label del trigger (fallback: label)",
          "attribute": "aria-label"
        }
      ],
      "slots": [
        {
          "name": "trigger",
          "description": "— Contenido personalizado del botón (reemplaza `label`)"
        },
        {
          "name": "header",
          "description": "— Cabecera del panel (búsqueda, título)"
        },
        {
          "name": "—",
          "description": "Items del menú (.dd-item, .dd-sep, .dd-group-label)"
        },
        {
          "name": "footer",
          "description": "— Pie del panel (acciones de confirmación) ─── Clases de item (light DOM, sin shadow) ───────────────── .dd-item           — fila de acción (button o a) .dd-item.is-active — seleccionado .dd-item.is-danger — acción destructiva .dd-item.is-disabled — no interactivo .dd-sep            — separador horizontal (div o hr) .dd-group-label    — etiqueta de sección (div o span) ─── Clases internas de item (requieren CSS global) ───────── .dd-item-icon      — icono a la izquierda .dd-item-body      — wrapper para label + desc de dos líneas .dd-item-label     — primera línea del body .dd-item-desc      — segunda línea (mono, muted) .dd-item-hint      — shortcut a la derecha (margin-left:auto) .dd-item-check     — check de selección (opacity:0 por defecto)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-dropdown-toggle",
          "type": "CustomEvent",
          "description": "— { detail: { open: boolean } }"
        },
        {
          "name": "ui-lib-dropdown-item",
          "description": "— { detail: { target: HTMLElement } }  al activar un item"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-editor-toolbar",
    "name": "Editor Toolbar",
    "slug": "lib-editor-toolbar",
    "tagName": "lib-editor-toolbar",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "filename",
          "type": "string",
          "default": "''",
          "description": "— Nombre del fichero activo. Vacío → \"Sin título\".",
          "attribute": "filename"
        },
        {
          "name": "dirty",
          "type": "boolean",
          "default": "false",
          "description": "— Indica cambios sin guardar (muestra `·` en el nombre).",
          "attribute": "dirty"
        },
        {
          "name": "saving",
          "type": "boolean",
          "default": "false",
          "description": "— Estado de guardado en curso (deshabilita el botón Save).",
          "attribute": "saving"
        },
        {
          "name": "showOpen",
          "type": "boolean",
          "default": "false",
          "description": "Muestra el botón \"Abrir fichero\".",
          "attribute": "show-open"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-editor-toolbar-new",
          "type": "CustomEvent",
          "description": "— El usuario pide crear un fichero nuevo."
        },
        {
          "name": "ui-lib-editor-toolbar-open",
          "type": "CustomEvent",
          "description": "— El usuario pide abrir un fichero."
        },
        {
          "name": "ui-lib-editor-toolbar-save",
          "type": "CustomEvent",
          "description": "— El usuario pide guardar el fichero activo."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-empty-state",
    "name": "Empty State",
    "slug": "lib-empty-state",
    "tagName": "lib-empty-state",
    "description": "Placeholder UI for empty lists or zero-data scenarios with title and description.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "heading",
          "type": "string",
          "default": "''",
          "description": "Título principal del estado vacío.\nSe usa `heading` en lugar de `title` para evitar colisión con `HTMLElement.title`.",
          "attribute": "heading"
        },
        {
          "name": "description",
          "type": "string",
          "default": "''",
          "description": "Texto descriptivo secundario bajo el título.",
          "attribute": "description"
        },
        {
          "name": "kanji",
          "type": "string",
          "default": "''",
          "description": "Carácter kanji como ilustración tipográfica (ej: 無, 空, 迷).\nCuando se especifica, sustituye al slot `illustration`.",
          "attribute": "kanji"
        },
        {
          "name": "tone",
          "type": "LibEmptyStateTone",
          "default": "'default'",
          "description": "Tono cromático del icono.\n- neutral (default): washi\n- accent: cálido, primer uso, atención\n- info: completado, éxito\n- error: fallo, acceso denegado",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "layout",
          "type": "LibEmptyStateLayout",
          "default": "'default'",
          "description": "Disposición del componente.\n- default: columna centrada (pantallas, modales, paneles)\n- inline: fila con icono a la izquierda (tablas, banners)",
          "attribute": "layout",
          "options": [
            "default",
            "inline"
          ]
        },
        {
          "name": "size",
          "type": "LibEmptyStateSize",
          "default": "'md'",
          "description": "Tamaño del componente.\n- md (default): padding generoso, icono 72px\n- sm: compacto para sidebars y paneles secundarios",
          "attribute": "size",
          "options": [
            "sm",
            "md"
          ]
        },
        {
          "name": "bordered",
          "type": "boolean",
          "default": "false",
          "description": "Borde punteado + fondo `bg-surface`. Para zonas drop o sin contenido explícito.",
          "attribute": "bordered"
        },
        {
          "name": "ghost",
          "type": "boolean",
          "default": "false",
          "description": "Elimina el fondo y borde del icono. Para contextos de mínimo ruido visual.",
          "attribute": "ghost"
        }
      ],
      "slots": [
        {
          "name": "illustration",
          "description": "— Icono Phosphor (o cualquier elemento visual)"
        },
        {
          "name": "actions",
          "description": "— Botones de acción (lib-button u otros)"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-eyebrow",
    "name": "Eyebrow",
    "slug": "lib-eyebrow",
    "tagName": "lib-eyebrow",
    "description": "`<lib-eyebrow>` — Etiqueta introductoria previa a un titular.\n\nElemento de texto en DM Mono muy pequeño con línea decorativa de gradiente.\nEl color y los efectos se adaptan automáticamente al katachi activo en el ancestro:\nen kintsugi el acento es dorado, en terminal el drift se activa por contexto, etc.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "tone",
          "type": "EyebrowTone",
          "default": "'accent'",
          "description": "Rol semántico del color del texto y la línea decorativa",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "muted"
          ]
        },
        {
          "name": "surface",
          "type": "LibSurface",
          "default": "'default'",
          "description": "Superficie/contexto (p.ej. 'inverse' para fondos oscuros).",
          "attribute": "surface",
          "options": [
            "default",
            "light",
            "dark",
            "inverse"
          ]
        },
        {
          "name": "line",
          "type": "EyebrowLine",
          "default": "'left'",
          "description": "Posición de la línea decorativa",
          "attribute": "line",
          "options": [
            "left",
            "right",
            "both",
            "none"
          ]
        },
        {
          "name": "size",
          "type": "EyebrowSize",
          "default": "'md'",
          "description": "Tamaño tipográfico",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "dot",
          "type": "boolean",
          "default": "false",
          "description": "Sustituye la línea por un punto de color",
          "attribute": "dot"
        },
        {
          "name": "num",
          "type": "string",
          "default": "''",
          "description": "Badge numérico añadido como sufijo.\nÚtil en listados de componentes (\"41 · Motion\").",
          "attribute": "num"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Texto del eyebrow."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-file-browser",
    "name": "File Browser",
    "slug": "lib-file-browser",
    "tagName": "lib-file-browser",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "entries",
          "type": "FsEntry[]",
          "default": "[]",
          "description": "— Entradas de la carpeta actual.",
          "attribute": "entries"
        },
        {
          "name": "currentPath",
          "type": "string",
          "default": "''",
          "description": "— Ruta mostrada en la barra de navegación.",
          "attribute": "current-path"
        },
        {
          "name": "rowSize",
          "type": "FileBrowserRowSize",
          "default": "'default'",
          "description": "— 'default' (pantalla completa) | 'compact' (gadget).",
          "attribute": "row-size",
          "options": [
            "compact",
            "default"
          ]
        },
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra el spinner.",
          "attribute": "loading"
        },
        {
          "name": "error",
          "type": "string",
          "default": "null",
          "description": "— Mensaje de error (tiene prioridad sobre la lista).",
          "attribute": "error"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-file-navigate",
          "type": "CustomEvent",
          "description": "— { detail: { path } } al entrar en una carpeta."
        },
        {
          "name": "ui-lib-file-open",
          "type": "CustomEvent",
          "description": "— { detail: { entry } } al abrir un fichero."
        },
        {
          "name": "ui-lib-file-up",
          "type": "CustomEvent",
          "description": "— void al pulsar \"subir un nivel\"."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-file-uploader",
    "name": "File Uploader",
    "slug": "lib-file-uploader",
    "tagName": "lib-file-uploader",
    "description": "Drag-and-drop file upload area with multiple file and MIME type filtering support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "input",
      "upload"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "zone",
          "type": "UploaderZone",
          "default": "'default'",
          "description": "— Variante de zona (default: 'default')",
          "attribute": "zone",
          "options": [
            "default",
            "compact",
            "image"
          ]
        },
        {
          "name": "title",
          "type": "string",
          "default": "'Arrastra archivos aquí'",
          "description": "— Título de la zona",
          "attribute": "title"
        },
        {
          "name": "subtitle",
          "type": "string",
          "default": "'o busca en tu equipo'",
          "description": "— Subtítulo (solo zone='default')",
          "attribute": "subtitle"
        },
        {
          "name": "hint",
          "type": "string",
          "default": "'PDF, DOCX, PNG, JPG · máx. 20 MB por archivo'",
          "description": "— Texto de restricciones (formatos, tamaño)",
          "attribute": "hint"
        },
        {
          "name": "multiple",
          "type": "boolean",
          "default": "false",
          "description": "— Permite múltiples archivos",
          "attribute": "multiple"
        },
        {
          "name": "accept",
          "type": "string",
          "default": "'*'",
          "description": "— Tipos aceptados (e.g. '.pdf,image/*')",
          "attribute": "accept"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Deshabilita la zona",
          "attribute": "disabled"
        },
        {
          "name": "simulate",
          "type": "boolean",
          "default": "false",
          "description": "— Simula upload internamente (Storybook)",
          "attribute": "simulate"
        },
        {
          "name": "simulateMs",
          "type": "number",
          "default": "2000",
          "description": "— Duración simulada en ms (default: 2000)",
          "attribute": "simulate-ms"
        },
        {
          "name": "files",
          "type": "FileEntry[]",
          "description": "Archivos actuales en la lista"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-upload-start",
          "type": "CustomEvent",
          "description": "— Inicio de upload de un archivo Detail: { id: string, file: File }"
        },
        {
          "name": "ui-lib-upload-error",
          "type": "CustomEvent",
          "description": "— Upload fallido Detail: { id: string, file: File, message: string }"
        },
        {
          "name": "ui-lib-upload-done",
          "type": "CustomEvent",
          "description": "— Upload completado Detail: { id: string, file: File }"
        },
        {
          "name": "ui-lib-file-remove",
          "type": "CustomEvent",
          "description": "— Archivo eliminado de la lista Detail: { id: string, file: File }"
        },
        {
          "name": "ui-lib-files-change",
          "type": "CustomEvent",
          "description": "— Al seleccionar/soltar archivos Detail: { files: File[] }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-footer",
    "name": "Footer",
    "slug": "lib-footer",
    "tagName": "lib-footer",
    "description": "`<lib-footer>` — Footer polimórfico con 4 variantes de diseño.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "theme",
          "type": "FooterTheme",
          "default": "'social'",
          "attribute": "theme",
          "options": [
            "social",
            "accordion",
            "inverse",
            "glitch",
            "celadon",
            "sabi",
            "shizen"
          ]
        },
        {
          "name": "decoration",
          "type": "string",
          "default": "''",
          "description": "Decoraciones celadon opt-in (Bar), separadas por espacio\n(ej: \"tide condensation depth\"). Sólo en `variant=\"celadon\"`.",
          "attribute": "decoration"
        },
        {
          "name": "brandName",
          "type": "string",
          "default": "'shibui'",
          "attribute": "brand-name"
        },
        {
          "name": "brandKanji",
          "type": "string",
          "default": "'渋'",
          "attribute": "brand-kanji"
        },
        {
          "name": "brandSub",
          "type": "string",
          "default": "'Design System · Zaragoza'",
          "attribute": "brand-sub"
        },
        {
          "name": "location",
          "type": "string",
          "default": "'Zaragoza'",
          "attribute": "location"
        },
        {
          "name": "version",
          "type": "string",
          "default": "'1.0.0'",
          "attribute": "version"
        },
        {
          "name": "nodeVersion",
          "type": "string",
          "default": "'v22.0.0'",
          "attribute": "node-version"
        },
        {
          "name": "githubHref",
          "type": "string",
          "default": "'#'",
          "attribute": "github-href"
        },
        {
          "name": "linkedinHref",
          "type": "string",
          "default": "'#'",
          "attribute": "linkedin-href"
        },
        {
          "name": "rssHref",
          "type": "string",
          "default": "'#'",
          "attribute": "rss-href"
        },
        {
          "name": "email",
          "type": "string",
          "default": "''",
          "attribute": "email"
        },
        {
          "name": "columns",
          "type": "FooterColumn[]",
          "default": "[ { heading: 'Librería', links: [ { label: 'Componentes', href: '#' }, { label: 'Tokens', href: '#' }, { label: 'Estilos', href: '#' }, ], }, { heading: 'Ecosistema', links: [ { label: 'GitHub', href: '#' }, { label: 'NPM', href: '#' }, { label: 'Storybook', href: '#' }, ], }, { heading: 'Recursos', links: [ { label: 'Docs', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Roadmap', href: '#' }, ], }, ]",
          "description": "Columnas de navegación (accordion / inverse)",
          "attribute": "columns"
        },
        {
          "name": "navLinks",
          "type": "FooterLink[]",
          "default": "[ { label: 'Componentes', href: '#' }, { label: 'Tokens', href: '#' }, { label: 'MIT License', href: '#' }, ]",
          "description": "Links de navegación planos (social / glitch)",
          "attribute": "nav-links"
        },
        {
          "name": "legalLinks",
          "type": "FooterLink[]",
          "default": "[ { label: 'privacy.md', href: '#' }, { label: 'terms.md', href: '#' }, ]",
          "description": "Links de pie (privacidad, términos, etc.)",
          "attribute": "legal-links"
        },
        {
          "name": "runtimeLines",
          "type": "{ key: string; value: string }[]",
          "default": "[ { key: 'node', value: 'v22.0.0' }, { key: 'css', value: 'pure · no-build' }, { key: 'fonts', value: 'google CDN' }, { key: 'deps', value: '0' }, { key: 'size', value: '~180kb total' }, ]",
          "attribute": "runtime-lines"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-footer-link-click",
          "description": "Cuando se pulsa un enlace del footer"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-funnel-chart",
    "name": "Funnel Chart",
    "slug": "lib-funnel-chart",
    "tagName": "lib-funnel-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "stages",
          "type": "FunnelStage[]",
          "default": "[]",
          "description": "— Etapas { label, value, color? }. `.stages=${...}`.",
          "attribute": "stages"
        },
        {
          "name": "showValues",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra valor y % dentro de cada banda. Default true.",
          "attribute": "show-values"
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-gadget-frame",
    "name": "Gadget Frame",
    "slug": "lib-gadget-frame",
    "tagName": "lib-gadget-frame",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "gadgetTitle",
          "type": "string",
          "default": "''",
          "description": "Título mostrado en la barra del gadget.\nSe usa `gadget-title` (no `title`) para evitar conflicto\ncon el atributo nativo HTMLElement.title.",
          "attribute": "gadget-title"
        },
        {
          "name": "icon",
          "type": "string",
          "default": "''",
          "description": "— Nombre del icono Phosphor",
          "attribute": "icon"
        },
        {
          "name": "minimizable",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra botón minimizar (default: true)",
          "attribute": "minimizable"
        },
        {
          "name": "closable",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra botón cerrar (default: true)",
          "attribute": "closable"
        },
        {
          "name": "minimized",
          "type": "boolean",
          "default": "false",
          "description": "— Estado minimizado (reflect)",
          "attribute": "minimized"
        },
        {
          "name": "theme",
          "type": "GadgetFrameTheme",
          "default": "'default'",
          "description": "— 'default' (card) | 'glass'",
          "attribute": "theme",
          "options": [
            "default",
            "glass"
          ]
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Contenido del gadget (oculto cuando minimized)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-gadget-minimize",
          "type": "CustomEvent",
          "description": "— { detail: { minimized: boolean } }"
        },
        {
          "name": "ui-lib-gadget-close",
          "type": "CustomEvent",
          "description": "— void"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-gauge",
    "name": "Gauge",
    "slug": "lib-gauge",
    "tagName": "lib-gauge",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "description": "— Valor actual.",
          "attribute": "value"
        },
        {
          "name": "min",
          "type": "number",
          "default": "0",
          "description": "— Mínimo del dominio. Default 0.",
          "attribute": "min"
        },
        {
          "name": "max",
          "type": "number",
          "default": "100",
          "description": "— Máximo del dominio. Default 100.",
          "attribute": "max"
        },
        {
          "name": "tone",
          "type": "GaugeTone",
          "default": "'info'",
          "description": "— Color del arco en modo simple. Default 'info'.",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "success",
            "warning",
            "error"
          ]
        },
        {
          "name": "zones",
          "type": "GaugeZone[]",
          "default": "[]",
          "description": "— Tramos { from, to, tone }. Si hay → modo zonas.",
          "attribute": "zones"
        },
        {
          "name": "showValue",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra el número central. Default true.",
          "attribute": "show-value"
        },
        {
          "name": "unit",
          "type": "string",
          "default": "''",
          "description": "— Sufijo del valor (p.ej. '%').",
          "attribute": "unit"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "— Caption bajo el valor.",
          "attribute": "label"
        },
        {
          "name": "height",
          "type": "number",
          "default": "180",
          "description": "— Altura en px. Default 180.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-git-graph",
    "name": "Git Graph",
    "slug": "lib-git-graph",
    "tagName": "lib-git-graph",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "commits",
          "type": "GitCommit[]",
          "default": "[]",
          "description": "— Array en orden topológico (más reciente primero).",
          "attribute": "commits"
        },
        {
          "name": "height",
          "type": "number",
          "default": "400",
          "description": "— Alto del área scrolleable en px. Default 400.",
          "attribute": "height"
        },
        {
          "name": "rowHeight",
          "type": "number",
          "default": "32",
          "description": "— Separación entre filas en px. Default 32.",
          "attribute": "row-height"
        },
        {
          "name": "laneWidth",
          "type": "number",
          "default": "24",
          "description": "— Ancho de cada carril en px. Default 24.",
          "attribute": "lane-width"
        },
        {
          "name": "showAuthor",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra el nombre del autor bajo cada mensaje.",
          "attribute": "show-author"
        },
        {
          "name": "showDate",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra la fecha bajo cada mensaje.",
          "attribute": "show-date"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-glass-card",
    "name": "Glass Card",
    "slug": "lib-glass-card",
    "tagName": "lib-glass-card",
    "description": "Card with glassmorphism background effect and configurable intensity.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "visual"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "tint",
          "type": "LibGlassTint",
          "default": "'neutral'",
          "description": "Tinte estructural del cristal.\n- neutral : neutro paper (default)\n- cool    : tinte azul sereno — oklch(55% 0.06 210)\n- warm    : tinte cálido orgánico — oklch(45% 0.05 45)\nDentro de un katachi el tinte es sobreescrito por el contexto.",
          "attribute": "tint",
          "options": [
            "neutral",
            "cool",
            "warm"
          ]
        },
        {
          "name": "intensity",
          "type": "LibGlassIntensity",
          "default": "'md'",
          "description": "Intensidad del efecto (blur + opacidad).\n- low  : blur 4px  · opacity 0.10 — sutil\n- md   : blur 12px · opacity 0.15 — default\n- high : blur 25px · opacity 0.25 — máximo",
          "attribute": "intensity",
          "options": [
            "low",
            "md",
            "high"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido de la card (eyebrow, título, body, footer...)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-header",
    "name": "Header",
    "slug": "lib-header",
    "tagName": "lib-header",
    "description": "lib-header — Shibui UI · SG-66\n\n11 variantes: classic · dark · centered · transparent · mega ·\n              minimal · shrink · app-bar · celadon · sabi · shizen\n\nMobile: breakpoint 640px — drawer vertical compartido por todas las variantes.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "theme",
          "type": "HeaderTheme",
          "default": "'classic'",
          "attribute": "theme",
          "options": [
            "classic",
            "dark",
            "centered",
            "transparent",
            "mega",
            "minimal",
            "shrink",
            "app-bar",
            "celadon",
            "sabi",
            "shizen"
          ]
        },
        {
          "name": "decoration",
          "type": "string",
          "default": "''",
          "description": "Decoraciones celadon opt-in (Bar), separadas por espacio\n(ej: \"tide condensation depth\"). Sólo en variantes de layout\nsimple (classic · dark · transparent · minimal · shrink) y\npensadas para `data-katachi=\"celadon\"`.",
          "attribute": "decoration"
        },
        {
          "name": "logoMark",
          "type": "string",
          "default": "'渋'",
          "attribute": "logo-mark"
        },
        {
          "name": "brandName",
          "type": "string",
          "default": "'shibui'",
          "attribute": "brand-name"
        },
        {
          "name": "brandTagline",
          "type": "string",
          "default": "''",
          "attribute": "brand-tagline"
        },
        {
          "name": "logoHref",
          "type": "string",
          "default": "'#'",
          "attribute": "logo-href"
        },
        {
          "name": "version",
          "type": "string",
          "default": "''",
          "attribute": "version"
        },
        {
          "name": "links",
          "type": "NavLink[]",
          "default": "[]",
          "attribute": "links"
        },
        {
          "name": "actions",
          "type": "HeaderAction[]",
          "default": "[]",
          "attribute": "actions"
        },
        {
          "name": "loginLabel",
          "type": "string",
          "default": "''",
          "attribute": "login-label"
        },
        {
          "name": "loginHref",
          "type": "string",
          "default": "''",
          "attribute": "login-href"
        },
        {
          "name": "contactLabel",
          "type": "string",
          "default": "''",
          "attribute": "contact-label"
        },
        {
          "name": "contactHref",
          "type": "string",
          "default": "''",
          "attribute": "contact-href"
        },
        {
          "name": "announcement",
          "type": "string",
          "default": "''",
          "attribute": "announcement"
        },
        {
          "name": "announcementHref",
          "type": "string",
          "default": "''",
          "attribute": "announcement-href"
        },
        {
          "name": "megaColumns",
          "type": "MegaColumn[]",
          "default": "[]",
          "attribute": "mega-columns"
        },
        {
          "name": "megaCta",
          "type": "MegaCta | null",
          "default": "null",
          "attribute": "mega-cta"
        },
        {
          "name": "breadcrumbs",
          "type": "BreadcrumbItem[]",
          "default": "[]",
          "attribute": "breadcrumbs"
        },
        {
          "name": "showSearch",
          "type": "boolean",
          "default": "false",
          "attribute": "show-search"
        },
        {
          "name": "searchPlaceholder",
          "type": "string",
          "default": "'Buscar…'",
          "attribute": "search-placeholder"
        },
        {
          "name": "notifications",
          "type": "boolean",
          "default": "false",
          "attribute": "notifications"
        },
        {
          "name": "userName",
          "type": "string",
          "default": "''",
          "attribute": "user-name"
        },
        {
          "name": "userInitials",
          "type": "string",
          "default": "''",
          "attribute": "user-initials"
        },
        {
          "name": "compact",
          "type": "boolean",
          "default": "false",
          "attribute": "compact"
        },
        {
          "name": "shrunk",
          "type": "boolean",
          "default": "false",
          "attribute": "shrunk"
        },
        {
          "name": "scrolled",
          "type": "boolean",
          "default": "false",
          "attribute": "scrolled"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-header-link",
          "type": "CustomEvent"
        },
        {
          "name": "ui-lib-header-action",
          "type": "CustomEvent"
        },
        {
          "name": "ui-lib-header-search",
          "type": "CustomEvent"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-horizontal-scroll-section",
    "name": "Horizontal Scroll Section",
    "slug": "lib-horizontal-scroll-section",
    "tagName": "lib-horizontal-scroll-section",
    "description": "Container that converts vertical scroll into horizontal scroll movement.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "scroll"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "scrollDuration",
          "type": "number",
          "default": "3",
          "description": "Cuántas veces la altura del viewport dura el efecto (default: 3 → 300vh)",
          "attribute": "scroll-duration"
        },
        {
          "name": "paddingInline",
          "type": "number",
          "default": "10",
          "description": "Padding lateral en vw aplicado a ambos lados del track (default: 10)",
          "attribute": "padding-inline"
        },
        {
          "name": "showProgress",
          "type": "boolean",
          "default": "true",
          "description": "Muestra la barra de progreso y el contador de porcentaje",
          "attribute": "show-progress"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Items del carrusel horizontal (flex-shrink: 0 automático)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-scroll-progress",
          "type": "CustomEvent",
          "description": "— { detail: HorizontalScrollProgressEvent }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-icon",
    "name": "Icon",
    "slug": "lib-icon",
    "tagName": "lib-icon",
    "description": "SVG icon component using the Phosphor icon set with size and variant options.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "visual",
      "utility"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "name",
          "type": "string",
          "default": "''",
          "attribute": "name"
        },
        {
          "name": "size",
          "type": "string",
          "default": "'md'",
          "attribute": "size"
        },
        {
          "name": "variant",
          "type": "string",
          "default": "'default'",
          "attribute": "variant"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-input",
    "name": "Input",
    "slug": "lib-input",
    "tagName": "lib-input",
    "description": "Text input field with prefix/suffix slots, error state and multiple input types.",
    "version": "1.2.1",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible",
      "text"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "attribute": "label"
        },
        {
          "name": "placeholder",
          "type": "string",
          "default": "''",
          "attribute": "placeholder"
        },
        {
          "name": "type",
          "type": "'text' | 'email' | 'password'",
          "default": "'text'",
          "attribute": "type",
          "options": [
            "text",
            "email",
            "password"
          ]
        },
        {
          "name": "required",
          "type": "boolean",
          "default": "false",
          "attribute": "required"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "attribute": "disabled"
        },
        {
          "name": "error",
          "type": "boolean",
          "default": "false",
          "attribute": "error"
        },
        {
          "name": "errorMessage",
          "type": "string",
          "default": "''",
          "attribute": "errorMessage"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "attribute": "value"
        }
      ],
      "slots": [
        {
          "name": "prefix",
          "description": "Icono o elemento antes del input."
        },
        {
          "name": "suffix",
          "description": "Icono o elemento después del input."
        }
      ],
      "events": [
        {
          "name": "ui-lib-input",
          "type": "CustomEvent",
          "description": "Evento disparado al cambiar el valor del input."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-kbd",
    "name": "Kbd",
    "slug": "lib-kbd",
    "tagName": "lib-kbd",
    "description": "Keyboard shortcut display element.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "utility"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "size",
          "type": "LibKbdSize",
          "default": "'md'",
          "description": "Tamaño de la tecla.",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "variant",
          "type": "LibKbdVariant",
          "default": "'default'",
          "description": "Tratamiento visual (default · ghost).",
          "attribute": "variant",
          "options": [
            "default",
            "ghost"
          ]
        },
        {
          "name": "surface",
          "type": "LibKbdSurface",
          "default": "'default'",
          "description": "Superficie (default · inverse).",
          "attribute": "surface",
          "options": [
            "default",
            "inverse"
          ]
        },
        {
          "name": "tone",
          "type": "LibKbdTone",
          "default": "'default'",
          "description": "Tinte semántico (default · accent · info).",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "pressed",
          "type": "boolean",
          "default": "false",
          "description": "Estado pressed programático.\nEl componente también gestiona pressed internamente\nvia mousedown/mouseup para la interacción del usuario.",
          "attribute": "pressed"
        }
      ],
      "slots": [
        {
          "name": "(default)",
          "description": "— el símbolo o texto de la tecla (⌘, K, Ctrl…)"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-label",
    "name": "Label",
    "slug": "lib-label",
    "tagName": "lib-label",
    "description": "Accessible form label with support for required field indicator.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "htmlFor",
          "type": "string",
          "default": "''",
          "description": "ID del input al que va asociado (para accesibilidad)",
          "attribute": "htmlFor"
        },
        {
          "name": "required",
          "type": "boolean",
          "default": "false",
          "description": "Muestra un indicador visual de campo obligatorio",
          "attribute": "required"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-line-chart",
    "name": "Line Chart",
    "slug": "lib-line-chart",
    "tagName": "lib-line-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "series",
          "type": "ChartSeries[]",
          "default": "[]",
          "description": "— Series categóricas. Usar binding `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "categories",
          "type": "string[]",
          "default": "[]",
          "description": "— Etiquetas del eje X (modo banda).",
          "attribute": "categories"
        },
        {
          "name": "pointSeries",
          "type": "ChartPointSeries[]",
          "default": "[]",
          "description": "— Series cartesianas (modo lineal). Usar `.pointSeries=${...}`.",
          "attribute": "pointSeries"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "''",
          "description": "— Título del eje Y.",
          "attribute": "y-label"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la rejilla.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la leyenda con más de una serie.",
          "attribute": "show-legend"
        },
        {
          "name": "showDots",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra los puntos sobre la línea.",
          "attribute": "show-dots"
        },
        {
          "name": "smooth",
          "type": "boolean",
          "default": "false",
          "description": "— Suaviza la línea con curvas.",
          "attribute": "smooth"
        },
        {
          "name": "mode",
          "type": "LineChartMode",
          "default": "'line'",
          "description": "— 'line' (default) | 'area' | 'stacked-area'.",
          "attribute": "mode",
          "options": [
            "line",
            "area",
            "stacked-area"
          ]
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px del gráfico. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-login-form",
    "name": "Login Form",
    "slug": "lib-login-form",
    "tagName": "lib-login-form",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "description": "— Deshabilita campos y muestra estado de espera",
          "attribute": "loading"
        },
        {
          "name": "errorMessage",
          "type": "string",
          "default": "''",
          "description": "— Error de servidor a mostrar como alerta",
          "attribute": "errorMessage"
        }
      ],
      "slots": [
        {
          "name": "header",
          "description": "— Override del título (por defecto: \"Iniciar sesión\")"
        },
        {
          "name": "subtitle",
          "description": "— Override del subtítulo descriptivo"
        },
        {
          "name": "footer",
          "description": "— Contenido extra bajo el botón (ej. enlace \"¿Olvidaste la contraseña?\")"
        }
      ],
      "events": [
        {
          "name": "ui-lib-login-submit",
          "type": "CustomEvent",
          "description": "— { email, password } — cuando la validación local pasa"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-magnetic",
    "name": "Magnetic",
    "slug": "lib-magnetic",
    "tagName": "lib-magnetic",
    "description": "Wrapper that makes its child follow the cursor with a magnetic attraction effect.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "shift",
          "type": "number",
          "default": "0.4",
          "description": "Intensidad del efecto (0.1 a 1). \nValores más altos hacen que el elemento siga más de cerca al ratón.",
          "attribute": "shift"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-metric-bar",
    "name": "Metric Bar",
    "slug": "lib-metric-bar",
    "tagName": "lib-metric-bar",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "— Nombre de la métrica (\"CPU\", \"RAM\")",
          "attribute": "label"
        },
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "description": "— Valor actual (0–max). Default 0.",
          "attribute": "value"
        },
        {
          "name": "max",
          "type": "number",
          "default": "100",
          "description": "— Valor máximo. Default 100.",
          "attribute": "max"
        },
        {
          "name": "unit",
          "type": "string",
          "default": "''",
          "description": "— Unidad a mostrar (\"%\", \"GB\", \"MB/s\"). Default \"\".",
          "attribute": "unit"
        },
        {
          "name": "tone",
          "type": "ProgressTone",
          "default": "'default'",
          "description": "— default · accent · info · error. Default default.",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "size",
          "type": "ProgressSize",
          "default": "'sm'",
          "description": "— xs · sm · md · lg · xl. Default sm.",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "showValue",
          "type": "boolean",
          "default": "false",
          "description": "Muestra \"value / max unit\" como texto junto a la etiqueta.",
          "attribute": "show-value"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-modal",
    "name": "Modal",
    "slug": "lib-modal",
    "tagName": "lib-modal",
    "description": "Accessible dialog overlay with configurable size and backdrop behavior.",
    "version": "1.1.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "accessible",
      "overlay"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— Abre el modal. Reflected.",
          "attribute": "open"
        },
        {
          "name": "size",
          "type": "ModalSize",
          "default": "'md'",
          "description": "— xs · sm · md · lg · xl · full (default md).",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl",
            "full"
          ]
        },
        {
          "name": "variant",
          "type": "ModalVariant",
          "default": "'default'",
          "description": "— default · editorial · danger.",
          "attribute": "variant",
          "options": [
            "default",
            "editorial",
            "error"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Surface oscura.",
          "attribute": "dark"
        },
        {
          "name": "heading",
          "type": "string",
          "default": "''",
          "description": "— Título del modal (requerido para a11y).",
          "attribute": "heading"
        },
        {
          "name": "subtitle",
          "type": "string",
          "default": "''",
          "description": "— Subtítulo mono debajo del título.",
          "attribute": "subtitle"
        },
        {
          "name": "iconTone",
          "type": "ModalIconTone | null",
          "default": "null",
          "description": "Tono del ícono del header.\nAcepta: 'default' | 'accent' | 'secondary' | 'error' | 'info' | null.\nCuando es null no se renderiza el wrapper del ícono.",
          "attribute": "icon-tone",
          "options": [
            "default",
            "accent",
            "secondary",
            "error",
            "info"
          ]
        },
        {
          "name": "footerInfo",
          "type": "string",
          "default": "''",
          "description": "— Texto secundario izquierda en el footer.",
          "attribute": "footer-info"
        },
        {
          "name": "noBackdropClose",
          "type": "boolean",
          "default": "false",
          "description": "Desactiva el cierre al hacer click fuera del panel.",
          "attribute": "no-backdrop-close"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Cuerpo del modal (secciones, formularios, contenido libre)."
        },
        {
          "name": "icon",
          "description": "— Contenido del ícono del header (visible solo si icon-tone no es null)."
        },
        {
          "name": "footer",
          "description": "— Acciones del footer (botones)."
        }
      ],
      "events": [
        {
          "name": "ui-lib-modal-close",
          "type": "CustomEvent",
          "description": "— Emitido cuando el modal se cierra. Detail: { reason }."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-pagination",
    "name": "Pagination",
    "slug": "lib-pagination",
    "tagName": "lib-pagination",
    "description": "Page navigation controls with configurable total items and items per page.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "totalItems",
          "type": "number",
          "default": "0",
          "description": "— Total de registros",
          "attribute": "total-items"
        },
        {
          "name": "itemsPerPage",
          "type": "number",
          "default": "10",
          "description": "— Registros por página (default 10)",
          "attribute": "items-per-page"
        },
        {
          "name": "currentPage",
          "type": "number",
          "default": "1",
          "description": "— Página activa (1-indexed, default 1)",
          "attribute": "current-page"
        },
        {
          "name": "siblings",
          "type": "number",
          "default": "1",
          "description": "— Páginas visibles a cada lado de la actual (default 1)",
          "attribute": "siblings"
        },
        {
          "name": "size",
          "type": "PaginationSize",
          "default": "'md'",
          "description": "— 'sm' | 'md' | 'lg' (default 'md')",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "variant",
          "type": "PaginationVariant",
          "default": "'default'",
          "description": "— 'default' | 'outline' | 'ghost'",
          "attribute": "variant",
          "options": [
            "default",
            "outline",
            "ghost"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Tema oscuro",
          "attribute": "dark"
        },
        {
          "name": "showInfo",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra \"X–Y de Z resultados\"",
          "attribute": "show-info"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "'Paginación'",
          "description": "— Etiqueta accesible del nav (default 'Paginación')",
          "attribute": "aria-label"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-page-change",
          "type": "CustomEvent",
          "description": "— { detail: { page: number, prev: number } }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-parallax-container",
    "name": "Parallax Container",
    "slug": "lib-parallax-container",
    "tagName": "lib-parallax-container",
    "description": "Wrapper that applies a parallax scroll effect to its content.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "scroll"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "speed",
          "type": "number",
          "default": "0.2",
          "description": "— Multiplicador de desplazamiento base (default 0.2)",
          "attribute": "speed"
        },
        {
          "name": "axis",
          "type": "ParallaxAxis",
          "default": "'y'",
          "description": "— Eje del efecto: 'y' | 'x' | 'xy' (default 'y')",
          "attribute": "axis",
          "options": [
            "y",
            "x",
            "xy"
          ]
        },
        {
          "name": "clamp",
          "type": "number",
          "default": "0",
          "description": "— Máximo desplazamiento en px (0 = sin límite, default 0)",
          "attribute": "clamp"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Elementos a desplazar. Cada hijo acepta data-parallax-factor."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-parallax-text-stack",
    "name": "Parallax Text Stack",
    "slug": "lib-parallax-text-stack",
    "tagName": "lib-parallax-text-stack",
    "description": "Horizontally scrolling text lines with configurable speed for visual effect.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "scroll"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "lines",
          "type": "string[]",
          "default": "[]",
          "description": "— Array de strings, una por capa",
          "attribute": "lines"
        },
        {
          "name": "speed",
          "type": "number",
          "default": "0.15",
          "description": "— Factor de velocidad (default 0.15)",
          "attribute": "speed"
        },
        {
          "name": "size",
          "type": "ParallaxTextSize",
          "default": "'lg'",
          "description": "— 'sm' | 'md' | 'lg'(default) | 'xl' | '2xl'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg",
            "xl",
            "2xl"
          ]
        },
        {
          "name": "tone",
          "type": "ParallaxTextTone",
          "default": "'default'",
          "description": "— 'default' | 'muted' | 'accent' | 'info' IMPORTANTE: el padre debe llevar overflow-x:hidden. El componente NO lo aplica en :host — si lo hiciera, el translateX quedaría clipado y el efecto sería invisible.",
          "attribute": "tone",
          "options": [
            "default",
            "muted",
            "accent",
            "info"
          ]
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-pie-chart",
    "name": "Pie Chart",
    "slug": "lib-pie-chart",
    "tagName": "lib-pie-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "slices",
          "type": "PieSlice[]",
          "default": "[]",
          "description": "— Porciones { label, value, color? }. Usar `.slices=${...}`.",
          "attribute": "slices"
        },
        {
          "name": "innerRatio",
          "type": "number",
          "default": "0",
          "description": "— 0 = tarta; 0.5–0.7 = donut. Default 0.",
          "attribute": "inner-ratio"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la leyenda. Default true.",
          "attribute": "show-legend"
        },
        {
          "name": "showLabels",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra el % sobre cada porción. Default false.",
          "attribute": "show-labels"
        },
        {
          "name": "centerLabel",
          "type": "string",
          "default": "''",
          "description": "— Texto en el hueco del donut.",
          "attribute": "center-label"
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [
        {
          "name": "center",
          "description": "— Contenido del hueco del donut (tiene prioridad sobre center-label)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-progress",
    "name": "Progress",
    "slug": "lib-progress",
    "tagName": "lib-progress",
    "description": "Linear progress bar with determinate and indeterminate modes.",
    "version": "2.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "loading",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "attribute": "value"
        },
        {
          "name": "max",
          "type": "number",
          "default": "100",
          "attribute": "max"
        },
        {
          "name": "size",
          "type": "ProgressSize",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "tone",
          "type": "ProgressTone",
          "default": "'default'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "indeterminate",
          "type": "boolean",
          "default": "false",
          "attribute": "indeterminate"
        },
        {
          "name": "striped",
          "type": "boolean",
          "default": "false",
          "attribute": "striped"
        },
        {
          "name": "square",
          "type": "boolean",
          "default": "false",
          "attribute": "square"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "attribute": "label"
        },
        {
          "name": "valueLabel",
          "type": "string",
          "default": "''",
          "attribute": "value-label"
        },
        {
          "name": "sub",
          "type": "string",
          "default": "''",
          "attribute": "sub"
        },
        {
          "name": "showValue",
          "type": "boolean",
          "default": "false",
          "attribute": "show-value"
        },
        {
          "name": "segments",
          "type": "string",
          "default": "''",
          "attribute": "segments"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "''",
          "attribute": "aria-label"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-progress-circle",
    "name": "Progress Circle",
    "slug": "lib-progress-circle",
    "tagName": "lib-progress-circle",
    "description": "Circular progress indicator with value display and indeterminate mode.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "loading",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "description": "Valor actual",
          "attribute": "value"
        },
        {
          "name": "max",
          "type": "number",
          "default": "100",
          "description": "Valor máximo",
          "attribute": "max"
        },
        {
          "name": "size",
          "type": "LibProgressCircleSize",
          "default": "'md'",
          "description": "Tamaño semántico del círculo.\nMapea a dimensiones fijas con strokeWidth proporcional:\n- xs : 40px  · stroke 3  (sin label)\n- sm : 64px  · stroke 4\n- md : 96px  · stroke 6  (default)\n- lg : 128px · stroke 7\n- xl : 176px · stroke 6",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "strokeWidth",
          "type": "number | null",
          "default": "null",
          "description": "Sobreescribe el strokeWidth por defecto del tamaño.\nnull → usa el valor canónico del tamaño seleccionado.",
          "attribute": "stroke-width"
        },
        {
          "name": "tone",
          "type": "LibProgressCircleTone",
          "default": "'default'",
          "description": "Tono de color del arco.\nEl track toma automáticamente el tono -100 de cada tono.\n- default : washi-900 (tinta)\n- accent  : persimmon orgánico (kaki)\n- info    : jade sereno (celadon)\n- error   : estado crítico",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "indeterminate",
          "type": "boolean",
          "default": "false",
          "description": "Modo de carga de duración desconocida.\nEl arco es un segmento corto que rota continuamente.\nIgnora `value`, `bare`, `sub` e `icon`.",
          "attribute": "indeterminate"
        },
        {
          "name": "bare",
          "type": "boolean",
          "default": "false",
          "description": "Oculta el label central (solo muestra el arco)",
          "attribute": "bare"
        },
        {
          "name": "sub",
          "type": "string",
          "default": "''",
          "description": "Subtítulo bajo el valor numérico. Oculto en xs.",
          "attribute": "sub"
        },
        {
          "name": "icon",
          "type": "'check' | null",
          "default": "null",
          "description": "Icono SVG en el centro en lugar del texto numérico.\n- 'check' : polyline checkmark en color de la variante\n- null    : muestra el valor (default)",
          "attribute": "icon"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-quote",
    "name": "Quote",
    "slug": "lib-quote",
    "tagName": "lib-quote",
    "description": "`<lib-quote>` — Cita display editorial.\n\nBlockquote en Cormorant Garamond con acento itálico en tono accent y\natribución en DM Mono. Patrón recurrente en hero sections, CTAs\ny secciones de filosofía del sistema Shibui.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "text",
          "type": "string",
          "default": "''",
          "description": "Primera línea de la cita",
          "attribute": "text"
        },
        {
          "name": "accent",
          "type": "string",
          "default": "''",
          "description": "Segunda línea en itálica accent",
          "attribute": "accent"
        },
        {
          "name": "cite",
          "type": "string",
          "default": "''",
          "description": "Atribución",
          "attribute": "cite"
        },
        {
          "name": "surface",
          "type": "'default' | 'light' | 'dark'",
          "default": "'dark'",
          "description": "Superficie de fondo",
          "attribute": "surface",
          "options": [
            "default",
            "light",
            "dark"
          ]
        },
        {
          "name": "size",
          "type": "'sm' | 'md' | 'lg'",
          "default": "'md'",
          "description": "Tamaño tipográfico fluido",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Primera línea de la cita como rich content (alternativa al atributo `text`)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-radar-chart",
    "name": "Radar Chart",
    "slug": "lib-radar-chart",
    "tagName": "lib-radar-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "axes",
          "type": "string[]",
          "default": "[]",
          "description": "— Etiquetas de los ejes. Usar binding `.axes=${...}`.",
          "attribute": "axes"
        },
        {
          "name": "series",
          "type": "ChartSeries[]",
          "default": "[]",
          "description": "— Series { name, values }. `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "max",
          "type": "number",
          "default": "0",
          "description": "— Máximo radial. 0 = auto (nice sobre los datos).",
          "attribute": "max"
        },
        {
          "name": "levels",
          "type": "number",
          "default": "4",
          "description": "— Anillos concéntricos. Default 4.",
          "attribute": "levels"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Leyenda con más de una serie. Default true.",
          "attribute": "show-legend"
        },
        {
          "name": "showDots",
          "type": "boolean",
          "default": "true",
          "description": "— Vértices con tooltip. Default true.",
          "attribute": "show-dots"
        },
        {
          "name": "fillOpacity",
          "type": "number",
          "default": "0.15",
          "attribute": "fill-opacity"
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-radio",
    "name": "Radio",
    "slug": "lib-radio",
    "tagName": "lib-radio",
    "description": "Radio button input with label, sublabel and multiple visual variants.",
    "version": "1.1.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible",
      "input"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "checked",
          "type": "boolean",
          "default": "false",
          "description": "Estado seleccionado",
          "attribute": "checked"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Estado deshabilitado",
          "attribute": "disabled"
        },
        {
          "name": "name",
          "type": "string",
          "default": "''",
          "description": "Nombre del grupo. Radios con el mismo name forman un grupo\nde seleccion unica gestionado por el navegador.",
          "attribute": "name"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "Valor enviado en el evento change",
          "attribute": "value"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Texto principal del label",
          "attribute": "label"
        },
        {
          "name": "sublabel",
          "type": "string",
          "default": "''",
          "description": "Texto secundario bajo el label",
          "attribute": "sublabel"
        },
        {
          "name": "size",
          "type": "LibRadioSize",
          "default": "'md'",
          "description": "Tamano del radio",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tone",
          "type": "LibRadioTone",
          "default": "'default'",
          "description": "Tono de color",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "error"
          ]
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido de label alternativo (cuando no se usan props label/sublabel)"
        }
      ],
      "events": [
        {
          "name": "change",
          "type": "CustomEvent",
          "description": "Emitido al seleccionar el radio. detail: { checked: boolean, value: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-range-slider",
    "name": "Range Slider",
    "slug": "lib-range-slider",
    "tagName": "lib-range-slider",
    "description": "Dual-handle range slider for selecting a min/max value within a defined range.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "input",
      "range"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "min",
          "type": "number",
          "default": "0",
          "attribute": "min"
        },
        {
          "name": "max",
          "type": "number",
          "default": "100",
          "attribute": "max"
        },
        {
          "name": "step",
          "type": "number",
          "default": "1",
          "attribute": "step"
        },
        {
          "name": "value",
          "type": "number",
          "default": "50",
          "description": "— valor actual (modo single)",
          "attribute": "value"
        },
        {
          "name": "valueMin",
          "type": "number",
          "default": "25",
          "description": "Límite inferior — modo dual.",
          "attribute": "value-min"
        },
        {
          "name": "valueMax",
          "type": "number",
          "default": "75",
          "description": "Límite superior — modo dual.",
          "attribute": "value-max"
        },
        {
          "name": "dual",
          "type": "boolean",
          "default": "false",
          "description": "— activa dos thumbs para rango min/max",
          "attribute": "dual"
        },
        {
          "name": "vertical",
          "type": "boolean",
          "default": "false",
          "description": "— orientación vertical",
          "attribute": "vertical"
        },
        {
          "name": "size",
          "type": "RsSize",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tone",
          "type": "RsTone",
          "default": "'default'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error",
            "muted"
          ]
        },
        {
          "name": "surface",
          "type": "LibSurface",
          "default": "'default'",
          "description": "Superficie/contexto (p.ej. 'inverse'/'dark' para fondos oscuros).",
          "attribute": "surface",
          "options": [
            "default",
            "light",
            "dark",
            "inverse"
          ]
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "attribute": "disabled"
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "attribute": "label"
        },
        {
          "name": "unit",
          "type": "string",
          "default": "''",
          "attribute": "unit"
        },
        {
          "name": "showLimits",
          "type": "boolean",
          "default": "false",
          "description": "— muestra min/max labels bajo el track",
          "attribute": "show-limits"
        },
        {
          "name": "limitMin",
          "type": "string",
          "default": "''",
          "description": "Texto personalizado extremo izquierdo/abajo. Por defecto: `min`.",
          "attribute": "limit-min"
        },
        {
          "name": "limitMax",
          "type": "string",
          "default": "''",
          "description": "Texto personalizado extremo derecho/arriba. Por defecto: `max`.",
          "attribute": "limit-max"
        },
        {
          "name": "tooltip",
          "type": "boolean",
          "default": "false",
          "description": "— globito flotante sobre el thumb (solo single horizontal)",
          "attribute": "tooltip"
        },
        {
          "name": "marks",
          "type": "string",
          "default": "''",
          "description": "— JSON string de marcas: '[{\"pct\":0,\"label\":\"XS\"},...]'",
          "attribute": "marks"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-change",
          "type": "CustomEvent",
          "description": "— { value } (single) | { valueMin, valueMax } (dual)"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-rating",
    "name": "Rating",
    "slug": "lib-rating",
    "tagName": "lib-rating",
    "description": "Star rating display with readonly and interactive modes.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "number",
          "default": "0",
          "description": "— Valor actual (0–max). Soporta decimales en readonly para half-star.",
          "attribute": "value"
        },
        {
          "name": "max",
          "type": "number",
          "default": "5",
          "description": "— Máximo de items (default 5)",
          "attribute": "max"
        },
        {
          "name": "size",
          "type": "RatingSize",
          "default": "'md'",
          "description": "— 'xs' | 'sm' | 'md'(default) | 'lg' | 'xl'",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "tone",
          "type": "RatingTone",
          "default": "'default'",
          "description": "— 'default'(gold) | 'accent' | 'info' | 'muted'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "muted"
          ]
        },
        {
          "name": "icon",
          "type": "RatingIcon",
          "default": "'star'",
          "description": "— 'star'(default) | 'heart' | 'diamond'",
          "attribute": "icon",
          "options": [
            "star",
            "heart",
            "diamond"
          ]
        },
        {
          "name": "readonly",
          "type": "boolean",
          "default": "false",
          "description": "— Solo display, sin interacción",
          "attribute": "readonly"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Opacity 0.4, sin interacción",
          "attribute": "disabled"
        },
        {
          "name": "showCount",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra el valor numérico junto a las estrellas",
          "attribute": "show-count"
        },
        {
          "name": "count",
          "type": "number | null",
          "default": "null",
          "description": "— Número de reseñas a mostrar junto al valor numérico",
          "attribute": "count"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-rating-change",
          "type": "CustomEvent",
          "description": "— { detail: { value: number, prev: number } }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-reading-progress",
    "name": "Reading Progress",
    "slug": "lib-reading-progress",
    "tagName": "lib-reading-progress",
    "description": "Fixed progress bar that tracks scroll position within a target element.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "scroll"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "display",
          "type": "ReadingProgressDisplay",
          "default": "'bar'",
          "attribute": "display",
          "options": [
            "bar",
            "line",
            "dots",
            "ring",
            "vertical"
          ]
        },
        {
          "name": "tone",
          "type": "ReadingProgressTone",
          "default": "'accent'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "theme",
          "type": "ReadingProgressTheme",
          "default": "'default'",
          "attribute": "theme",
          "options": [
            "default",
            "kintsugi"
          ]
        },
        {
          "name": "target",
          "type": "string",
          "default": "''",
          "description": "Selector CSS del elemento scrollable que se quiere observar.\nSi está vacío, escucha el scroll de window.",
          "attribute": "target"
        },
        {
          "name": "dotsCount",
          "type": "number",
          "default": "5",
          "attribute": "dots-count"
        },
        {
          "name": "ringSize",
          "type": "number",
          "default": "28",
          "attribute": "ring-size"
        },
        {
          "name": "progress",
          "type": "number",
          "description": "Devuelve el progreso actual (0-100)"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-ripple",
    "name": "Ripple",
    "slug": "lib-ripple",
    "tagName": "lib-ripple",
    "description": "Material-style ripple click effect for overlay on interactive elements.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-scatter-chart",
    "name": "Scatter Chart",
    "slug": "lib-scatter-chart",
    "tagName": "lib-scatter-chart",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "series",
          "type": "ScatterSeries[]",
          "default": "[]",
          "description": "— Array de series de datos. Usar binding `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "''",
          "description": "— Etiqueta del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "''",
          "description": "— Etiqueta del eje Y.",
          "attribute": "y-label"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la rejilla de fondo.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra la leyenda cuando hay más de una serie.",
          "attribute": "show-legend"
        },
        {
          "name": "dotRadius",
          "type": "number",
          "default": "5",
          "description": "— Radio en px de cada punto. Default 5.",
          "attribute": "dot-radius"
        },
        {
          "name": "height",
          "type": "number",
          "default": "320",
          "description": "— Altura en px del gráfico. Default 320.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-scatter-chart-3d",
    "name": "Scatter Chart 3D",
    "slug": "lib-scatter-chart-3d",
    "tagName": "lib-scatter-chart-3d",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "series",
          "type": "ScatterSeries3d[]",
          "default": "[]",
          "description": "— Series de datos 3D. Usar `.series=${...}`.",
          "attribute": "series"
        },
        {
          "name": "xLabel",
          "type": "string",
          "default": "'X'",
          "description": "— Etiqueta del eje X.",
          "attribute": "x-label"
        },
        {
          "name": "yLabel",
          "type": "string",
          "default": "'Y'",
          "description": "— Etiqueta del eje Y.",
          "attribute": "y-label"
        },
        {
          "name": "zLabel",
          "type": "string",
          "default": "'Z'",
          "description": "— Etiqueta del eje Z.",
          "attribute": "z-label"
        },
        {
          "name": "showGrid",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra rejilla en el plano Z=0.",
          "attribute": "show-grid"
        },
        {
          "name": "showLegend",
          "type": "boolean",
          "default": "true",
          "description": "— Muestra leyenda con las series.",
          "attribute": "show-legend"
        },
        {
          "name": "dotRadius",
          "type": "number",
          "default": "5",
          "description": "— Radio de cada punto en px. Default 5.",
          "attribute": "dot-radius"
        },
        {
          "name": "height",
          "type": "number",
          "default": "420",
          "description": "— Altura del SVG en px. Default 420.",
          "attribute": "height"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-segmented-control",
    "name": "Segmented Control",
    "slug": "lib-segmented-control",
    "tagName": "lib-segmented-control",
    "description": "Mutually exclusive option selector presented as a connected button group.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "options",
          "type": "SegmentedOption[]",
          "default": "[]",
          "description": "— Array de opciones",
          "attribute": "options"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "— Valor activo (reflected)",
          "attribute": "value"
        },
        {
          "name": "display",
          "type": "SegmentedDisplay",
          "default": "'outline'",
          "description": "— Modo de presentación: outline · underline · pill · ghost (reflected)",
          "attribute": "display",
          "options": [
            "outline",
            "underline",
            "pill",
            "ghost"
          ]
        },
        {
          "name": "surface",
          "type": "SegmentedSurface",
          "default": "'default'",
          "description": "— Superficie: default · dark (reflected)",
          "attribute": "surface",
          "options": [
            "default",
            "dark"
          ]
        },
        {
          "name": "tone",
          "type": "SegmentedTone",
          "default": "'default'",
          "description": "— Tinte del thumb: default · accent · info (reflected)",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "size",
          "type": "SegmentedSize",
          "default": "'md'",
          "description": "— Tamaño (reflected)",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "full",
          "type": "boolean",
          "default": "false",
          "description": "— Ocupa el 100% del ancho (reflected)",
          "attribute": "full"
        },
        {
          "name": "iconOnly",
          "type": "boolean",
          "default": "false",
          "description": "— Solo iconos, sin texto (reflected)",
          "attribute": "icon-only"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Deshabilitado (reflected)",
          "attribute": "disabled"
        },
        {
          "name": "glitch",
          "type": "boolean",
          "default": "false",
          "description": "— Efecto de corrupción al cambiar (reflected)",
          "attribute": "glitch"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "No usa slots; las opciones se pasan vía `.options`"
        }
      ],
      "events": [
        {
          "name": "ui-lib-change",
          "type": "CustomEvent",
          "description": "— Al cambiar la selección Detail: { value: string, previousValue: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-select",
    "name": "Select",
    "slug": "lib-select",
    "tagName": "lib-select",
    "description": "Dropdown select component with single selection and custom option rendering.",
    "version": "1.1.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible",
      "dropdown"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "attribute": "label"
        },
        {
          "name": "placeholder",
          "type": "string",
          "default": "'Selecciona una opción'",
          "attribute": "placeholder"
        },
        {
          "name": "hint",
          "type": "string",
          "default": "''",
          "attribute": "hint"
        },
        {
          "name": "errorMessage",
          "type": "string",
          "default": "''",
          "attribute": "error-message"
        },
        {
          "name": "required",
          "type": "boolean",
          "default": "false",
          "attribute": "required"
        },
        {
          "name": "optional",
          "type": "boolean",
          "default": "false",
          "attribute": "optional"
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "attribute": "open"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "attribute": "disabled"
        },
        {
          "name": "error",
          "type": "boolean",
          "default": "false",
          "attribute": "error"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "attribute": "dark"
        },
        {
          "name": "size",
          "type": "SelectSize",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "variant",
          "type": "SelectVariant",
          "default": "'default'",
          "attribute": "variant",
          "options": [
            "default",
            "filled",
            "ghost"
          ]
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "attribute": "value"
        },
        {
          "name": "multi",
          "type": "boolean",
          "default": "false",
          "attribute": "multi"
        },
        {
          "name": "searchable",
          "type": "boolean",
          "default": "false",
          "attribute": "searchable"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "lib-select-option children"
        }
      ],
      "events": [
        {
          "name": "ui-lib-select-open",
          "type": "CustomEvent",
          "description": "— Panel abierto"
        },
        {
          "name": "ui-lib-select-close",
          "type": "CustomEvent",
          "description": "— Panel cerrado"
        },
        {
          "name": "ui-lib-select-change",
          "type": "CustomEvent",
          "description": "— Single: { value, label }"
        },
        {
          "name": "ui-lib-select-multi-change",
          "type": "CustomEvent",
          "description": "— Multi:  { values, labels }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-select-option",
    "name": "Select Option",
    "slug": "lib-select-option",
    "tagName": "lib-select-option",
    "description": "Individual option item for use inside lib-select components.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "Valor interno que se comunica al select padre.",
          "attribute": "value"
        },
        {
          "name": "selected",
          "type": "boolean",
          "default": "false",
          "description": "Estado de selección — controlado por lib-select.",
          "attribute": "selected"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Deshabilita la opción.",
          "attribute": "disabled"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Texto visible de la opción"
        }
      ],
      "events": [
        {
          "name": "option-selected",
          "type": "CustomEvent",
          "description": "— { value: string, label: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-sidebar",
    "name": "Sidebar",
    "slug": "lib-sidebar",
    "tagName": "lib-sidebar",
    "description": "Collapsible side navigation panel with slot-based content.",
    "version": "0.9.0",
    "status": "draft",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "layout"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "logoMark",
          "type": "string",
          "default": "'渋'",
          "description": "— Carácter del logo mark (default '渋')",
          "attribute": "logo-mark"
        },
        {
          "name": "brandName",
          "type": "string",
          "default": "'shibui'",
          "description": "— Nombre de marca (default 'shibui')",
          "attribute": "brand-name"
        },
        {
          "name": "showSearch",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra la barra de búsqueda",
          "attribute": "show-search"
        },
        {
          "name": "searchPlaceholder",
          "type": "string",
          "default": "'Buscar…'",
          "description": "— Placeholder del input de búsqueda",
          "attribute": "search-placeholder"
        },
        {
          "name": "links",
          "type": "SidebarLink[]",
          "default": "[]",
          "description": "— Array de SidebarLink[]",
          "attribute": "links"
        },
        {
          "name": "active",
          "type": "string",
          "default": "''",
          "description": "— ID del link activo",
          "attribute": "active"
        },
        {
          "name": "userName",
          "type": "string",
          "default": "''",
          "description": "— Nombre del usuario en el footer",
          "attribute": "user-name"
        },
        {
          "name": "userRole",
          "type": "string",
          "default": "''",
          "description": "— Rol/plan del usuario",
          "attribute": "user-role"
        },
        {
          "name": "userAvatar",
          "type": "string",
          "default": "''",
          "description": "— URL de imagen del avatar",
          "attribute": "user-avatar"
        },
        {
          "name": "userInitials",
          "type": "string",
          "default": "''",
          "description": "— Iniciales de fallback",
          "attribute": "user-initials"
        },
        {
          "name": "showUserAction",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra el botón de acción (logout icon)",
          "attribute": "show-user-action"
        },
        {
          "name": "theme",
          "type": "SidebarTheme",
          "default": "'dark'",
          "description": "— 'dark'(default) | 'light'",
          "attribute": "theme",
          "options": [
            "dark",
            "light"
          ]
        },
        {
          "name": "collapsed",
          "type": "boolean",
          "default": "false",
          "description": "— Estado inicial colapsado",
          "attribute": "collapsed"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-navigate",
          "type": "CustomEvent",
          "description": "— { id, previous }"
        },
        {
          "name": "ui-lib-user-action",
          "type": "CustomEvent",
          "description": "— void (clic en botón de acción)"
        },
        {
          "name": "ui-lib-search",
          "type": "CustomEvent",
          "description": "— { query: string }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-skeleton",
    "name": "Skeleton",
    "slug": "lib-skeleton",
    "tagName": "lib-skeleton",
    "description": "Placeholder loading state with configurable shape and animation.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "loading"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "shape",
          "type": "LibSkeletonShape",
          "default": "'rect'",
          "description": "Forma semántica del bloque.\nCada shape tiene una altura por defecto en CSS:\n- line   : 13px\n- title  : 22px\n- h1     : 36px\n- avatar : border-radius full (width/height obligatorio)\n- icon   : border-radius sm  (width/height obligatorio)\n- btn    : 36px\n- badge  : 20px\n- pill   : 22px, border-radius full\n- img    : 160px\n- rect   : sin altura — usar `height` prop",
          "attribute": "shape",
          "options": [
            "line",
            "title",
            "h1",
            "avatar",
            "icon",
            "btn",
            "badge",
            "pill",
            "img",
            "rect"
          ]
        },
        {
          "name": "animation",
          "type": "LibSkeletonAnimation",
          "default": "'shimmer'",
          "description": "Tipo de animación.\n- shimmer : barrido de luz lateral (default)\n- wave    : barrido más lento y orgánico\n- pulse   : opacidad, sin movimiento",
          "attribute": "animation",
          "options": [
            "shimmer",
            "wave",
            "pulse"
          ]
        },
        {
          "name": "surface",
          "type": "LibSkeletonSurface",
          "default": "'default'",
          "description": "Superficie de fondo.\n- default : washi-200 → washi-100 (fondo claro)\n- dark    : washi-800 → washi-700\n\nEl tinte semántico (accent/info) se controla aparte vía `tone`.\nBajo `data-katachi=\"celadon\"` el shimmer adopta el jade info\nautomáticamente sin necesidad de pasar `tone`.",
          "attribute": "surface",
          "options": [
            "default",
            "dark"
          ]
        },
        {
          "name": "tone",
          "type": "LibSkeletonTone",
          "default": "'default'",
          "description": "Tinte semántico del shimmer.\n- default : sin tinte (usa la superficie)\n- accent  : kaki-200 → kaki-100\n- info    : jade oscuro oklch(22%→32% / 175deg)",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "width",
          "type": "string",
          "default": "'100%'",
          "description": "Anchura del bloque. Default: 100%",
          "attribute": "width"
        },
        {
          "name": "height",
          "type": "string",
          "default": "''",
          "description": "Altura del bloque.\nSi no se especifica, el CSS usa la altura propia de cada `shape`.\nObligatorio para `avatar`, `icon` y `rect`.",
          "attribute": "height"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "(vacío) El componente es puramente visual, sin contenido."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-spacer",
    "name": "Spacer",
    "slug": "lib-spacer",
    "tagName": "lib-spacer",
    "description": "Utility component for adding consistent spacing between elements.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0004-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "layout",
      "utility"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "size",
          "type": "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
          "default": "'md'",
          "attribute": "size",
          "options": [
            "xs",
            "sm",
            "md",
            "lg",
            "xl"
          ]
        },
        {
          "name": "horizontal",
          "type": "boolean",
          "default": "false",
          "attribute": "horizontal"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-sparkline",
    "name": "Sparkline",
    "slug": "lib-sparkline",
    "tagName": "lib-sparkline",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0007-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "chart",
      "data-viz"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "values",
          "type": "number[]",
          "default": "[]",
          "description": "— Serie de valores. Usar binding `.values=${...}`.",
          "attribute": "values"
        },
        {
          "name": "type",
          "type": "SparklineType",
          "default": "'line'",
          "description": "— 'line' (default) | 'area' | 'bar'.",
          "attribute": "type",
          "options": [
            "line",
            "area",
            "bar"
          ]
        },
        {
          "name": "tone",
          "type": "SparklineTone",
          "default": "'default'",
          "description": "— default | accent | info | success | warning | error.",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "success",
            "warning",
            "error"
          ]
        },
        {
          "name": "width",
          "type": "number",
          "default": "100",
          "description": "— Ancho en px. Default 100.",
          "attribute": "width"
        },
        {
          "name": "height",
          "type": "number",
          "default": "28",
          "description": "— Alto en px. Default 28.",
          "attribute": "height"
        },
        {
          "name": "smooth",
          "type": "boolean",
          "default": "false",
          "description": "— Suaviza la línea/área con curvas.",
          "attribute": "smooth"
        },
        {
          "name": "showEndDot",
          "type": "boolean",
          "default": "false",
          "description": "— Resalta el último punto.",
          "attribute": "show-end-dot"
        },
        {
          "name": "min",
          "type": "number",
          "default": "null",
          "description": "— Fuerza el mínimo del dominio (para escalas comparables).",
          "attribute": "min"
        },
        {
          "name": "max",
          "type": "number",
          "default": "null",
          "description": "— Fuerza el máximo del dominio.",
          "attribute": "max"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-spinner",
    "name": "Spinner",
    "slug": "lib-spinner",
    "tagName": "lib-spinner",
    "description": "Animated loading indicator with size and variant options.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "loading"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "theme",
          "type": "SpinnerTheme",
          "default": "'enso'",
          "description": "Variante estética (default: enso).",
          "attribute": "theme",
          "options": [
            "enso",
            "sumi",
            "kin",
            "shizuku"
          ]
        },
        {
          "name": "size",
          "type": "SpinnerSize",
          "default": "'md'",
          "description": "Tamaño sm | md | lg (default: md).",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "tone",
          "type": "SpinnerTone",
          "default": "'default'",
          "description": "Tono de color (default: default).",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "Optimiza colores para fondos oscuros.",
          "attribute": "dark"
        },
        {
          "name": "label",
          "type": "string",
          "default": "'Cargando'",
          "description": "Texto accesible (default: 'Cargando').",
          "attribute": "label"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-spotlight-card",
    "name": "Spotlight Card",
    "slug": "lib-spotlight-card",
    "tagName": "lib-spotlight-card",
    "description": "Card with a cursor-following spotlight highlight and optional kintsugi effect.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "visual",
      "animation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "spotlight",
          "type": "LibSpotlightVariant",
          "default": "'accent'",
          "description": "Color del foco de luz.\n- accent : orgánico cálido — oklch(45% 0.05 45)  [default]\n- water  : azul sereno     — oklch(55% 0.06 210)\n- white  : neutro          — oklch(100% 0 0)\n\nNota: cuando `gold` está activo el spotlight es siempre accent.",
          "attribute": "spotlight",
          "options": [
            "accent",
            "water",
            "white"
          ]
        },
        {
          "name": "gold",
          "type": "boolean",
          "default": "false",
          "description": "Activa el hilo de oro en el borde (--lib-kintsugi-border)\ny cambia el fondo del contenedor a un tono cálido oscuro.\nEra `kintsugi`.",
          "attribute": "gold"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "Contenido de la card."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-stagger-container",
    "name": "Stagger Container",
    "slug": "lib-stagger-container",
    "tagName": "lib-stagger-container",
    "description": "Animates child elements in sequence with a configurable delay between each.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "delay",
          "type": "number",
          "default": "100",
          "description": "— ms entre cada item (default 100)",
          "attribute": "delay"
        },
        {
          "name": "duration",
          "type": "number",
          "default": "600",
          "description": "— duración de la animación en ms (default 600)",
          "attribute": "duration"
        },
        {
          "name": "direction",
          "type": "StaggerDirection",
          "default": "'up'",
          "description": "— 'up' | 'down' | 'left' | 'right' | 'fade'",
          "attribute": "direction",
          "options": [
            "up",
            "down",
            "left",
            "right",
            "fade"
          ]
        },
        {
          "name": "easing",
          "type": "StaggerEasing",
          "default": "'out'",
          "description": "— 'default' | 'out' | 'bounce'",
          "attribute": "easing",
          "options": [
            "default",
            "out",
            "bounce"
          ]
        },
        {
          "name": "threshold",
          "type": "number",
          "default": "0.15",
          "description": "— fracción del elemento visible para disparar (default 0.15)",
          "attribute": "threshold"
        },
        {
          "name": "once",
          "type": "boolean",
          "default": "true",
          "description": "— animar solo la primera vez (default true)",
          "attribute": "once"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Items a animar (cada hijo directo recibe su propio delay)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-stagger-visible",
          "type": "CustomEvent",
          "description": "— cuando el contenedor entra en viewport"
        },
        {
          "name": "ui-lib-stagger-hidden",
          "type": "CustomEvent",
          "description": "— cuando vuelve a salir (si once=false)"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-status-dot",
    "name": "Status Dot",
    "slug": "lib-status-dot",
    "tagName": "lib-status-dot",
    "description": "Small colored indicator for online, offline, busy and away states.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "status"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "status",
          "type": "LibStatusDotStatus",
          "default": "'offline'",
          "description": "Estado de presencia.\n- online  : celadón · onda mizu\n- away    : kaki · respiración iki\n- busy    : error · parpadeo hayai\n- offline : washi-400 · quietud ma",
          "attribute": "status",
          "options": [
            "online",
            "away",
            "busy",
            "offline"
          ]
        },
        {
          "name": "size",
          "type": "LibStatusDotSize",
          "default": "'md'",
          "description": "Tamaño del punto.\n- sm : 6px  — tablas y listas densas\n- md : 10px — uso general (default)\n- lg : 14px — alta visibilidad",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "bordered",
          "type": "boolean",
          "default": "false",
          "description": "Añade un halo blanco (`box-shadow: 0 0 0 2px --bg-elevated`)\npara separar el punto visualmente cuando se posiciona sobre un avatar.",
          "attribute": "bordered"
        },
        {
          "name": "label",
          "type": "boolean",
          "default": "false",
          "description": "Muestra el texto del estado (Online / Away / Busy / Offline)\nen línea con el punto. El color hereda el estado activo.",
          "attribute": "label"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-step",
    "name": "Step",
    "slug": "lib-step",
    "tagName": "lib-step",
    "description": "Individual step item for use inside lib-stepper. Supports status, label and orientation.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "stepper"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Texto principal del paso (requerido por el usuario).",
          "attribute": "label"
        },
        {
          "name": "sub",
          "type": "string",
          "default": "''",
          "description": "Texto secundario corto (opcional).",
          "attribute": "sub"
        },
        {
          "name": "index",
          "type": "number",
          "default": "1",
          "description": "Número ordinal del paso.\nInyectado automáticamente por lib-stepper.",
          "attribute": "index"
        },
        {
          "name": "status",
          "type": "LibStepStatus",
          "default": "'pending'",
          "description": "Estado visual del nodo.\nInyectado automáticamente por lib-stepper.\n- pending   : por defecto — nodo vacío\n- active    : paso en curso — fondo oscuro + halo\n- completed : paso superado — checkmark\n- error     : fallo — icono de exclamación",
          "attribute": "status",
          "options": [
            "pending",
            "active",
            "completed",
            "error"
          ]
        },
        {
          "name": "last",
          "type": "boolean",
          "default": "false",
          "description": "Marca el último paso del stepper (no renderiza conector).\nInyectado automáticamente por lib-stepper.",
          "attribute": "last"
        },
        {
          "name": "orientation",
          "type": "LibStepOrientation",
          "default": "'horizontal'",
          "description": "Dirección del flujo. Inyectado por lib-stepper.",
          "attribute": "orientation",
          "options": [
            "horizontal",
            "vertical"
          ]
        },
        {
          "name": "theme",
          "type": "LibStepTheme",
          "default": "'default'",
          "description": "Variante visual. Inyectada por lib-stepper.\n- default  : nodo circular washi\n- minimal  : nodo cuadrado kaki\n- inverse  : venas doradas sobre superficie oscura (era kintsugi)",
          "attribute": "theme",
          "options": [
            "default",
            "minimal",
            "inverse",
            "brutal"
          ]
        },
        {
          "name": "size",
          "type": "LibStepSize",
          "default": "'md'",
          "description": "Tamaño del nodo. Inyectado por lib-stepper.\n- sm : 24px\n- md : 32px (default)\n- lg : 40px",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-stepper",
    "name": "Stepper",
    "slug": "lib-stepper",
    "tagName": "lib-stepper",
    "description": "Multi-step progress indicator supporting horizontal and vertical orientations.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "current",
          "type": "number",
          "default": "1",
          "description": "Paso activo actual (1-based).\nLos pasos anteriores quedan como `completed`, los posteriores como `pending`.",
          "attribute": "current"
        },
        {
          "name": "orientation",
          "type": "LibStepperOrientation",
          "default": "'horizontal'",
          "description": "Dirección del flujo.\n- horizontal : barra horizontal con conectores (default)\n- vertical   : lista vertical con contenido expandido por paso",
          "attribute": "orientation",
          "options": [
            "horizontal",
            "vertical"
          ]
        },
        {
          "name": "theme",
          "type": "LibStepperTheme",
          "default": "'default'",
          "description": "Variante visual. Se propaga a todos los lib-step hijos.\n- default  : nodo circular washi\n- minimal  : nodo cuadrado, acento kaki\n- inverse : venas doradas, pensado para superficies oscuras",
          "attribute": "theme",
          "options": [
            "default",
            "minimal",
            "inverse"
          ]
        },
        {
          "name": "size",
          "type": "LibStepperSize",
          "default": "'md'",
          "description": "Tamaño de los nodos. Se propaga a todos los lib-step hijos.\n- sm : 24px · md : 32px (default) · lg : 40px",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-step-change",
          "description": "— Emitido al cambiar `current` con `{ current: number, total: number }`"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-switch",
    "name": "Switch",
    "slug": "lib-switch",
    "tagName": "lib-switch",
    "description": "Toggle switch for binary on/off states with label support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form",
      "accessible",
      "interactive"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "checked",
          "type": "boolean",
          "default": "false",
          "description": "Estado activo del switch.",
          "attribute": "checked"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "Deshabilita la interacción.",
          "attribute": "disabled"
        },
        {
          "name": "surface",
          "type": "LibSwitchSurface",
          "default": "'default'",
          "description": "Variante visual.\n- default   : track washi, thumb blanco\n- inverse  : cerámica oscura, venas doradas, thumb de oro al activar",
          "attribute": "surface",
          "options": [
            "default",
            "inverse"
          ]
        },
        {
          "name": "size",
          "type": "LibSwitchSize",
          "default": "'md'",
          "description": "Tamaño del switch.\n- sm : 30×18px · md : 40×24px (default) · lg : 52×30px",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "label",
          "type": "string",
          "default": "''",
          "description": "Texto principal de la etiqueta.",
          "attribute": "label"
        },
        {
          "name": "sub",
          "type": "string",
          "default": "''",
          "description": "Texto secundario debajo del label.",
          "attribute": "sub"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-change",
          "type": "CustomEvent",
          "description": "— Emitido al cambiar estado con `{ checked: boolean }`"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-tabs",
    "name": "Tabs",
    "slug": "lib-tabs",
    "tagName": "lib-tabs",
    "description": "Tabbed interface for switching between related content panels.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0002-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "navigation",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "display",
          "type": "TabsDisplay",
          "default": "\"underline\"",
          "description": "— 'underline' | 'pill' | 'card' | 'outline' | 'vertical'",
          "attribute": "display",
          "options": [
            "underline",
            "pill",
            "card",
            "outline",
            "vertical"
          ]
        },
        {
          "name": "tone",
          "type": "TabsTone",
          "default": "\"default\"",
          "description": "— 'default' | 'accent' | 'info'",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info"
          ]
        },
        {
          "name": "size",
          "type": "TabsSize | undefined",
          "description": "— 'sm' | 'md' | 'lg'",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— surface oscura",
          "attribute": "dark"
        },
        {
          "name": "gold",
          "type": "boolean",
          "default": "false",
          "description": "— ink bar animada dorada (era kintsugi)",
          "attribute": "gold"
        },
        {
          "name": "glitch",
          "type": "boolean",
          "default": "false",
          "description": "— efecto RGB split en tab activo",
          "attribute": "glitch"
        },
        {
          "name": "scrollable",
          "type": "boolean",
          "default": "false",
          "description": "— overflow-x scroll en la lista",
          "attribute": "scrollable"
        },
        {
          "name": "full",
          "type": "boolean",
          "default": "false",
          "description": "— tabs en grid de columnas iguales",
          "attribute": "full"
        },
        {
          "name": "active",
          "type": "string",
          "default": "\"\"",
          "description": "— id del tab activo",
          "attribute": "active"
        },
        {
          "name": "ariaLabel",
          "type": "string",
          "default": "\"\"",
          "description": "aria-label para el tablist",
          "attribute": "aria-label"
        },
        {
          "name": "closable",
          "type": "boolean",
          "default": "false",
          "description": "— muestra botón × en todos los tabs (item.closable sobreescribe por tab) ── Extras estilo IDE (opt-in, apagados por defecto) ──",
          "attribute": "closable"
        },
        {
          "name": "newTab",
          "type": "boolean",
          "default": "false",
          "description": "— muestra un botón \"+\" al final de la lista (attribute: new-tab)",
          "attribute": "new-tab"
        },
        {
          "name": "reorderable",
          "type": "boolean",
          "default": "false",
          "description": "— permite reordenar los tabs arrastrándolos",
          "attribute": "reorderable"
        },
        {
          "name": "items",
          "type": "TabItem[]",
          "default": "[]",
          "description": "— array de TabItem Panels: cada TabItem con id=\"X\" se muestra via <slot name=\"X\">. El usuario añade <div slot=\"X\">contenido</div> como hijo de lib-tabs.",
          "attribute": "items"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-tab-change",
          "type": "CustomEvent",
          "description": "— {detail: { id: string; prev: string }}"
        },
        {
          "name": "ui-lib-tab-close",
          "type": "CustomEvent",
          "description": "— {detail: { id: string }} — al pulsar × o hacer click central"
        },
        {
          "name": "ui-lib-tab-new",
          "type": "CustomEvent",
          "description": "— void — al pulsar el botón \"+\""
        },
        {
          "name": "ui-lib-tab-reorder",
          "type": "CustomEvent",
          "description": "— {detail: { id: string; fromIndex: number; toIndex: number }}"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-text-editor",
    "name": "Text Editor",
    "slug": "lib-text-editor",
    "tagName": "lib-text-editor",
    "description": "",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0001-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "files",
          "type": "EditorFile[]",
          "default": "[]",
          "description": "— Ficheros abiertos. Cada item incluye id, filename, content y dirty.",
          "attribute": "files"
        },
        {
          "name": "active",
          "type": "string",
          "default": "''",
          "description": "— Id del fichero activo.",
          "attribute": "active"
        },
        {
          "name": "saving",
          "type": "boolean",
          "default": "false",
          "description": "— Guardado en curso (deshabilita botón Save).",
          "attribute": "saving"
        },
        {
          "name": "showOpen",
          "type": "boolean",
          "default": "false",
          "description": "Muestra el botón \"Abrir\" en el toolbar.",
          "attribute": "show-open"
        },
        {
          "name": "placeholder",
          "type": "string",
          "default": "'Abre o crea un fichero para empezar'",
          "description": "— Texto vacío cuando no hay ficheros.",
          "attribute": "placeholder"
        },
        {
          "name": "readonly",
          "type": "boolean",
          "default": "false",
          "description": "— Textarea en modo solo lectura.",
          "attribute": "readonly"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-text-editor-tab-change",
          "type": "CustomEvent",
          "description": "— El usuario cambia de pestaña. `{ id, prev }`."
        },
        {
          "name": "ui-lib-text-editor-change",
          "type": "CustomEvent",
          "description": "— El usuario modifica el contenido. `{ id, content }`."
        },
        {
          "name": "ui-lib-text-editor-new",
          "type": "CustomEvent",
          "description": "— El usuario pide un fichero nuevo."
        },
        {
          "name": "ui-lib-text-editor-open",
          "type": "CustomEvent",
          "description": "— El usuario pide abrir un fichero."
        },
        {
          "name": "ui-lib-text-editor-save",
          "type": "CustomEvent",
          "description": "— El usuario pide guardar. `{ id, content }`."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-text-glitch",
    "name": "Text Glitch",
    "slug": "lib-text-glitch",
    "tagName": "lib-text-glitch",
    "description": "Text element with a configurable glitch animation effect.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "animation",
      "text"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "text",
          "type": "string",
          "default": "''",
          "description": "Texto a renderizar y distorsionar.",
          "attribute": "text"
        },
        {
          "name": "theme",
          "type": "TextGlitchTheme",
          "default": "'slice'",
          "description": "Efecto visual: slice | scan | shift | decode | redact | noise.",
          "attribute": "theme",
          "options": [
            "slice",
            "scan",
            "shift",
            "decode",
            "redact",
            "noise"
          ]
        },
        {
          "name": "trigger",
          "type": "TextGlitchTrigger",
          "default": "'hover'",
          "description": "Modo de activación: hover | always.",
          "attribute": "trigger",
          "options": [
            "hover",
            "always"
          ]
        },
        {
          "name": "active",
          "type": "boolean",
          "default": "false",
          "description": "Activa el efecto programáticamente (reflectado en atributo).",
          "attribute": "active"
        }
      ],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-text-list",
    "name": "Text List",
    "slug": "lib-text-list",
    "tagName": "lib-text-list",
    "description": "Skeleton-aware list of text items with configurable variants.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "family",
          "type": "ListFamily",
          "default": "'ul'",
          "description": "— Familia activa (default: 'ul') — Content list —",
          "attribute": "family",
          "options": [
            "ul",
            "ol",
            "ui",
            "dl"
          ]
        },
        {
          "name": "items",
          "type": "ContentItem[]",
          "default": "[]",
          "description": "— Ítems de contenido",
          "attribute": "items"
        },
        {
          "name": "marker",
          "type": "ContentMarker",
          "default": "'default'",
          "description": "— Tipo de viñeta (default: 'default')",
          "attribute": "marker",
          "options": [
            "default",
            "accent",
            "dash",
            "check"
          ]
        },
        {
          "name": "counter",
          "type": "OrderedCounter",
          "default": "'decimal'",
          "description": "— Tipo de contador ol (default: 'decimal')",
          "attribute": "counter",
          "options": [
            "decimal",
            "roman",
            "alpha"
          ]
        },
        {
          "name": "size",
          "type": "ListSize",
          "default": "'md'",
          "description": "— Tamaño (default: 'md') — UI list —",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "uiItems",
          "type": "UiItem[]",
          "default": "[]",
          "description": "— Filas, separadores y headers",
          "attribute": "ui-items"
        },
        {
          "name": "divided",
          "type": "boolean",
          "default": "false",
          "description": "— Separadores entre filas",
          "attribute": "divided"
        },
        {
          "name": "bordered",
          "type": "boolean",
          "default": "false",
          "description": "— Borde exterior",
          "attribute": "bordered"
        },
        {
          "name": "inset",
          "type": "boolean",
          "default": "false",
          "description": "— Fondo de superficie",
          "attribute": "inset"
        },
        {
          "name": "interactive",
          "type": "boolean",
          "default": "false",
          "description": "— Hover + cursor pointer — Description list —",
          "attribute": "interactive"
        },
        {
          "name": "dlItems",
          "type": "DlItem[]",
          "default": "[]",
          "description": "— Pares clave/valor",
          "attribute": "dl-items"
        },
        {
          "name": "dlLayout",
          "type": "DlLayout",
          "default": "'inline'",
          "description": "— Layout (default: 'inline')",
          "attribute": "dl-layout",
          "options": [
            "inline",
            "wide",
            "stack"
          ]
        },
        {
          "name": "dlDivided",
          "type": "boolean",
          "default": "false",
          "description": "— Separadores entre pares — Global —",
          "attribute": "dl-divided"
        },
        {
          "name": "dark",
          "type": "boolean",
          "default": "false",
          "description": "— Superficie oscura",
          "attribute": "dark"
        },
        {
          "name": "loading",
          "type": "boolean",
          "default": "false",
          "description": "— Estado de carga (skeleton)",
          "attribute": "loading"
        },
        {
          "name": "skeletonCount",
          "type": "number",
          "default": "4",
          "description": "— Número de skeletons (default: 4)",
          "attribute": "skeleton-count"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-row-click",
          "type": "CustomEvent",
          "description": "— Al hacer clic en una fila UI Detail: { key: string, item: UiRow }"
        },
        {
          "name": "ui-lib-toggle",
          "type": "CustomEvent",
          "description": "— Al cambiar un toggle en una fila UI Detail: { key: string, value: boolean }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-timeline",
    "name": "Timeline",
    "slug": "lib-timeline",
    "tagName": "lib-timeline",
    "description": "Vertical list of chronological events with icon and variant support.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "size",
          "type": "TimelineSize",
          "default": "'md'",
          "description": "— Tamaño global: sm · md · lg (default: 'md')",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Ítems del timeline (lib-timeline-item)"
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-timeline-item",
    "name": "Timeline Item",
    "slug": "lib-timeline-item",
    "tagName": "lib-timeline-item",
    "description": "Individual event item for use inside lib-timeline.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "nKind",
          "type": "TimelineNodeType",
          "default": "'dot'",
          "description": "— Tipo de nodo: dot · icon · avatar (default: 'dot')",
          "attribute": "node-type",
          "options": [
            "dot",
            "icon",
            "avatar"
          ]
        },
        {
          "name": "nodeColor",
          "type": "TimelineNodeColor",
          "default": "'default'",
          "description": "— Color del nodo: default · accent · info · error · muted",
          "attribute": "node-color",
          "options": [
            "default",
            "accent",
            "info",
            "error",
            "muted"
          ]
        },
        {
          "name": "icon",
          "type": "string",
          "default": "'circle'",
          "description": "— Nombre de icono Phosphor (node-type='icon')",
          "attribute": "icon"
        },
        {
          "name": "avatar",
          "type": "string",
          "default": "''",
          "description": "— Iniciales (node-type='avatar')",
          "attribute": "avatar"
        },
        {
          "name": "status",
          "type": "TimelineItemStatus",
          "default": "'default'",
          "description": "— Estado: default · active · done · error · pending",
          "attribute": "status",
          "options": [
            "default",
            "active",
            "done",
            "error",
            "pending"
          ]
        },
        {
          "name": "lineVariant",
          "type": "TimelineLineVariant",
          "default": "'solid'",
          "description": "— Estilo de línea: solid · dashed · progress",
          "attribute": "line-variant",
          "options": [
            "solid",
            "dashed",
            "progress"
          ]
        },
        {
          "name": "lineProgress",
          "type": "number",
          "default": "0",
          "description": "— Progreso de la línea 0–100 (line-variant='progress')",
          "attribute": "line-progress"
        },
        {
          "name": "hideLine",
          "type": "boolean",
          "default": "false",
          "description": "— Oculta la línea (útil en el último ítem)",
          "attribute": "hide-line"
        },
        {
          "name": "timestamp",
          "type": "string",
          "default": "''",
          "description": "— Texto de fecha/hora",
          "attribute": "timestamp"
        },
        {
          "name": "title",
          "type": "string",
          "default": "''",
          "description": "— Título del evento",
          "attribute": "title"
        },
        {
          "name": "body",
          "type": "string",
          "default": "''",
          "description": "— Texto descriptivo (alternativa al slot)",
          "attribute": "body"
        },
        {
          "name": "card",
          "type": "boolean",
          "default": "false",
          "description": "— Envuelve el contenido en una tarjeta con borde",
          "attribute": "card"
        },
        {
          "name": "collapsible",
          "type": "boolean",
          "default": "false",
          "description": "— Muestra botón de expandir/contraer",
          "attribute": "collapsible"
        },
        {
          "name": "tooltip",
          "type": "string",
          "default": "''",
          "description": "— Texto que muestra el nodo en hover (lib-tooltip)",
          "attribute": "tooltip"
        },
        {
          "name": "tooltipPosition",
          "type": "TooltipPosition",
          "default": "'right'",
          "description": "— Posición de la burbuja (default: 'right')",
          "attribute": "tooltip-position",
          "options": [
            "top",
            "bottom",
            "left",
            "right",
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end"
          ]
        },
        {
          "name": "tooltipSurface",
          "type": "TooltipSurface",
          "default": "'dark'",
          "description": "— Superficie de la burbuja (default: 'dark')",
          "attribute": "tooltip-surface",
          "options": [
            "dark",
            "light"
          ]
        },
        {
          "name": "tooltipTone",
          "type": "TooltipTone",
          "default": "'default'",
          "description": "— Tinte semántico de la burbuja (default: 'default')",
          "attribute": "tooltip-tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "clickable",
          "type": "boolean",
          "default": "false",
          "description": "— Hace la card/contenido interactivo y emite evento al click",
          "attribute": "clickable"
        },
        {
          "name": "href",
          "type": "string",
          "default": "''",
          "description": "— URL de navegación; navega de forma nativa salvo preventDefault",
          "attribute": "href"
        },
        {
          "name": "target",
          "type": "string",
          "default": "''",
          "description": "— Target del enlace (p.ej. '_blank') cuando hay href",
          "attribute": "target"
        },
        {
          "name": "value",
          "type": "string",
          "default": "''",
          "description": "— Identificador libre incluido en el detalle del evento",
          "attribute": "value"
        }
      ],
      "slots": [
        {
          "name": "—",
          "description": "Contenido libre (body del evento)"
        },
        {
          "name": "meta",
          "description": "— Badges, avatares y metadatos en fila"
        },
        {
          "name": "media",
          "description": "— Imágenes o bloques adjuntos (solo dentro de card)"
        },
        {
          "name": "tooltip",
          "description": "— Contenido rico del tooltip del nodo (tip-title, tip-body…)"
        }
      ],
      "events": [
        {
          "name": "ui-lib-timeline-item-click",
          "type": "CustomEvent",
          "description": "— Al activar (click/Enter/Space) un ítem clickable o con href. detail: { value, href, title, timestamp, originalEvent }. Cancelable."
        }
      ]
    }
  },
  {
    "id": "cmp-lib-toast-manager",
    "name": "Toast Manager",
    "slug": "lib-toast-manager",
    "tagName": "lib-toast-manager",
    "description": "Global toast notification manager. Dispatches toasts via custom events.",
    "version": "1.0.2",
    "status": "stable",
    "categoryId": "cat-0003-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "feedback",
      "notification",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [],
      "slots": [],
      "events": []
    }
  },
  {
    "id": "cmp-lib-tooltip",
    "name": "Tooltip",
    "slug": "lib-tooltip",
    "tagName": "lib-tooltip",
    "description": "Floating content shown on hover with configurable position.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "accessible"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "position",
          "type": "TooltipPosition",
          "default": "'top'",
          "description": "Posición de la burbuja (default: top).",
          "attribute": "position",
          "options": [
            "top",
            "bottom",
            "left",
            "right",
            "top-start",
            "top-end",
            "bottom-start",
            "bottom-end"
          ]
        },
        {
          "name": "surface",
          "type": "TooltipSurface",
          "default": "'dark'",
          "description": "Superficie dark | light (default: dark).",
          "attribute": "surface",
          "options": [
            "dark",
            "light"
          ]
        },
        {
          "name": "tone",
          "type": "TooltipTone",
          "default": "'default'",
          "description": "Tinte semántico default | accent | info | error (default: default).",
          "attribute": "tone",
          "options": [
            "default",
            "accent",
            "info",
            "error"
          ]
        },
        {
          "name": "size",
          "type": "TooltipSize",
          "default": "'md'",
          "description": "Tamaño sm | md | lg (default: md).",
          "attribute": "size",
          "options": [
            "sm",
            "md",
            "lg"
          ]
        },
        {
          "name": "content",
          "type": "string",
          "default": "''",
          "description": "Texto simple. Para contenido rico usa slot=\"content\".",
          "attribute": "content"
        },
        {
          "name": "instant",
          "type": "boolean",
          "default": "false",
          "description": "Elimina el delay de entrada de 300ms.",
          "attribute": "instant"
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "Abre la burbuja programáticamente.",
          "attribute": "open"
        }
      ],
      "slots": [
        {
          "name": "",
          "description": "El trigger (cualquier elemento interactivo)."
        },
        {
          "name": "content",
          "description": "Contenido rico de la burbuja (tip-title, tip-body, tip-kbd, tip-sep)."
        }
      ],
      "events": []
    }
  },
  {
    "id": "cmp-lib-tree-select",
    "name": "Tree Select",
    "slug": "lib-tree-select",
    "tagName": "lib-tree-select",
    "description": "Hierarchical data selector with expandable tree structure.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0005-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "data-display",
      "form"
    ],
    "docsUrl": null,
    "api": {
      "props": [
        {
          "name": "nodes",
          "type": "TreeNode[]",
          "default": "[]",
          "description": "— Árbol de datos",
          "attribute": "nodes"
        },
        {
          "name": "multi",
          "type": "boolean",
          "default": "false",
          "description": "— Selección múltiple (con checkboxes)",
          "attribute": "multi"
        },
        {
          "name": "inline",
          "type": "boolean",
          "default": "false",
          "description": "— Sin dropdown, árbol directo en layout",
          "attribute": "inline"
        },
        {
          "name": "searchable",
          "type": "boolean",
          "default": "true",
          "description": "— Mostrar barra de búsqueda",
          "attribute": "searchable"
        },
        {
          "name": "open",
          "type": "boolean",
          "default": "false",
          "description": "— Estado del dropdown (reflected)",
          "attribute": "open"
        },
        {
          "name": "disabled",
          "type": "boolean",
          "default": "false",
          "description": "— Deshabilitado (reflected)",
          "attribute": "disabled"
        },
        {
          "name": "placeholder",
          "type": "string",
          "default": "'Seleccionar…'",
          "description": "— Texto cuando no hay selección",
          "attribute": "placeholder"
        },
        {
          "name": "emptyText",
          "type": "string",
          "default": "'Sin resultados'",
          "description": "— Texto sin resultados de búsqueda",
          "attribute": "empty-text"
        }
      ],
      "slots": [],
      "events": [
        {
          "name": "ui-lib-tree-confirm",
          "type": "CustomEvent",
          "description": "— Al pulsar \"Aplicar\" (solo multi dropdown) Detail: { selected: TreeNode[], ids: string[] }"
        },
        {
          "name": "ui-lib-tree-change",
          "type": "CustomEvent",
          "description": "— Cada vez que cambia la selección Detail: { selected: TreeNode[], ids: string[] }"
        }
      ]
    }
  },
  {
    "id": "cmp-lib-visually-hidden",
    "name": "Visually Hidden",
    "slug": "lib-visually-hidden",
    "tagName": "lib-visually-hidden",
    "description": "Accessibility utility that hides content visually while keeping it accessible to screen readers.",
    "version": "1.0.0",
    "status": "stable",
    "categoryId": "cat-0006-0000-0000-000000000000",
    "packageName": "@shibui-ui/ui",
    "tags": [
      "accessible",
      "utility"
    ],
    "docsUrl": null,
    "api": {
      "props": [],
      "slots": [],
      "events": []
    }
  }
];
