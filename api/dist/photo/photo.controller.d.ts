import { PhotoService } from './photo.service';
import { Photo } from './photo.entity';
export declare class PhotoController {
    private svc;
    constructor(svc: PhotoService);
    today(): Promise<{
        date: string;
        imageUrl: string;
        maxTries: number;
    }>;
}
export declare class AdminController {
    private readonly photoSvc;
    constructor(photoSvc: PhotoService);
    getTodayAdmin(): Promise<Photo>;
    gen(): Promise<{
        ok: boolean;
    }>;
    reset(): Promise<{
        ok: boolean;
    }>;
    addPhoto(data: {
        imageUrl: string;
        solution: string;
    }): Promise<Photo>;
    listAllPhotos(): Promise<Photo[]>;
    listUnusedPhotos(): Promise<Photo[]>;
    deletePhoto(id: string): Promise<{
        ok: boolean;
    }>;
}
