import { apiClient } from "../../../client";

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface SocialLinkDto {
  label: string;
  url: string;
}

export interface ProfileDto {
  name: string;
  title: string;
  location: string;
  email: string;
  bio: string;
  socials: SocialLinkDto[];
}

export interface WorkExperienceDto {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string; // "YYYY-MM"
  endDate: string | null; // "YYYY-MM" | null → posición actual
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

export type SkillCategory =
  | "frontend"
  | "expanding"
  | "backend"
  | "architecture"
  | "testing";

export interface SkillGroupDto {
  category: SkillCategory;
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

/** Payload completo de GET /api/v1/about */
export interface AboutMeDto {
  profile: ProfileDto;
  experience: WorkExperienceDto[];
  skills: SkillGroupDto[];
  education: EducationDto[];
  languages: LanguageDto[];
}

// ─── API calls ────────────────────────────────────────────────────────────────

export const aboutApi = {
  /** GET /api/v1/about — payload completo */
  getAll: (): Promise<AboutMeDto> =>
    apiClient.get<AboutMeDto>("/api/v1/about", { public: true }),

  /** GET /api/v1/about/profile */
  getProfile: (): Promise<ProfileDto> =>
    apiClient.get<ProfileDto>("/api/v1/about/profile", { public: true }),

  /** GET /api/v1/about/experience */
  getExperience: (): Promise<WorkExperienceDto[]> =>
    apiClient.get<WorkExperienceDto[]>("/api/v1/about/experience", {
      public: true,
    }),

  /** GET /api/v1/about/skills */
  getSkills: (): Promise<SkillGroupDto[]> =>
    apiClient.get<SkillGroupDto[]>("/api/v1/about/skills", { public: true }),

  /** GET /api/v1/about/education */
  getEducation: (): Promise<EducationDto[]> =>
    apiClient.get<EducationDto[]>("/api/v1/about/education", { public: true }),

  /** GET /api/v1/about/languages */
  getLanguages: (): Promise<LanguageDto[]> =>
    apiClient.get<LanguageDto[]>("/api/v1/about/languages", { public: true }),
};
