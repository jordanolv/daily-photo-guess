import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
export declare class PhotoController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    create(createPhotoDto: CreatePhotoDto): Promise<import("./entities/photo.entity").Photo>;
    findAll(): Promise<import("./entities/photo.entity").Photo[]>;
    generateTodayPhoto(): Promise<import("./entities/photo.entity").Photo | null>;
    getTodayPhoto(): Promise<import("./entities/photo.entity").Photo | null>;
    remove(id: string): any;
}
