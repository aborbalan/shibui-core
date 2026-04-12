import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

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
  app.useGlobalInterceptors(new ResponseInterceptor());

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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
