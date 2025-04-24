// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PhotoModule } from './photo/photo.module';
import { GuessModule } from './guess/guess.module';
import { LeaderboardModule } from './gateway/leaderboard.module';
import * as path from 'path';

@Module({
  imports: [
    // ← on le met en premier pour charger le .env
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(__dirname, '..', '.env'), }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    PhotoModule,
    GuessModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
