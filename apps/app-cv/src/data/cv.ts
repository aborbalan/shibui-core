/**
 * Datos del CV — fuente única de verdad, 100% estática.
 *
 * Contenido real (extraído del CV de Alejandro Borbalán Dueñas).
 * `skills` mantiene la agrupación ligera del brief (Core / Tooling / Familiar);
 * el stack completo del CV es más amplio — ampliar aquí si se desea.
 *
 * Nada de servicios ni peticiones: todo vive aquí y carga al instante.
 */

export interface Profile {
  /** Nombre de pila (primera línea del titular) */
  firstName: string;
  /** Apellidos (acento itálico del titular) */
  lastName: string;
  /**
   * Titular completo, segmentos separados por ' · '. El hero lo trocea
   * tipográficamente: 1er segmento = kicker eyebrow; el resto, línea meta.
   */
  title: string;
  /** Tagline de una línea: qué hago y para qué sirve */
  tagline: string;
  /** Ubicación — no se muestra en el hero, sí en el footer */
  location: string;
  github: string;
  linkedin: string;
  email: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  location?: string;
  /** Ej: "nov 2021 – nov 2025" */
  period: string;
  /** Tecnologías clave del rol */
  stack: string[];
  /** 1-2 logros concretos (impacto, no lista de tareas) */
  achievements: string[];
  /** Empresas reconocidas → destacadas visualmente */
  highlight?: boolean;
}

export interface SkillGroup {
  label: string;
  items: string[];
  /** Grupo principal → chips con énfasis */
  primary?: boolean;
}

export interface EducationItem {
  title: string;
  place: string;
  period: string;
}

export interface LanguageItem {
  name: string;
  /** Nivel descriptivo: Nativo, Profesional, etc. */
  level: string;
}

export interface ProjectItem {
  name: string;
  /** Kicker mono en el header de la card (rol del proyecto) */
  tag: string;
  /** Una línea: qué es y por qué importa */
  description: string;
  stack: string[];
  /** Demo en vivo (opcional) */
  demo?: string;
  /** Código — deep-link a la subcarpeta del monorepo (opcional) */
  code?: string;
  /** Kanji watermark de la card (guiño del design system) */
  kanji?: string;
  /** Proyecto destacado → variante featured de la card */
  highlight?: boolean;
}

// ─────────────────────────────────────────────────────────────
// PERFIL
// ─────────────────────────────────────────────────────────────
export const profile: Profile = {
  firstName: 'Alejandro',
  lastName: 'Borbalán Dueñas',
  title:
    'Senior Front-end Engineer · Angular & Web Components · Design Systems · Open to Remote',
  tagline:
    'Diseño y construyo design systems — Web Components que viven idénticos en React, Angular y Svelte — con más de 7 años de frontend a escala donde el diseño importa tanto como la estructura.',
  location: 'Zaragoza, España',
  github: 'https://github.com/aborbalan', // TODO: verificar handle público
  linkedin: 'https://www.linkedin.com/in/alejandro-borbalan-duenas-a20142167',
  email: 'aborbalan.duenas@gmail.com',
};

