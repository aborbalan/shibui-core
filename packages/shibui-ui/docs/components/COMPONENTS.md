# Inventario de Componentes — Shibui UI

Componentes organizados por nivel de diseño atómico. Para convenciones de estructura de ficheros, tokens y estándares de código ver `CONVENTIONS.md`.

> ⚠️ **Nota:** `text-glitch` tiene un typo en el barrel `src/index.ts` (`text-glich`). Pendiente de corregir.

---

## Átomos

Elementos indivisibles, stateless. Reciben datos vía propiedades y comunican acciones emitiendo eventos custom.

| Componente | Descripción |
|---|---|
| `accordion-item` | Ítem individual de un acordeón |
| `aspect-ratio` | Contenedor que mantiene una relación de aspecto fija |
| `avatar` | Imagen de perfil o representación con placeholder |
| `badge` | Indicador visual pequeño para estado, notificaciones o etiquetas |
| `bento-item` | Celda para composiciones de bento grid |
| `burger-button` | Botón hamburguesa con múltiples variantes de animación |
| `button` | Elemento interactivo base con variantes |
| `card` | Contenedor para agrupar contenido relacionado |
| `checkbox` | Control de selección binaria para formularios |
| `close-button` | Botón específico para cerrar diálogos, modales o descartar contenido |
| `copy-button` | Botón para copiar contenido al portapapeles |
| `counter` | Contador animado con efecto digit-flip y soporte para delta |
| `divider` | Separador visual entre secciones |
| `glass-card` | Card con efecto glassmorphism (Efecto Agua) |
| `icon` | Símbolo visual — wrapper de Phosphor Icons vía `lib-icon` |
| `kbd` | Representación de tecla de teclado |
| `label` | Etiqueta de texto para inputs y elementos de formulario |
| `liquid-button` | Botón con efecto líquido interactivo |
| `magnetic` | Efecto magnético de atracción al cursor |
| `lib-panel` | Contenedor panel para organizar secciones |
| `progress` | Barra de progreso lineal |
| `progress-circle` | Indicador de progreso circular |
| `radio` | Control de selección única para grupos de opciones |
| `rating` | Control de valoración por estrellas |
| `reading-progress` | Indicador de progreso de lectura con variantes bar, ring, dots y vertical |
| `ripple` | Efecto ripple sobre elementos interactivos |
| `select-option` | Opción individual dentro de un select |
| `skeleton` | Placeholder de carga que imita la estructura del contenido |
| `spacer` | Espaciador utilitario para layouts |
| `spinner` | Indicador de carga para operaciones asíncronas |
| `spotlight-card` | Card con efecto spotlight reactivo al cursor (Kintsugi Digital) |
| `status-dot` | Pequeño indicador de color para representar estados |
| `step` | Paso individual dentro de un stepper |
| `switch` | Control toggle para estados binarios on/off |
| `text-glitch` | Efecto de glitch tipográfico animado |
| `text-list` | Lista estilizada para mostrar elementos de texto |
| `tooltip` | Información contextual al hacer hover |
| `visually-hidden` | Elemento accesible oculto visualmente para lectores de pantalla |

---

## Moléculas

Grupos funcionales simples formados por combinación de átomos. Gestionan estado interno relacionado con la interacción del usuario.

| Componente | Descripción |
|---|---|
| `avatar-group` | Grupo de avatares apilados |
| `breadcrumb` | Navegación que muestra la ubicación actual en la jerarquía |
| `button-group` | Colección de botones relacionados agrupados |
| `chip` | Etiqueta interactiva compacta para filtros o selecciones |
| `color-picker` | Selector de color |
| `dropdown` | Menú desplegable con opciones |
| `empty-state` | Estado vacío con mensaje e ilustración |
| `file-uploader` | Control para subir ficheros |
| `form-field` | Campo de formulario completo con label, input y mensaje de error |
| `input` | Campo de texto con slots prefix/suffix y estados de validación |
| `lib-alert` | Alerta para mensajes informativos, de aviso, error o éxito |
| `modal` | Ventana overlay para mostrar contenido sobre la interfaz principal |
| `multiselect` | Dropdown con selección múltiple |
| `pagination` | Control de paginación |
| `profile-card` | Tarjeta de perfil combinando avatar, nombre e información adicional |
| `range-slider` | Control deslizante para selección de rango numérico |
| `segmented-control` | Selector de opciones mutuamente excluyentes en formato segmentado |
| `select` | Dropdown para selección única |
| `table-search` | Búsqueda integrada para tablas |
| `tabs` | Navegación por pestañas para organizar contenido en vistas separadas |
| `tree-select` | Selector con estructura de árbol jerárquico |

---

## Organismos

Secciones complejas y autónomas formadas por moléculas y átomos. Gestionan lógica y estado interno complejo.

| Componente | Descripción |
|---|---|
| `accordion` | Contenido expandible y colapsable por secciones |
| `carousel` | Visualización de contenido en formato carrusel |
| `data-table` | Tabla de datos con funcionalidades avanzadas |
| `dialog` | Ventana modal que requiere interacción del usuario |
| `drawer` | Panel lateral deslizante |
| `lib-auth-form` | Formulario de autenticación (login y registro) |
| `lib-list` | Lista compleja con filtrado, ordenación y paginación |
| `sidebar` | Panel de navegación lateral colapsable |
| `stepper` | Flujo de pasos secuenciales |
| `timeline` | Visualización cronológica de eventos |