import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './discord.strategy';
import { PassportConfig } from './passport.config';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ session: true }),
    ConfigModule,
  ],
  providers: [AuthService, DiscordStrategy, PassportConfig],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 