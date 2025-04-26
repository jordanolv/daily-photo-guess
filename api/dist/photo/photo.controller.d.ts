import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { Photo } from './entities/photo.entity';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    create(file: Express.Multer.File, dto: CreatePhotoDto): Promise<Photo>;
    findAll(): Promise<Photo[]>;
    generateTodayPhoto(): Promise<Photo | null>;
    getTodayPhoto(): Promise<Photo | null>;
    remove(id: string): Promise<import("typeorm").DeleteResult>;
    regenerate(): Promise<Photo | null>;
    resetAllPhotos(): Promise<{
        message: string;
        affected: number;
    }>;
    deleteAllPhotos(): Promise<number>;
}
