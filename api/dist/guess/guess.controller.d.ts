import { GuessService } from './guess.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
export declare class GuessController {
    private readonly guessService;
    constructor(guessService: GuessService);
    create(createGuessDto: CreateGuessDto): Promise<{
        status: "correct" | "wrong";
        guess: import("./entities/guess.entity").Guess;
        remainingAttempts: number;
        alreadyFound: boolean;
    }>;
    findAll(): Promise<import("./entities/guess.entity").Guess[]>;
    getLeaderboard(): Promise<{
        userId: string;
        total: number;
    }[]>;
    getTodayCorrectCount(): Promise<number>;
    getUserForToday(userId: string): Promise<{
        remainingAttempts: number;
        alreadyFound: boolean;
    }>;
    findOne(id: string): Promise<import("./entities/guess.entity").Guess>;
    update(id: string, updateGuessDto: UpdateGuessDto): Promise<import("./entities/guess.entity").Guess>;
    remove(id: string): Promise<void>;
    removeAll(): Promise<void>;
}
