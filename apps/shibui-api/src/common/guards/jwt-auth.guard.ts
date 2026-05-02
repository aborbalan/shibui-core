import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Aplica este guard a cualquier endpoint que requiera autenticación.
 *
 * @example
 * @UseGuards(JwtAuthGuard)
 * @Post()
 * create(@Body() dto: CreateComponentDto) { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
