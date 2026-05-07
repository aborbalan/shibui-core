import { ProfileDto, WorkExperienceDto } from "../../../api/domain/about/api/about.api";
import { SkillGroupDto } from "../../../api/domain/about/api/about.api";
import { EducationDto } from "../../../api/domain/about/api/about.api";
import { LanguageDto } from "../../../api/domain/about/api/about.api";
import { AboutMeDto } from "../../../api/domain/about/api/about.api";

  
  export const profileFixture: ProfileDto    = {
    name: 'Alejandro Borbalán Dueñas',
    title: 'Desarrollador Front-End Senior',
    location: 'Zaragoza, España',
    email: 'aborbalan.duenas@gmail.com',
    bio: 'Programador Front-End enfocado en la creación de interfaces de alto rendimiento.',
    socials: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alejandro-borbalan' },
      { label: 'GitHub',   url: 'https://github.com/alejandro-borbalan' },
    ],
  };
  
  export const experienceFixture: WorkExperienceDto[] = [
    {
      id: 'exp-0001',
      role: 'Programador Sénior',
      company: 'Nettrim Technology',
      location: 'Zaragoza, España',
      startDate: '2021-11',
      endDate: '2025-11',
      description: 'Liderazgo técnico en proyectos complejos con arquitectura hexagonal.',
      tags: ['Angular', 'TypeScript', 'RxJS'],
      order: 0,
    },
    {
      id: 'exp-0002',
      role: 'Programador',
      company: '10Labs',
      location: 'Zaragoza, España',
      startDate: '2020-11',
      endDate: '2021-11',
      description: 'Desarrollo de soluciones robustas con TypeScript.',
      tags: ['Angular', 'TypeScript', 'Ionic'],
      order: 1,
    },
  ];
  
  export const skillsFixture: SkillGroupDto[] = [
    {
      category: 'frontend',
      label: 'Front-End',
      skills: [
        { id: 'sk-001', name: 'Angular',    category: 'frontend', order: 0 },
        { id: 'sk-002', name: 'React',      category: 'frontend', order: 1 },
        { id: 'sk-003', name: 'TypeScript', category: 'frontend', order: 2 },
      ],
    },
    {
      category: 'architecture',
      label: 'Arquitectura',
      skills: [
        { id: 'sk-010', name: 'Hexagonal Architecture', category: 'architecture', order: 0 },
      ],
    },
  ];
  
  export const educationFixture: EducationDto[] = [
    {
      id: 'edu-0001',
      degree: 'Grado Superior',
      field: 'Desarrollo de Aplicaciones Multiplataforma (DAM)',
      institution: 'IES Santiago Hernández',
      startYear: 2018,
      endYear: 2019,
      order: 0,
    },
  ];
  
  export const languagesFixture: LanguageDto[] = [
    { id: 'lang-0001', name: 'Español', level: 'Nativo',       order: 0 },
    { id: 'lang-0002', name: 'Inglés',  level: 'Profesional',  order: 1 },
  ];
  
  export const aboutMeFixture: AboutMeDto = {
    profile:    profileFixture,
    experience: experienceFixture,
    skills:     skillsFixture,
    education:  educationFixture,
    languages:  languagesFixture,
  };