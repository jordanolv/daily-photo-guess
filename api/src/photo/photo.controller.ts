import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Photos')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePhotoDto
  ) {
    if (!file) {
      throw new BadRequestException('Aucune image fournie');
    }

    const photo = await this.photoService.create({
      ...dto,
      imageUrl: `/uploads/${file.filename}`,
    });

    return photo;
  }


  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les photos' })
  findAll() {
    return this.photoService.findAll();
  }

  @Get('generate-today')
  @ApiOperation({ summary: 'Récupére la photo du jour' })
  generateTodayPhoto() {
    return this.photoService.generateTodayPhoto();
  }

  @Get('today')
  @ApiOperation({ summary: 'Récupére la photo du jour' })
  getTodayPhoto() {
    return this.photoService.findTodayPhoto();
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Supprimer une photo' })
  // remove(@Param('id') id: string) {
  //   return this.photoService.remove(+id);
  // }

  @Post('regenerate')
  @ApiOperation({ summary: 'Regénère une nouvelle photo pour le moment actuel (admin)' })
  regenerate() {
    return this.photoService.regenerateTodayPhoto();
  }

  @Post('reset-dates')
  async resetAllPhotos(): Promise<{ message: string; affected: number }> {
    const affected = await this.photoService.resetAllPhotos();
    return {
      message: `✅ ${affected} photos ont été réinitialisées.`,
      affected
    };
  }

  //delete all photos
  @Delete('delete-all')
  @ApiOperation({ summary: 'Supprimer toutes les photos' })
  deleteAllPhotos() {
    return this.photoService.deleteAllPhotos();
  }
}


