import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AboutService } from './about.service';
import {
  AboutMeDto,
  WorkExperienceDto,
  SkillGroupDto,
  EducationDto,
  LanguageDto,
  ProfileDto,
} from './dto/about-me.dto';

@ApiTags('about')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({
    summary: 'Get full profile',
    description:
      'Returns the complete about-me payload: profile, experience, skills, education and languages.',
  })
  @ApiResponse({
    status: 200,
    description: 'Full about-me profile',
  })
  getAll(): AboutMeDto {
    return this.aboutService.getAll();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get personal profile info' })
  @ApiResponse({
    status: 200,
    description: 'Personal profile',
  })
  getProfile(): ProfileDto {
    return this.aboutService.getProfile();
  }

  @Get('experience')
  @ApiOperation({ summary: 'Get work experience ordered by recency' })
  @ApiResponse({
    status: 200,
    description: 'Work experience list',
    type: [WorkExperienceDto],
  })
  getExperience(): WorkExperienceDto[] {
    return this.aboutService.getExperience();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get skills grouped by category' })
  @ApiResponse({
    status: 200,
    description: 'Skill groups',
    type: [SkillGroupDto],
  })
  getSkills(): SkillGroupDto[] {
    return this.aboutService.getSkills() as unknown as SkillGroupDto[];
  }

  @Get('education')
  @ApiOperation({ summary: 'Get education history ordered by recency' })
  @ApiResponse({
    status: 200,
    description: 'Education list',
    type: [EducationDto],
  })
  getEducation(): EducationDto[] {
    return this.aboutService.getEducation();
  }

  @Get('languages')
  @ApiOperation({ summary: 'Get spoken languages' })
  @ApiResponse({
    status: 200,
    description: 'Language list',
    type: [LanguageDto],
  })
  getLanguages(): LanguageDto[] {
    return this.aboutService.getLanguages();
  }
}
