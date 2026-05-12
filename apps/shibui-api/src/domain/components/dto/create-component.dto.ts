import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Button', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'shibui-button',
    maxLength: 100,
    description: 'URL-friendly kebab-case identifier',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be kebab-case (e.g. "shibui-button")',
  })
  slug: string;

  @ApiProperty({
    example: 'shibui-button',
    maxLength: 100,
    description: 'Custom element tag name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z]+-[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'tagName must be a valid custom element name (e.g. "shibui-button")',
  })
  tagName: string;

  @ApiProperty({
    example:
      'A versatile button component supporting multiple variants and states.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({ example: '1.0.0', description: 'Semver version' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, {
    message: 'version must follow semver format (e.g. "1.0.0")',
  })
  version: string;

  @ApiProperty({ enum: ComponentStatus, example: ComponentStatus.STABLE })
  @IsEnum(ComponentStatus)
  status: ComponentStatus;

  @ApiProperty({
    example: 'cat-0001-0000-0000-000000000001',
    description: 'Category UUID',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: '@shibui-ui/components', maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  packageName?: string;

  @ApiPropertyOptional({
    example: ['form', 'interactive', 'accessible'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  tags?: string[];

  @ApiPropertyOptional({ example: 'https://shibui.dev/docs/button' })
  @IsOptional()
  @IsUrl()
  docsUrl?: string;
}
