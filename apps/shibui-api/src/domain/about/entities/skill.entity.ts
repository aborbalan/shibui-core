export enum SkillCategory {
  FRONTEND = 'frontend',
  EXPANDING = 'expanding',
  BACKEND = 'backend',
  ARCHITECTURE = 'architecture',
  TESTING = 'testing',
}

export class Skill {
  id: string;
  name: string;
  category: SkillCategory;
  /** Controls display order within the category */
  order: number;
}

export class SkillGroup {
  category: SkillCategory;
  label: string;
  skills: Skill[];
}
