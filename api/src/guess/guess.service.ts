import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guess } from './guess.entity';
import { PhotoService } from '../photo/photo.service';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(Guess) private repo: Repository<Guess>,
    @Inject(forwardRef(() => PhotoService))
    private photoService: PhotoService,
  ) {}

  async submit(userId: string, date: string, guess: string) {
    const photo = await this.photoService.getToday();
    if (!photo || photo.date !== date) {
      throw new BadRequestException('Aucune photo pour cette date');
    }

    // Vérifier si l'utilisateur a déjà trouvé
    const hasWon = await this.repo.findOne({
      where: { userId, date, correct: true }
    });
    if (hasWon) {
      throw new BadRequestException('Vous avez déjà trouvé cette photo');
    }

    const prior = await this.repo.count({ where: { userId, date } });
    if (prior >= 3) {
      throw new BadRequestException('Plus d\'essais restants');
    }

    const correct = guess.trim().toLowerCase() === photo.solution.toLowerCase();
    const entry = this.repo.create({
      userId, date, guess, correct,
      timestamp: Date.now(),
    });
    await this.repo.save(entry);
    return {
      correct,
      remainingTries: 3 - (prior + 1),
    };
  }

  async getLeaderboard(date: string) {
    // Compter le nombre total de mots devinés par utilisateur
    const result = await this.repo
      .createQueryBuilder('g')
      .select('g.userId', 'userId')
      .addSelect('COUNT(*)', 'totalCorrect')
      .where('g.correct = :correct', { correct: true })
      .groupBy('g.userId')
      .orderBy('totalCorrect', 'DESC')
      .getRawMany();

    console.log('Leaderboard result:', result); // Pour le debug
    return result;
  }

  async getTotalCorrectGuesses(date: string): Promise<number> {
    return this.repo.count({
      where: { date, correct: true }
    });
  }

  async deleteGuessesForDate(date: string) {
    await this.repo.delete({ date });
  }

  async deleteAllGuesses() {
    await this.repo.clear();
  }
}
