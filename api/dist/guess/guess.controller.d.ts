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
    findOne(id: string): Promise<import("./entities/guess.entity").Guess>;
    update(id: string, updateGuessDto: UpdateGuessDto): string;
    remove(id: string): string;
    removeAll(): Promise<import("typeorm").DeleteResult>;
}
