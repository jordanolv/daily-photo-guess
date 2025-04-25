import { Repository } from 'typeorm';
import { Guess } from './entities/guess.entity';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
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
    update(id: number, updateGuessDto: UpdateGuessDto): Promise<Guess>;
    remove(id: number): Promise<void>;
    removeAll(): Promise<void>;
    getUserForToday(userId: string): Promise<{
        remainingAttempts: number;
        alreadyFound: boolean;
    }>;
    countCorrectGuessesForToday(): Promise<number>;
    getLeaderboard(): Promise<{
        userId: string;
        total: number;
    }[]>;
}
export {};
