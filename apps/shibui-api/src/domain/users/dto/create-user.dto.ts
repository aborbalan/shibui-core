import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin@shibui.dev' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Shibui Admin', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CONTRIBUTOR })
  @IsEnum(UserRole)
  role: UserRole;
}
