import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { Photo } from './photo.entity';

@Controller('api')
export class PhotoController {
  constructor(private svc: PhotoService) {}

  @Get('today')
  async today(): Promise<{
    date: string;
    imageUrl: string;
    maxTries: number;
  }> {
    const photo = await this.svc.getToday();
    return {
      date: photo.date,
      imageUrl: photo.imageUrl,
      maxTries: 3,
    };
  }
}

@Controller('api/admin')
export class AdminController {
  constructor(private readonly photoSvc: PhotoService) {}

  @Get('today')
  async getTodayAdmin(): Promise<Photo> {
    return this.photoSvc.getToday();
  }

  @Post('generate')
  async gen() {
    await this.photoSvc.generateDailyPhoto();
    return { ok: true };
  }

  @Post('reset')
  async reset() {
    await this.photoSvc.resetAllPhotos();
    return { ok: true };
  }

  @Post('photos')
  async addPhoto(@Body() data: { imageUrl: string; solution: string }) {
    const photo = await this.photoSvc.addPhoto(data.imageUrl, data.solution);
    return photo;
  }

  @Get('photos')
  async listAllPhotos() {
    return this.photoSvc.listAllPhotos();
  }

  @Get('photos/unused')
  async listUnusedPhotos() {
    return this.photoSvc.listUnusedPhotos();
  }

  @Delete('photos/:id')
  async deletePhoto(@Param('id') id: string) {
    await this.photoSvc.deletePhoto(parseInt(id));
    return { ok: true };
  }
}