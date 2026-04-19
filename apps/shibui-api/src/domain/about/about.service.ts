import { Injectable } from '@nestjs/common';
import { Profile } from './entities/profile.entity';
import { Skill, SkillCategory, SkillGroup } from './entities/skill.entity';
import { AboutMeDto } from './dto/about-me.dto';
import { WorkExperience } from './entities/work-experience.entity';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  [SkillCategory.FRONTEND]: 'Front-End',
  [SkillCategory.EXPANDING]: 'En expansión',
  [SkillCategory.BACKEND]: 'Back-End / Apoyo',
  [SkillCategory.ARCHITECTURE]: 'Arquitectura',
  [SkillCategory.TESTING]: 'Testing & QA',
};

@Injectable()
export class AboutService {
  // ── Profile ────────────────────────────────────────────────────────────────

  private readonly profile: Profile = {
    name: 'Alejandro Borbalán Dueñas',
    title: 'Desarrollador Front-End Senior',
    location: 'Zaragoza, España',
    email: 'aborbalan.duenas@gmail.com',
    bio: 'Desarrollador front-end con más de 7 años de experiencia en Angular, TypeScript y arquitecturas de componentes a escala. Mi objetivo inmediato es ampliar el abanico de herramientas incorporando React y Astro.js a un perfil que ya domina el ecosistema Angular de forma profunda, así como el uso de Node.js, Express.js y Java como capa de apoyo. Me interesa seguir formándome y participar en proyectos donde la calidad del código y la arquitectura sean tan importantes como el resultado visual.',
    socials: [
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/alejandro-borbal%C3%A1n-due%C3%B1as-a20142167/',
      },
    ],
  };

  // ── Work experience ────────────────────────────────────────────────────────

  private readonly experience: WorkExperience[] = [
    {
      id: 'exp-0001',
      role: 'Programador Sénior',
      company: 'Nettrim Technology',
      location: 'Zaragoza, España',
      startDate: '2021-11',
      endDate: '2025-11',
      description:
        'Desarrollo de una aplicación Angular de gran escala bajo arquitectura hexagonal en monorepo. Diseño e implementación de una librería de acceso a datos agnóstica respecto a la tecnología de estado y peticiones, con una capa de abstracción superior que permite sustituir la implementación subyacente sin afectar al frontal. Librería de componentes propia con patrón smart/dumb. RxJS intensivo para gestión de flujos reactivos.',
      tags: [
        'Angular',
        'TypeScript',
        'RxJS',
        'Monorepo',
        'Arquitectura Hexagonal',
        'Express.js',
      ],
      order: 0,
    },
    {
      id: 'exp-0002',
      role: 'Programador',
      company: '1oLabs',
      location: 'Zaragoza, España',
      startDate: '2020-11',
      endDate: '2021-11',
      description:
        'Primer contacto real con la dimensión macro del desarrollo: arquitecturas más complejas, proyectos experimentales y punteros. Etapa de alta influencia en la visión arquitectónica personal, que sentó las bases del enfoque aplicado en Nettrim.',
      tags: ['Angular', 'TypeScript', 'JavaScript', 'Express.js'],
      order: 1,
    },
    {
      id: 'exp-0003',
      role: 'Desarrollador Front-End',
      company: 'Deloitte España',
      location: 'Zaragoza, España',
      startDate: '2019-10',
      endDate: '2020-08',
      description:
        'Participación en una aplicación bancaria de gran tamaño con Angular y NgRx para gestión del estado global. Entorno corporativo exigente donde la cobertura de tests y la consistencia entre equipos eran requisitos no negociables. Primer contacto con la escala real en banca.',
      tags: ['Angular', 'NgRx', 'RxJS', 'TypeScript'],
      order: 2,
    },
    {
      id: 'exp-0004',
      role: 'Desarrollador en Prácticas',
      company: 'YL-Verkot Oy',
      location: 'Tampere, Finlandia',
      startDate: '2019-03',
      endDate: '2019-06',
      description:
        'Autoría del proyecto completo: aplicación para mapeo en tiempo real de antenas y señales de red sobre coordenadas geográficas. Recepción de datos por UDP, parsing y translación de coordenadas a posiciones x/y para su representación sobre Google Maps. Stack: JavaScript, Angular y Python para el procesado de datos.',
      tags: ['JavaScript', 'Angular', 'Python', 'UDP', 'Google Maps API'],
      order: 3,
    },
    {
      id: 'exp-0005',
      role: 'Programador',
      company: 'Indra',
      location: 'Zaragoza, España',
      startDate: '2018-07',
      endDate: '2019-01',
      description:
        'Proyecto en el sector bancario que acabó siendo implementado en PL/1 en lugar del Java previsto. Experiencia dura que resultó valiosa para apreciar con más criterio las tecnologías modernas, los entornos legacy y el coste real de las decisiones técnicas tempranas.',
      tags: ['PL/1', 'Java', 'Banca'],
      order: 4,
    },
  ];

  // ── Skills ─────────────────────────────────────────────────────────────────

  private readonly skills: Skill[] = [
    // Frontend
    {
      id: 'sk-001',
      name: 'Angular',
      category: SkillCategory.FRONTEND,
      order: 0,
    },
    {
      id: 'sk-002',
      name: 'TypeScript',
      category: SkillCategory.FRONTEND,
      order: 1,
    },
    { id: 'sk-003', name: 'RxJS', category: SkillCategory.FRONTEND, order: 2 },
    {
      id: 'sk-004',
      name: 'JavaScript',
      category: SkillCategory.FRONTEND,
      order: 3,
    },
    { id: 'sk-005', name: 'HTML', category: SkillCategory.FRONTEND, order: 4 },
    { id: 'sk-006', name: 'CSS', category: SkillCategory.FRONTEND, order: 5 },
    { id: 'sk-007', name: 'NgRx', category: SkillCategory.FRONTEND, order: 6 },
    // Expanding
    {
      id: 'sk-008',
      name: 'React',
      category: SkillCategory.EXPANDING,
      order: 0,
    },
    {
      id: 'sk-009',
      name: 'Astro.js',
      category: SkillCategory.EXPANDING,
      order: 1,
    },
    // Backend / Support
    {
      id: 'sk-010',
      name: 'Node.js',
      category: SkillCategory.BACKEND,
      order: 0,
    },
    {
      id: 'sk-011',
      name: 'Express.js',
      category: SkillCategory.BACKEND,
      order: 1,
    },
    { id: 'sk-012', name: 'Java', category: SkillCategory.BACKEND, order: 2 },
    { id: 'sk-013', name: 'Python', category: SkillCategory.BACKEND, order: 3 },
    // Architecture
    {
      id: 'sk-014',
      name: 'Arquitectura Hexagonal',
      category: SkillCategory.ARCHITECTURE,
      order: 0,
    },
    {
      id: 'sk-015',
      name: 'Monorepo',
      category: SkillCategory.ARCHITECTURE,
      order: 1,
    },
    {
      id: 'sk-016',
      name: 'Patrón Smart/Dumb',
      category: SkillCategory.ARCHITECTURE,
      order: 2,
    },
    {
      id: 'sk-017',
      name: 'Libs agnósticas',
      category: SkillCategory.ARCHITECTURE,
      order: 3,
    },
    // Testing
    {
      id: 'sk-018',
      name: 'Cucumber',
      category: SkillCategory.TESTING,
      order: 0,
    },
    {
      id: 'sk-019',
      name: 'Selenium',
      category: SkillCategory.TESTING,
      order: 1,
    },
  ];

  // ── Education ──────────────────────────────────────────────────────────────

  private readonly education: Education[] = [
    {
      id: 'edu-0001',
      degree: 'Grado Superior',
      field: 'Desarrollo de Aplicaciones Multiplataforma (DAM)',
      institution: 'IES Santiago Hernández',
      startYear: 2018,
      endYear: 2019,
      order: 0,
    },
    {
      id: 'edu-0002',
      degree: 'Grado Superior',
      field: 'Desarrollo de Aplicaciones Web (DAW)',
      institution: 'IES Santiago Hernández',
      startYear: 2016,
      endYear: 2018,
      order: 1,
    },
    {
      id: 'edu-0003',
      degree: 'Bachillerato',
      field: 'Ciencias Físicas',
      institution: 'IES Torre de los Espejos',
      startYear: 2014,
      endYear: 2016,
      order: 2,
    },
  ];

  // ── Languages ──────────────────────────────────────────────────────────────

  private readonly languages: Language[] = [
    { id: 'lang-0001', name: 'Español', level: 'Nativo', order: 0 },
    { id: 'lang-0002', name: 'Inglés', level: 'Profesional básico', order: 1 },
  ];

  // ── Public API ─────────────────────────────────────────────────────────────

  getProfile(): Profile {
    return this.profile;
  }

  getExperience(): WorkExperience[] {
    return [...this.experience].sort((a, b) => a.order - b.order);
  }

  getSkills(): SkillGroup[] {
    const categoryOrder: SkillCategory[] = [
      SkillCategory.FRONTEND,
      SkillCategory.EXPANDING,
      SkillCategory.BACKEND,
      SkillCategory.ARCHITECTURE,
      SkillCategory.TESTING,
    ];

    return categoryOrder.map((category) => ({
      category,
      label: CATEGORY_LABELS[category],
      skills: this.skills
        .filter((s) => s.category === category)
        .sort((a, b) => a.order - b.order),
    }));
  }

  getEducation(): Education[] {
    return [...this.education].sort((a, b) => a.order - b.order);
  }

  getLanguages(): Language[] {
    return [...this.languages].sort((a, b) => a.order - b.order);
  }

  getAll(): AboutMeDto {
    return {
      profile: this.getProfile(),
      experience: this.getExperience(),
      skills: this.getSkills(),
      education: this.getEducation(),
      languages: this.getLanguages(),
    };
  }
}
