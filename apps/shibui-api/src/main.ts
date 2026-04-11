import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ── API versioning prefix ──────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  // ── Global validation ──────────────────────────────────────────────────────
  // whitelist: strips properties not in the DTO
  // forbidNonWhitelisted: throws 400 if unknown properties are sent
  // transform: auto-converts plain objects to DTO class instances
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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
