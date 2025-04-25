import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    create(file: Express.Multer.File, dto: CreatePhotoDto): Promise<import("./entities/photo.entity").Photo>;
    findAll(): Promise<import("./entities/photo.entity").Photo[]>;
    generateTodayPhoto(): Promise<import("./entities/photo.entity").Photo | null>;
    getTodayPhoto(): Promise<import("./entities/photo.entity").Photo | null>;
    regenerate(): Promise<import("./entities/photo.entity").Photo | null>;
    resetAllPhotos(): Promise<{
        message: string;
        affected: number;
    }>;
    deleteAllPhotos(): Promise<number>;
}
