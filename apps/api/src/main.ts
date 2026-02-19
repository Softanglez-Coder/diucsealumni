import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Structured logging via Pino
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

  // Security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: corsOrigin.split(',').map((o) => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie parser (for HttpOnly refresh token cookie)
  app.use(cookieParser());

  // Global prefix
  app.setGlobalPrefix(apiPrefix);

  // API versioning
  app.enableVersioning({ type: VersioningType.URI });

  // Global validation pipe — strips unknown fields, auto-transforms types
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global exception filter — RFC 7807 Problem Details responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger API docs (development only)
  if (configService.get('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('CSE DIU Alumni API')
      .setDescription('REST API for the CSE DIU Alumni Platform')
      .setVersion('1')
      .addBearerAuth()
      .addCookieAuth('refresh_token')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(port);
  app.get(Logger).log(`🚀 API running on http://localhost:${port}/${apiPrefix}`);
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
