import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileHeroComponent } from '@components/about/profile-hero/profile-hero';
import { ExperienceSectionComponent } from '@components/about/experience-section/experience-section';
import { SkillsSectionComponent } from '@components/about/skills-section/skills-section';
import { EducationSectionComponent } from '@components/about/education-section/education-section';
import {
  ProfileDto,
  WorkExperienceDto,
  SkillGroupDto,
  EducationDto,
  LanguageDto,
} from '@components/about/about.models';

const PROFILE: ProfileDto = {
  name: 'Alejandro Borbalán Dueñas',
  title: 'Programador Front-End · Especialista en Sistemas de Diseño',
  location: 'Zaragoza, España',
  email: 'aborbalan.duenas@gmail.com',
  bio: 'Programador Front-End enfocado en la creación de interfaces de alto rendimiento y sistemas de diseño escalables. Creador de Lib-UI, librería de Web Components agnósticos construidos con Lit y TypeScript. Más allá del código, encuentro el equilibrio en las artes marciales y el running.',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/alejandro-borbal%C3%A1n-due%C3%B1as-a20142167/' },
    { label: 'GitHub', url: 'https://github.com/tu-usuario' },
  ],
};

const EXPERIENCE: WorkExperienceDto[] = [
  {
    id: 'exp-0001',
    role: 'Programador Sénior',
    company: 'Nettrim Technology',
    location: 'Zaragoza, España',
    startDate: '2021-11',
    endDate: null,
    description: 'Liderazgo técnico en proyectos complejos, aplicando arquitectura hexagonal para garantizar la escalabilidad y el desacoplamiento del dominio.',
    tags: ['Angular', 'React.js', 'TypeScript', 'RxJS', 'Arquitectura Hexagonal', 'Astro.js'],
    order: 0,
  },
  {
    id: 'exp-0002',
    role: 'Programador',
    company: '10Labs',
    location: 'Zaragoza, Aragón, España',
    startDate: '2020-11',
    endDate: '2021-11',
    description: 'Desarrollo de soluciones robustas y mantenibles utilizando TypeScript y ecosistemas modernos de JS.',
    tags: ['Angular', 'TypeScript', 'Express.js', 'Ionic'],
    order: 1,
  },
  {
    id: 'exp-0003',
    role: 'Desarrollador de Front-End',
    company: 'Deloitte España',
    location: 'Zaragoza y alrededores, España',
    startDate: '2019-10',
    endDate: '2020-08',
    description: 'Consultoría tecnológica para grandes clientes, enfocada en la calidad del código y rendimiento en el cliente.',
    tags: ['Angular', 'TypeScript', 'JavaScript'],
    order: 2,
  },
  {
    id: 'exp-0004',
    role: 'Aprendiz en Prácticas',
    company: 'YL-Verkot Oy',
    location: 'Tampere, Finlandia',
    startDate: '2019-03',
    endDate: '2019-06',
    description: 'Experiencia internacional trabajando con estándares web y aproximación inicial a Web Components.',
    tags: ['JavaScript', 'Angular', 'Python', 'Express.js', 'Web Components'],
    order: 3,
  },
  {
    id: 'exp-0005',
    role: 'Programador',
    company: 'Indra',
    location: 'Zaragoza, España',
    startDate: '2018-07',
    endDate: '2019-01',
    description: '',
    tags: ['PL/1', 'Java'],
    order: 4,
  },
  {
    id: 'exp-0006',
    role: 'Programador',
    company: 'Hiberus Tecnología',
    location: 'Zaragoza, España',
    startDate: '2017-08',
    endDate: '2018-06',
    description: '',
    tags: ['JavaScript', 'Angular'],
    order: 5,
  },
];

const SKILLS: SkillGroupDto[] = [
  {
    category: 'frontend',
    label: 'Front-End',
    skills: [
      { id: 'sk-01', name: 'Angular', category: 'frontend', order: 0 },
      { id: 'sk-02', name: 'React', category: 'frontend', order: 1 },
      { id: 'sk-03', name: 'TypeScript', category: 'frontend', order: 2 },
      { id: 'sk-04', name: 'RxJS', category: 'frontend', order: 3 },
      { id: 'sk-05', name: 'Astro.js', category: 'frontend', order: 4 },
      { id: 'sk-06', name: 'Lit', category: 'frontend', order: 5 },
      { id: 'sk-07', name: 'CSS / OKLCH', category: 'frontend', order: 6 },
    ],
  },
  {
    category: 'architecture',
    label: 'Arquitectura',
    skills: [
      { id: 'sk-10', name: 'Hexagonal Architecture', category: 'architecture', order: 0 },
      { id: 'sk-11', name: 'Atomic Design', category: 'architecture', order: 1 },
      { id: 'sk-12', name: 'Monorepo', category: 'architecture', order: 2 },
      { id: 'sk-13', name: 'Web Components', category: 'architecture', order: 3 },
    ],
  },
  {
    category: 'backend',
    label: 'Back-End',
    skills: [
      { id: 'sk-20', name: 'Express.js', category: 'backend', order: 0 },
      { id: 'sk-21', name: 'Node.js', category: 'backend', order: 1 },
      { id: 'sk-22', name: 'Java', category: 'backend', order: 2 },
      { id: 'sk-23', name: 'Python', category: 'backend', order: 3 },
    ],
  },
  {
    category: 'expanding',
    label: 'Aprendiendo',
    skills: [
      { id: 'sk-30', name: 'Ionic', category: 'expanding', order: 0 },
      { id: 'sk-31', name: 'PL/1', category: 'expanding', order: 1 },
    ],
  },
];

const EDUCATION: EducationDto[] = [
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

const LANGUAGES: LanguageDto[] = [
  { id: 'lang-0001', name: 'Español', level: 'Nativo', order: 0 },
  { id: 'lang-0002', name: 'Inglés', level: 'Profesional', order: 1 },
];

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    ProfileHeroComponent,
    ExperienceSectionComponent,
    SkillsSectionComponent,
    EducationSectionComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly profile = PROFILE;
  readonly experience = EXPERIENCE;
  readonly skills = SKILLS;
  readonly education = EDUCATION;
  readonly languages = LANGUAGES;
}
