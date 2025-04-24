import { GuessService } from './guess.service';
export declare class GuessController {
    private readonly svc;
    constructor(svc: GuessService);
    submit(data: {
        userId: string;
        date: string;
        guess: string;
    }): Promise<{
        correct: boolean;
        remainingTries: number;
    }>;
    getLeaderboard(date: string): Promise<any[]>;
    getTotalCorrect(date: string): Promise<number>;
}
