import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { Guess } from '../guess/entities/guess.entity';
export declare class PhotoService {
    private photoRepository;
    private guessRepository;
    private readonly logger;
    constructor(photoRepository: Repository<Photo>, guessRepository: Repository<Guess>);
    create(createPhotoDto: CreatePhotoDto): Promise<Photo>;
    findAll(): Promise<Photo[]>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
    findRandomWithoutDate(): Promise<Photo | null>;
    generateTodayPhoto(): Promise<Photo | null>;
    regenerateTodayPhoto(): Promise<Photo | null>;
    findTodayPhoto(): Promise<Photo | null>;
    handlePhotoGeneration(): Promise<void>;
    resetAllPhotos(): Promise<number>;
    deleteAllPhotos(): Promise<number>;
}
