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
  /** Mismo título que en LinkedIn — kicker sobre el nombre */
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

// ─────────────────────────────────────────────────────────────
// PERFIL
// ─────────────────────────────────────────────────────────────
export const profile: Profile = {
  firstName: 'Alejandro',
  lastName: 'Borbalán Dueñas',
  title: 'Programador Front-End Senior',
  tagline:
    'Más de 7 años construyendo frontend Angular a escala — librerías, arquitectura de componentes y código donde el diseño importa tanto como la estructura.',
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
    stack: ['Angular', 'NgRx', 'TypeScript'],
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
// SKILLS — agrupación ligera del brief (Core / Tooling / Familiar).
// El CV completo incluye más (Tauri, Lit, NgRx, Astro, Node, Java,
// Python, Jest, Playwright, arquitectura…) — ampliar si se desea.
// ─────────────────────────────────────────────────────────────
export const skills: SkillGroup[] = [
  { label: 'Core', items: ['Angular', 'TypeScript', 'RxJS', 'SCSS', 'Lit'], primary: true },
  { label: 'Tooling', items: ['Nx', 'Storybook'] },
  { label: 'Familiar', items: ['React', 'Svelte', 'NestJS'] },
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
];
