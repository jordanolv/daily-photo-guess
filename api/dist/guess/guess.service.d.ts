import { Repository } from 'typeorm';
import { Guess } from './guess.entity';
import { PhotoService } from '../photo/photo.service';
export declare class GuessService {
    private repo;
    private photoService;
    constructor(repo: Repository<Guess>, photoService: PhotoService);
    submit(userId: string, date: string, guess: string): Promise<{
        correct: boolean;
        remainingTries: number;
    }>;
    getLeaderboard(date: string): Promise<any[]>;
    getTotalCorrectGuesses(date: string): Promise<number>;
    deleteGuessesForDate(date: string): Promise<void>;
    deleteAllGuesses(): Promise<void>;
}
