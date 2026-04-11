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
  @IsUUID()
  componentId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  description?: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsEnum(ExampleFramework)
  framework: ExampleFramework;

  @IsInt()
  @Min(0)
  order: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
