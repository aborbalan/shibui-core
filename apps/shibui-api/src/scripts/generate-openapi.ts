import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync, copyFileSync } from 'fs'; // 👈 añadir copyFileSync
import { join } from 'path';
import { AppModule } from '../app.module';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.setGlobalPrefix('api/v1');

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

  const outputDir = process.env.DOCS_OUTPUT_DIR
    ? join(process.env.DOCS_OUTPUT_DIR)
    : join(__dirname, '../../docs-dist');

  mkdirSync(outputDir, { recursive: true });

  writeFileSync(
    join(outputDir, 'openapi.json'),
    JSON.stringify(document, null, 2),
    'utf8',
  );

  // 👇 copia el index.html estático
  copyFileSync(
    join(__dirname, '../../docs-static/index.html'),
    join(outputDir, 'index.html'),
  );

  console.log(`✅ Docs generated at ${outputDir}`);

  await app.close();
}

void generateOpenApi();
