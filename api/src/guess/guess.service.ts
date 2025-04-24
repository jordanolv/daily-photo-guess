import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { Guess } from './entities/guess.entity';
import { Repository } from 'typeorm';
import { Photo } from '../photo/entities/photo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PhotoService } from '../photo/photo.service';

type GuessResponse = {
  status: 'correct' | 'wrong';
  guess: Guess;
  remainingAttempts: number;
  alreadyFound: boolean;
};

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(Guess) private guessRepository: Repository<Guess>,
    private photoService: PhotoService,
  ) {}

  async create(createGuessDto: CreateGuessDto): Promise<GuessResponse> {
    const { userId, attempt } = createGuessDto;
  
    const photo = await this.photoService.findTodayPhoto();
    if (!photo) {
      throw new NotFoundException('Photo du jour introuvable');
    }
  
    // Vérifie si déjà trouvé
    const existingCorrect = await this.guessRepository.findOne({
      where: { userId, isCorrect: true, photo: { id: photo.id } },
      relations: ['photo']
    });
  
    if (existingCorrect) {
      return {
        status: 'correct',
        guess: existingCorrect,
        remainingAttempts: 0,
        alreadyFound: true,
      };
    }
  
    // Compte les essais actuels
    const attemptCount = await this.guessRepository.count({
      where: { userId, photo: { id: photo.id } },
      relations: ['photo']
    });
  
    if (attemptCount >= 3) {
      throw new BadRequestException('Tu as déjà utilisé tes 3 essais pour cette photo 😬');
    }
  
    const isCorrect = photo.solution.trim().toLowerCase() === attempt.trim().toLowerCase();
  
    const guess = this.guessRepository.create({
      userId,
      attempt,
      isCorrect,
      photo,
    });
  
    const savedGuess = await this.guessRepository.save(guess);
  
    return {
      status: isCorrect ? 'correct' : 'wrong',
      guess: savedGuess,
      remainingAttempts: 2 - attemptCount,
      alreadyFound: isCorrect,
    };
  }
  
  findAll(): Promise<Guess[]> {
    return this.guessRepository.find({
      relations: ['photo'],
    });
  }
  

  async findOne(id: number): Promise<Guess> {
    const guess = await this.guessRepository.findOne({
      where: { id },
      relations: ['photo'],
    });
    if (!guess) {
      throw new NotFoundException(`Guess with ID ${id} not found`);
    }
    return guess;
  }

  update(id: number, updateGuessDto: UpdateGuessDto) {
    return `This action updates a #${id} guess`;
  }

  remove(id: number) {
    return `This action removes a #${id} guess`;
  }

  removeAll() {
    return this.guessRepository.delete({});
  }

  async getLeaderboard(): Promise<{ userId: string; total: number }[]> {
    return this.guessRepository
      .createQueryBuilder('guess')
      .select('guess.userId', 'userId')
      .addSelect('COUNT(*)', 'total')
      .where('guess.isCorrect = :isCorrect', { isCorrect: true })
      .groupBy('guess.userId')
      .orderBy('total', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async countCorrectGuessesForToday(): Promise<number> {
    const photo = await this.photoService.findTodayPhoto(); 
    if (!photo) return 0;
  
    return this.guessRepository.count({
      where: {
        photo: { id: photo.id },
        isCorrect: true,
      },
      relations: ['photo'],
    });
  }
}
