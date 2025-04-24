import { Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { GuessService } from '../guess/guess.service';
export declare class PhotoService {
    private readonly repo;
    private readonly guessService;
    private readonly logger;
    constructor(repo: Repository<Photo>, guessService: GuessService);
    generateDailyPhoto(): Promise<void>;
    getToday(): Promise<Photo>;
    addPhoto(imageUrl: string, solution: string): Promise<Photo>;
    listUnusedPhotos(): Promise<Photo[]>;
    listAllPhotos(): Promise<Photo[]>;
    deletePhoto(id: number): Promise<void>;
    resetAllPhotos(): Promise<void>;
}