// ─────────────────────────────────────────────────────────────
// EXPERIENCIA — orden cronológico inverso
// ─────────────────────────────────────────────────────────────
export const experience: ExperienceItem[] = [
  {
    company: 'Nettrim Technology',
    role: 'Programador Sénior',
    location: 'Zaragoza',
    period: 'nov 2021 – nov 2025',
    stack: ['Angular', 'TypeScript', 'RxJS', 'Monorepo', 'Arq. Hexagonal', 'Express.js'],
    achievements: [
      'Diseñé una librería de acceso a datos agnóstica de estado y framework: una capa de abstracción que permite cambiar la implementación subyacente sin tocar el frontal.',
      'Levanté la librería de componentes propia (patrón smart/dumb) de una app Angular de gran escala sobre arquitectura hexagonal en monorepo, con RxJS para los flujos reactivos.',
    ],
    highlight: true,
  },
  {
    company: '10 Labs',
    role: 'Programador',
    location: 'Zaragoza',
    period: 'nov 2020 – nov 2021',
    stack: ['Angular', 'TypeScript', 'JavaScript', 'Express.js'],
    achievements: [
      'Proyectos experimentales y arquitecturas complejas que sentaron las bases de mi visión arquitectónica posterior.',
    ],
  },
  {
    company: 'Deloitte España',
    role: 'Desarrollador Front-End',
    location: 'Zaragoza',
    period: 'oct 2019 – ago 2020',
    stack: ['Angular', 'NgRx', 'TypeScript', 'Sass', 'SCSS'],
    achievements: [
      'Desarrollo de una app bancaria de gran tamaño (Angular + NgRx) en un entorno corporativo donde la cobertura de tests y la consistencia entre equipos eran requisitos no negociables.',
    ],
    highlight: true,
  },
  {
    company: 'YL-Verkot Oy',
    role: 'Desarrollador en Prácticas',
    location: 'Tampere, Finlandia',
    period: 'mar – jun 2019',
    stack: ['JavaScript', 'Angular', 'Python', 'UDP', 'Google Maps API'],
    achievements: [
      'Autoría completa de una app de mapeo en tiempo real de antenas y señales: ingesta por UDP, parsing y proyección de coordenadas sobre Google Maps.',
    ],
  },
  {
    company: 'Indra',
    role: 'Programador',
    location: 'Zaragoza',
    period: 'jul 2018 – ene 2019',
    stack: ['PL/1', 'Java', 'Banca'],
    achievements: [
      'Proyecto bancario finalmente implementado en PL/1 en lugar de Java: una lección temprana sobre legacy y el coste real de las decisiones técnicas.',
    ],
    highlight: true,
  },
  {
    company: 'Hiberus Tecnología',
    role: 'Programador · Grado Dual',
    location: 'Zaragoza',
    period: 'ago 2017 – jun 2018',
    stack: ['Angular', 'AngularJS', 'Java', 'Cucumber'],
    achievements: [
      'Formación dual (FP + práctica profesional): desarrollo de aplicaciones con Angular/AngularJS y Java, e introducción al testing con Cucumber y Selenium.',
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// SKILLS — agrupación ligera y curada para la columna principal.
// El stack exhaustivo vive en `fullStack` (drawer «Ver stack completo»).
// ─────────────────────────────────────────────────────────────
export const skills: SkillGroup[] = [
  { label: 'Core', items: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Lit Elements'], primary: true },
  { label: 'IA & agentes', items: ['Claude Code', 'Codex'], primary: true },
  { label: 'Styling', items: ['CSS', 'SCSS', 'Sass', 'Ant Design', 'Material'] },
  { label: 'Tooling', items: ['Nx', 'Storybook'] },
  { label: 'Familiar', items: ['React', 'Svelte', 'NestJS'] },
];

// Stack completo — se muestra bajo demanda en un drawer para no recargar
// la sección Skills. Agrupado por dominio; fundamentado en la experiencia
// y los proyectos reales del CV.
export const fullStack: SkillGroup[] = [
  { label: 'Lenguajes', items: ['TypeScript', 'JavaScript', 'Java', 'Python', 'Rust', 'PL/1'] },
  {
    label: 'Frameworks & UI',
    items: ['Angular', 'AngularJS', 'React', 'Svelte', 'Lit', 'Web Components'],
  },
  {
    label: 'Estado & estilado',
    items: ['RxJS', 'NgRx', 'Angular Signals', 'SCSS', 'Sass', 'Ant Design', 'Material'],
  },
  { label: 'Backend & runtime', items: ['Node.js', 'NestJS', 'Express.js'] },
  {
    label: 'Testing',
    items: ['Vitest', 'Jest', 'Playwright', 'Cucumber', 'Selenium', 'axe-core'],
  },
  {
    label: 'Tooling & arquitectura',
    items: ['Nx', 'pnpm workspaces', 'Monorepo', 'Storybook', 'Vite', 'Tauri', 'Arq. hexagonal'],
  },
  { label: 'IA & agentes', items: ['Claude Code', 'Codex'] },
];

// ─────────────────────────────────────────────────────────────
// EDUCACIÓN — breve, solo lo relevante (Grados Superiores).
// ─────────────────────────────────────────────────────────────
export const education: EducationItem[] = [
  {
    title: 'Grado Superior — Desarrollo de Aplicaciones Multiplataforma (DAM)',
    place: 'IES Santiago Hernández',
    period: '2018 – 2019',
  },
  {
    title: 'Grado Superior — Desarrollo de Aplicaciones Web (DAW)',
    place: 'IES Santiago Hernández',
    period: '2016 – 2018',
  },
  {
    title: 'Bachillerato — Ciencias físicas',
    place: 'IES Torre de los Espejos',
    period: '2014 – 2016',
  },
];

// ─────────────────────────────────────────────────────────────
// PROYECTOS — trabajo propio. El ecosistema Shibui es un monorepo:
// un solo repo cohesionado, no repos dispersos → cada card enlaza a
// su demo en vivo y/o a su subcarpeta dentro del monorepo público.
// ─────────────────────────────────────────────────────────────
const REPO = 'https://github.com/aborbalan/shibui-core/tree/main';

export const projects: ProjectItem[] = [
  {
    name: '@shibui-ui/ui',
    tag: 'Sistema de diseño',
    description:
      'Librería de Web Components (Lit) agnóstica de framework con el sistema de diseño Katachi: el mismo componente, idéntico, consumido desde React, Angular y Svelte.',
    stack: ['Lit', 'Web Components', 'TypeScript', 'Storybook', 'CSS Tokens'],
    demo: 'https://shibui-showcase-storybook.web.app',
    code: `${REPO}/packages/shibui-ui`,
    kanji: '渋',
    highlight: true,
  },
  {
    name: 'hanko',
    tag: 'Trust engine',
    description:
      'Motor de verificación manifest-driven para Web Components: audita contrato, accesibilidad y resiliencia, y emite un Trust Report con sello por componente.',
    stack: ['TypeScript', 'Vitest', 'Playwright', 'axe-core', 'Node ESM'],
    demo: 'https://hanko-report.web.app',
    code: `${REPO}/packages/hanko`,
    kanji: '印',
    highlight: true,
  },
];

// ─────────────────────────────────────────────────────────────
// IDIOMAS
// ─────────────────────────────────────────────────────────────
export const languages: LanguageItem[] = [
  { name: 'Español', level: 'Nativo' },
  { name: 'Inglés', level: 'Profesional' },
];
