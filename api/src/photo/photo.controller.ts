import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Photos')
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) { }

  @Post()
  @ApiOperation({ summary: 'Créer une photo' })
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photoService.create(createPhotoDto);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une photo' })
  remove(@Param('id') id: string) {
    return this.photoService.remove(+id);
  }
}
