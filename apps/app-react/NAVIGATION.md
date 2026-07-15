# Navegación completa — app-react

## Árbol de navegación

```
app-react/
│
├── PÚBLICO  (PublicLayout → Header + Footer)
│   │
│   ├── /                           → HomePage (alias de /home)
│   │     Secciones internas (scroll):
│   │     ├── #hero                 → Introducción + CTAs
│   │     ├── #proyectos            → ContentSection (arquitectura)
│   │     ├── #filosofia            → PhilosophySection
│   │     ├── #variantes            → CardsShowcase (6 skins)
│   │     └── #tokens               → TokensSection
│   │
│   ├── /componentes                → ComponentsPage
│   │     ├── Barra de búsqueda (ya implementada en header)
│   │     └── Grid de componentes del design system
│   │         └── /componentes/:slug   → ✅ ComponentDetailPage — Detalle de un componente
│   │               ├── Descripción + uso
│   │               ├── Preview en vivo
│   │               ├── Props / API
│   │               └── Código de ejemplo
│   │
│   ├── /tokens                     → TokensPage
│   │     Secciones internas (tabs o scroll):
│   │     ├── #colores              → Paletas
│   │     ├── #tipografia           → Escala tipográfica
│   │     ├── #espaciado            → Spacing scale
│   │     └── #sombras              → Elevación / shadows
│   │
│   ├── /philosophy                 → ✅ PhilosophyPage (ruta en inglés)
│   │     ├── Principios del sistema (PhilosophySection reutilizable)
│   │     └── Decisiones de diseño documentadas
│   │
│   └── /about                      → AboutPage
│         Secciones internas (scroll):
│         ├── ProfileHero
│         ├── Experiencia (6 posiciones)
│         ├── Skills por categoría
│         └── Educación + Idiomas
│
│
├── AUTH
│   └── /admin/login                → LoginPage (sin layout, standalone)
│
│
└── ADMIN  (AdminLayout → Sidebar + AuthGuard)
    │
    ├── /admin                      → redirige a /admin/kitchen-sink
    │
    ├── /admin/kitchen-sink         → KitchenSink
    │     Sub-navegación por tabs/accordion (atomic design):
    │     ├── Atoms                 → AtomsSink
    │     ├── Molecules             → MoleculesSink
    │     └── Organisms             → OrganismsSink
    │
    ├── /admin/tokens               → [NUEVA] AdminTokensPage
    │     Vista de inspección de design tokens
    │     (mismos datos que /tokens, vista tabla o raw JSON)
    │
    └── /admin/componentes          → [NUEVA] AdminComponentsPage
          Inventario de componentes con estado:
          ├── Estado (stable / beta / deprecated)
          ├── Cobertura de tests
          └── Link directo al KitchenSink correspondiente
```

---

## Header público

| Label | Ruta | Estado |
|-------|------|--------|
| Componentes | `/componentes` | ✅ Existe |
| Tokens | `/tokens` | ✅ Existe |
| Filosofía | `/philosophy` | ✅ Existe (ruta en inglés `philosophy`, no `filosofia`) |
| About | `/about` | ✅ Existe |

---

## Sidebar admin

| Icono | Label | Ruta | Estado |
|-------|-------|------|--------|
| `flask` | Kitchen Sink | `/admin/kitchen-sink` | ✅ Existe |
| `palette` | Tokens | `/admin/tokens` | ❌ Falta Route + Page |
| `stack` | Componentes | `/admin/componentes` | ❌ Falta Route + Page |
| — | *(separador)* | — | — |
| `sign-out` | Cerrar sesión | → `/` | ✅ Existe |

---

## Estado de rutas

| Ruta | Estado | Prioridad |
|------|--------|-----------|
| `/` | ✅ Existe | — |
| `/home` | ✅ Existe (alias) | — |
| `/componentes` | ✅ Existe | — |
| `/tokens` | ✅ Existe | — |
| `/about` | ✅ Existe | — |
| `/admin/login` | ✅ Existe | — |
| `/admin/kitchen-sink` | ✅ Existe | — |
| `/admin/tokens` | ❌ Falta | Alta — sidebar roto |
| `/admin/componentes` | ❌ Falta | Alta — sidebar roto |
| `/philosophy` | ✅ Existe (`PhilosophyPage`, ruta en inglés) | — |
| `/componentes/:slug` | ✅ Existe (`ComponentDetailPage`) | — |

---

## Notas

- `/admin/tokens` y `/admin/componentes` son prioridad: el sidebar ya las enlaza y generan 404.
- `/philosophy` ya está implementada como `PhilosophyPage` (`src/pages/philosophy/`).
- `/componentes/:slug` ya está implementada como `ComponentDetailPage`.
- El Kitchen Sink como página única está bien; los tabs/accordion son mejora de UX interna, no cambio de routing.
