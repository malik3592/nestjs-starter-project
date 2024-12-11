import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json } from 'express';
import * as basicAuth from 'express-basic-auth';

async function bootstrap() {
  const SWAGGER_ENVS = ['local', 'development', 'qa', 'staging'];
  const app = await NestFactory.create(AppModule);
  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    app.use(
      ['/api-docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }
  //global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Incident Reporting API Documentation')
    .setDescription(
      'Comprehensive API documentation for the Incident Reporting system, providing endpoints to manage users and incidents related operations.',
    )
    .addBearerAuth()
    .addServer('http://127.0.01:5000', 'Local Environment')
    // .addServer('http://145.223.33.189:3001', 'Dev Environment')
    .setVersion('1.0')
    .build();

  //Instantiate Swagger document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  //enable cors
  app.enableCors();

  app.use(json({ limit: '50mb' }));

  await app.listen(process.env.PORT);
}
bootstrap();
