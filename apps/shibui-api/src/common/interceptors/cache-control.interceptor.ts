import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  private static readonly BROWSER_TTL = 60; // 1 min en browser
  private static readonly CDN_TTL = 3600; // 1 hora en Cloudflare

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{ method: string }>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.method === 'GET') {
      response.setHeader(
        'Cache-Control',
        `public, max-age=${CacheControlInterceptor.BROWSER_TTL}, s-maxage=${CacheControlInterceptor.CDN_TTL}, stale-while-revalidate=60`,
      );
    } else {
      // POST/PATCH/DELETE nunca se cachean
      response.setHeader('Cache-Control', 'no-store');
    }

    return next.handle();
  }
}
