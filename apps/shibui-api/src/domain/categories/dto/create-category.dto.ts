import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Inputs & Forms', maxLength: 80 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  name: string;

  @ApiProperty({
    example: 'inputs-forms',
    maxLength: 80,
    description: 'URL-friendly kebab-case identifier',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be kebab-case (e.g. "form-elements")',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Text fields, selects and all form-related components.',
    maxLength: 300,
  })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiPropertyOptional({
    example: 'form',
    maxLength: 50,
    description: 'Icon name from the icon set',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    example: 0,
    minimum: 0,
    description: 'Display order in sidebar navigation',
  })
  @IsInt()
  @Min(0)
  order: number;
}
