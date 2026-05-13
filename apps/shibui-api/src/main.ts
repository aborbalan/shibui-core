import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── API versioning prefix ──────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Global validation ──────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── Global response envelope ───────────────────────────────────────────────
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new CacheControlInterceptor(),
  );
  // ── Global error handler ───────────────────────────────────────────────────
  app.useGlobalFilters(new AllExceptionsFilter());

  // ── OpenAPI spec ───────────────────────────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('Shibui UI API')
    .setDescription(
      'REST API for the Shibui UI component library. Provides access to components, categories, examples and users.',
    )
    .setVersion('1.0.0')
    .addTag('categories', 'Component categories and navigation structure')
    .addTag('components', 'Web components built with Lit')
    .addTag('examples', 'Usage examples for each component')
    .addTag('tokens', 'Design tokens (CSS custom properties) from @shibui/ui')
    .addTag('users', 'User management')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ── Scalar UI at /api/docs ─────────────────────────────────────────────────
  app.use(
    '/api/docs',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'saturn',
    }),
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  // localhost siempre permitido (cualquier puerto) para desarrollo local.
  // En producción se añaden los orígenes de CORS_ORIGINS (CSV).
  const productionOrigins = process.env.CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? [];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Peticiones sin origin (curl, server-to-server) → permitir
      if (!origin) { callback(null, true); return; }

      const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
      if (isLocalhost || productionOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
