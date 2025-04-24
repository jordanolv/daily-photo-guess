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
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(__dirname, '..', '.env'), }),

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Photo, Guess],
      synchronize: true,
    }),

    ScheduleModule.forRoot(),
    PhotoModule,
    GuessModule,
  ],
})
export class AppModule {}
