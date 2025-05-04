import * as passport from 'passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class PassportConfig {
  constructor(private authService: AuthService) {
    this.init();
  }

  init() {
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
      try {
        const user = await this.authService.findById(id);
        console.log('user',user);
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
  }
} 