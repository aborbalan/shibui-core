import { ApiProperty } from '@nestjs/swagger';
import { Profile, SocialLink } from '../entities/profile.entity';
import { SkillCategory } from '../entities/skill.entity';
import { WorkExperience } from '../entities/work-experience.entity';
import { Education } from '../entities/education.entity';
import { Language } from '../entities/language.entity';

export class SocialLinkDto implements SocialLink {
  @ApiProperty({ example: 'LinkedIn' })
  label: string;

  @ApiProperty({ example: 'https://www.linkedin.com/in/alejandro-borbalan' })
  url: string;
}

export class ProfileDto implements Profile {
  @ApiProperty({ example: 'Alejandro Borbalán Dueñas' })
  name: string;

  @ApiProperty({ example: 'Desarrollador Front-End Senior' })
  title: string;

  @ApiProperty({ example: 'Zaragoza, España' })
  location: string;

  @ApiProperty({ example: 'aborbalan.duenas@gmail.com' })
  email: string;

  @ApiProperty()
  bio: string;

  @ApiProperty({ type: [SocialLinkDto] })
  socials: SocialLinkDto[];
}

export class WorkExperienceDto implements WorkExperience {
  @ApiProperty({ example: 'exp-0001' })
  id: string;

  @ApiProperty({ example: 'Programador Sénior' })
  role: string;

  @ApiProperty({ example: 'Nettrim Technology' })
  company: string;

  @ApiProperty({ example: 'Zaragoza, España' })
  location: string;

  @ApiProperty({ example: '2021-11' })
  startDate: string;

  @ApiProperty({ example: '2025-11', nullable: true })
  endDate: string | null;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [String], example: ['Angular', 'TypeScript', 'RxJS'] })
  tags: string[];

  @ApiProperty({ example: 0 })
  order: number;
}

export class EducationDto implements Education {
  @ApiProperty({ example: 'edu-0001' })
  id: string;

  @ApiProperty({ example: 'Grado Superior' })
  degree: string;

  @ApiProperty({ example: 'Desarrollo de Aplicaciones Multiplataforma (DAM)' })
  field: string;

  @ApiProperty({ example: 'IES Santiago Hernández' })
  institution: string;

  @ApiProperty({ example: 2018 })
  startYear: number;

  @ApiProperty({ example: 2019 })
  endYear: number;

  @ApiProperty({ example: 0 })
  order: number;
}

export class SkillDto {
  @ApiProperty({ example: 'sk-001' })
  id: string;

  @ApiProperty({ example: 'Angular' })
  name: string;

  @ApiProperty({
    enum: Object.values(SkillCategory),
    example: SkillCategory.FRONTEND,
  })
  category: SkillCategory;

  @ApiProperty({ example: 0 })
  order: number;
}

export class SkillGroupDto {
  @ApiProperty({
    enum: Object.values(SkillCategory),
    example: SkillCategory.FRONTEND,
  })
  category: SkillCategory;

  @ApiProperty({ example: 'Front-End' })
  label: string;

  @ApiProperty({ type: [SkillDto] })
  skills: SkillDto[];
}

export class LanguageDto implements Language {
  @ApiProperty({ example: 'lang-0001' })
  id: string;

  @ApiProperty({ example: 'Español' })
  name: string;

  @ApiProperty({ example: 'Nativo' })
  level: string;

  @ApiProperty({ example: 0 })
  order: number;
}

export class AboutMeDto {
  @ApiProperty({ type: ProfileDto })
  profile: ProfileDto;

  @ApiProperty({ type: [WorkExperienceDto] })
  experience: WorkExperienceDto[];

  @ApiProperty({ type: [SkillGroupDto] })
  skills: SkillGroupDto[];

  @ApiProperty({ type: [EducationDto] })
  education: EducationDto[];

  @ApiProperty({ type: [LanguageDto] })
  languages: LanguageDto[];
}
