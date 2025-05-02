import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async validateDiscordUser(discordId: string, username: string, avatar: string | null): Promise<User> {
    let user = await this.userRepository.findOne({ where: { discordId } });

    if (!user) {
      this.logger.log(`Création d'un nouvel utilisateur Discord: ${username}`);
      user = this.userRepository.create({
        discordId,
        username,
        avatar: avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : '',
      });
      await this.userRepository.save(user);
    } else {
      // Mettre à jour les informations si nécessaire
      if (user.username !== username || user.avatar !== (avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : '')) {
        this.logger.log(`Mise à jour des informations de l'utilisateur Discord: ${username}`);
        user.username = username;
        user.avatar = avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png` : '';
        await this.userRepository.save(user);
      }
    }

    return user;
  }
} 