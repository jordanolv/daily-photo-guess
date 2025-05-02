import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  });

  // Configuration des sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60000 * 60 * 24, // 24 heures
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    })
  );

  // Initialisation de Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // 🔧 Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Daily Photo Guess API')
    .setDescription('API pour la gestion des photos du jeu')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();