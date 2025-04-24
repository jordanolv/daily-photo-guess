import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
export declare class PhotoService {
    private photoRepository;
    private readonly logger;
    constructor(photoRepository: Repository<Photo>);
    create(createPhotoDto: CreatePhotoDto): Promise<Photo>;
    findAll(): Promise<Photo[]>;
    remove(id: number): any;
    findRandomWithoutDate(): Promise<Photo | null>;
    generateTodayPhoto(): Promise<Photo | null>;
    findTodayPhoto(): Promise<Photo | null>;
    handlePhotoGeneration(): Promise<void>;
}
