import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { Guess } from './entities/guess.entity';
import { Repository } from 'typeorm';
import { PhotoService } from '../photo/photo.service';
type GuessResponse = {
    status: 'correct' | 'wrong';
    guess: Guess;
    remainingAttempts: number;
    alreadyFound: boolean;
};
export declare class GuessService {
    private guessRepository;
    private photoService;
    constructor(guessRepository: Repository<Guess>, photoService: PhotoService);
    create(createGuessDto: CreateGuessDto): Promise<GuessResponse>;
    findAll(): Promise<Guess[]>;
    findOne(id: number): Promise<Guess>;
    update(id: number, updateGuessDto: UpdateGuessDto): string;
    remove(id: number): string;
    removeAll(): Promise<import("typeorm").DeleteResult>;
    getLeaderboard(): Promise<{
        userId: string;
        total: number;
    }[]>;
    countCorrectGuessesForToday(): Promise<number>;
}
export {};
