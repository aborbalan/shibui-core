import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { ExampleFramework } from '../entities/example.entity';

export class CreateExampleDto {
  @ApiProperty({
    example: 'cmp-0001-0000-0000-000000000001',
    description: 'Component UUID',
  })
  @IsUUID()
  componentId: string;

  @ApiProperty({ example: 'Basic usage', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({
    example: 'Default button with primary variant.',
    maxLength: 400,
  })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @ApiProperty({
    example: '<shibui-button variant="primary">Click me</shibui-button>',
    description: 'Source code snippet',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ enum: ExampleFramework, example: ExampleFramework.VANILLA })
  @IsEnum(ExampleFramework)
  framework: ExampleFramework;

  @ApiProperty({
    example: 0,
    minimum: 0,
    description: 'Display order within component examples',
  })
  @IsInt()
  @Min(0)
  order: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this is the primary example shown by default',
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
