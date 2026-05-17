export interface ProfileDto {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  socials: { label: string; url: string }[];
}

export interface WorkExperienceDto {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string;
  tags: string[];
  order: number;
}

export interface SkillDto {
  id: string;
  name: string;
  category: string;
  order: number;
}

export interface SkillGroupDto {
  category: string;
  label: string;
  skills: SkillDto[];
}

export interface EducationDto {
  id: string;
  degree: string;
  field: string;
  institution: string;
  startYear: number;
  endYear: number;
  order: number;
}

export interface LanguageDto {
  id: string;
  name: string;
  level: string;
  order: number;
}
