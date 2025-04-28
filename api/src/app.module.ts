// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { Photo } from './photo/entities/photo.entity';
import { PhotoModule } from './photo/photo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GuessModule } from './guess/guess.module';
import { Guess } from './guess/entities/guess.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(__dirname, '..', '.env'), }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Photo, Guess],
      synchronize: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    },
    {
      rootPath: join(__dirname, '..', 'uploads'), // Où sont stockées tes images
      serveRoot: '/uploads', // Depuis quelle URL publique
    },
    {
      rootPath: join(__dirname, '..', '..', 'ui', 'dist'), // Ton front compilé
      exclude: ['/api*', '/photo*', '/guess*', '/uploads*'], // Pas toucher API/Images
    },),
    ScheduleModule.forRoot(),
    PhotoModule,
    GuessModule,
  ],
})
export class AppModule {}
