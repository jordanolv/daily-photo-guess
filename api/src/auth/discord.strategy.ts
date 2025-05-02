import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  private readonly logger = new Logger(DiscordStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const clientId = configService.get<string>('DISCORD_CLIENT_ID');
    const clientSecret = configService.get<string>('DISCORD_CLIENT_SECRET');
    const callbackURL = configService.get<string>('DISCORD_CALLBACK_URL');

    if (!clientId || !clientSecret || !callbackURL) {
      throw new Error('Missing Discord OAuth2 configuration');
    }

    super({
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: callbackURL,
      scope: ['identify', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, username, avatar } = profile;
    const user = await this.authService.validateDiscordUser(id, username, avatar);
    return user;
  }
} 