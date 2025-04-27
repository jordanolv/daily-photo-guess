import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo, PhotoPeriod } from './entities/photo.entity';
import { Repository, IsNull } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { format } from 'date-fns';
import { Cron } from '@nestjs/schedule';
import { getTodayDate, getCurrentPeriod } from '../utils/date';
import { Guess } from '../guess/entities/guess.entity';
@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);

  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Guess)
    private guessRepository: Repository<Guess>,
  ) { }

  async create(createPhotoDto: CreatePhotoDto): Promise<Photo> {
    const photo = this.photoRepository.create(createPhotoDto);
    const saved = await this.photoRepository.save(photo);
    this.logger.log(`🆕 Photo créée : ${saved.imageUrl} (solution: ${saved.solution})`);
    return saved;
  }

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  remove(id: number) {
    return this.photoRepository.delete(id);
  }

  async findRandomWithoutDate(): Promise<Photo | null> {
    const photos = await this.photoRepository.find({
      where: { date: IsNull(), period: IsNull() },
    });

    if (photos.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * photos.length);
    return photos[randomIndex];
  }

  async generateTodayPhoto(): Promise<Photo | null> {
    const date = getTodayDate();
    const period = getCurrentPeriod();

    this.logger.log(`Tentative de génération de la photo du jour [${date} - ${period}]`);

    const existing = await this.photoRepository.findOne({ where: { date, period } });
    if (existing) {
      this.logger.log(`Photo déjà existante pour aujourd'hui : ${existing.imageUrl}`);
      return existing;
    }

    const random = await this.findRandomWithoutDate();
    if (!random) {
      this.logger.warn('Aucune photo disponible sans date pour générer la photo du jour');
      return null;
    }

    random.date = date;
    random.period = period;

    const saved = await this.photoRepository.save(random);
    this.logger.log(`✅ Photo du jour générée : ${saved.imageUrl} (solution: ${saved.solution})`);

    return saved;
  }

  async regenerateTodayPhoto(): Promise<Photo | null> {
    const date = getTodayDate();
    const period = getCurrentPeriod();
  
    const current = await this.photoRepository.findOne({ where: { date, period } });
  
    if (current) {
      current.date = null;
      current.period = null;
      await this.photoRepository.save(current);
    }
  
    await this.guessRepository.delete({ date, period });
    
    return this.generateTodayPhoto();
  }

  async findTodayPhoto(): Promise<Photo | null> {
    const date = getTodayDate();
    const period = getCurrentPeriod();
    
    return this.photoRepository.findOne({ where: { date, period } });
  }

  @Cron('0 0 0,12 * * *') // ← à 00h00 et à 12h00 chaque jour
  // @Cron('*/10 * * * * *') // test toutes les 10 secondes
  async handlePhotoGeneration() {
    this.logger.debug('⏰ Déclenchement automatique du cron de génération de photo');
    await this.generateTodayPhoto();
  }

  async resetAllPhotos(): Promise<number> {
    const result = await this.photoRepository
      .createQueryBuilder()
      .update()
      .set({ date: null, period: null })
      .execute();
  
    return result.affected || 0;
  }

  async deleteAllPhotos(): Promise<number> {
    const result = await this.photoRepository.delete({});
    return result.affected || 0;
  }
  
}