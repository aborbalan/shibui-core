import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  private readonly expiresIn = 3600;
  private readonly adminEmail = 'admin@shibui.dev';
  private readonly adminId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  login(dto: LoginDto): TokenResponseDto {
    const rawPassword =
      (this.configService.get<string>('ADMIN_PASSWORD') as string) ??
      'changeme';

    if (dto.email !== this.adminEmail || dto.password !== rawPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: this.adminId,
      email: this.adminEmail,
      role: 'admin',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.expiresIn,
    };
  }
}
