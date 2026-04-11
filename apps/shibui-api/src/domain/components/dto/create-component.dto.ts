import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  MaxLength,
} from 'class-validator';
import { ComponentStatus } from '../entities/component.entity';

export class CreateComponentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be kebab-case (e.g. "shibui-button")',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z]+-[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'tagName must be a valid custom element name (e.g. "shibui-button")',
  })
  tagName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'version must follow semver format (e.g. "1.0.0")',
  })
  version: string;

  @IsEnum(ComponentStatus)
  status: ComponentStatus;

  @IsUUID()
  categoryId: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  packageName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  tags?: string[];

  @IsOptional()
  @IsUrl()
  docsUrl?: string;
}
