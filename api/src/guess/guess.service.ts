import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guess } from './entities/guess.entity';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { PhotoService } from '../photo/photo.service';
import { getTodayDate, getCurrentPeriod } from '../utils/date';

type GuessResponse = {
  status: 'correct' | 'wrong';
  guess: Guess;
  remainingAttempts: number;
  alreadyFound: boolean;
};

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
    private photoService: PhotoService,
  ) {}

  async create(createGuessDto: CreateGuessDto): Promise<GuessResponse> {
    const { userId, attempt } = createGuessDto;
    const date = getTodayDate();
    const period = getCurrentPeriod();

    const photo = await this.photoService.findTodayPhoto();
    if (!photo) {
      throw new NotFoundException('Photo du jour introuvable');
    }

    let guess = await this.guessRepository.findOne({ where: { userId, date, period } });

    if (guess?.found) {
      return {
        status: 'correct',
        guess,
        remainingAttempts: 0,
        alreadyFound: true,
      };
    }

    if (!guess) {
      guess = this.guessRepository.create({
        userId,
        date,
        period,
        attemptCount: 0,
        found: false,
      });
    }

    if (guess.attemptCount >= 3) {
      throw new BadRequestException('Tu as déjà utilisé tes 3 essais pour cette période 😬');
    }

    guess.attemptCount++;

    const isCorrect = photo.solution.trim().toLowerCase() === attempt.trim().toLowerCase();
    if (isCorrect) {
      guess.found = true;
    }

    const saved = await this.guessRepository.save(guess);

    return {
      status: isCorrect ? 'correct' : 'wrong',
      guess: saved,
      remainingAttempts: Math.max(0, 3 - saved.attemptCount),
      alreadyFound: saved.found,
    };
  }

  async findAll(): Promise<Guess[]> {
    return this.guessRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Guess> {
    const guess = await this.guessRepository.findOne({ where: { id } });
    if (!guess) {
      throw new NotFoundException(`Session de jeu #${id} introuvable`);
    }
    return guess;
  }

  async update(id: number, updateGuessDto: UpdateGuessDto): Promise<Guess> {
    const guess = await this.findOne(id);
    Object.assign(guess, updateGuessDto);
    return this.guessRepository.save(guess);
  }

  async remove(id: number): Promise<void> {
    await this.guessRepository.delete(id);
  }

  async removeAll(): Promise<void> {
    await this.guessRepository.clear();
  }

  async getUserForToday(userId: string) {
    const date = getTodayDate();
    const period = getCurrentPeriod();

    const guess = await this.guessRepository.findOne({ where: { userId, date, period } });

    return {
      remainingAttempts: guess ? Math.max(0, 3 - guess.attemptCount) : 3,
      alreadyFound: guess?.found || false,
    };
  }

  async countCorrectGuessesForToday(): Promise<number> {
    const date = getTodayDate();
    const period = getCurrentPeriod();

    return this.guessRepository.count({
      where: { date, period, found: true },
    });
  }

  async getLeaderboard(): Promise<{ userId: string; total: number }[]> {
    return this.guessRepository
      .createQueryBuilder('guess')
      .select('guess.userId', 'userId')
      .addSelect('COUNT(*)', 'total')
      .where('guess.found = true')
      .groupBy('guess.userId')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
