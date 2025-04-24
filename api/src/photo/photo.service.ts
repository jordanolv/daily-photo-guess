import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { Photo } from './photo.entity';
import { GuessService } from '../guess/guess.service';

@Injectable()
export class PhotoService {
  private readonly logger = new Logger(PhotoService.name);

  constructor(
    @InjectRepository(Photo)
    private readonly repo: Repository<Photo>,
    @Inject(forwardRef(() => GuessService))
    private readonly guessService: GuessService,
  ) {}

  @Cron('0 * * * *')  // Toutes les heures à minute 0
  async generateDailyPhoto() {
    const date = new Date().toISOString().slice(0, 10);
    this.logger.log(`🔄 Tentative de génération de photo pour ${date}`);
    
    // Vérifier si une photo est déjà assignée pour aujourd'hui
    const existingPhoto = await this.repo.findOneBy({ date });
    if (existingPhoto) {
      // Mettre la date d'hier sur l'ancienne photo
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await this.repo.update(existingPhoto.id, { date: yesterday.toISOString().slice(0, 10) });
      this.logger.log(`📅 Photo existante déplacée à hier`);
    }
    
    // Supprimer les guesses pour la date du jour
    await this.guessService.deleteGuessesForDate(date);
    this.logger.log(`🧹 Guesses supprimés pour ${date}`);
    
    // Sélectionner une photo existante non utilisée
    const unusedPhoto = await this.repo.findOne({
      where: { date: IsNull() },
      order: { id: 'ASC' }
    });

    if (!unusedPhoto) {
      this.logger.error('❌ Aucune photo non utilisée disponible');
      return;
    }

    // Mettre à jour la photo avec la date
    await this.repo.update(unusedPhoto.id, { date });
    this.logger.log(`✅ Nouvelle photo assignée pour ${date}`);
  }

  async getToday(): Promise<Photo> {
    const date = new Date().toISOString().slice(0,10);
    const photo = await this.repo.findOneBy({ date });
    if (!photo) throw new Error(`No photo found for date ${date}`);
    return photo;
  }

  async addPhoto(imageUrl: string, solution: string): Promise<Photo> {
    return this.repo.save({ imageUrl, solution });
  }

  async listUnusedPhotos(): Promise<Photo[]> {
    return this.repo.find({
      where: { date: IsNull() },
      order: { id: 'ASC' }
    });
  }

  async listAllPhotos(): Promise<Photo[]> {
    return this.repo.find({
      order: { id: 'ASC' }
    });
  }

  async deletePhoto(id: number): Promise<void> {
    const photo = await this.repo.findOneBy({ id });
    if (!photo) return;

    // Si c'est la photo du jour, supprimer les guesses et générer une nouvelle photo
    if (photo.date === new Date().toISOString().slice(0, 10)) {
      await this.guessService.deleteGuessesForDate(photo.date);
      
      // Mettre la date d'hier sur l'ancienne photo
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      await this.repo.update(id, { date: yesterday.toISOString().slice(0, 10) });
      
      // Générer une nouvelle photo
      await this.generateDailyPhoto();
    } else {
      await this.repo.delete(id);
    }
  }

  async resetAllPhotos(): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    
    // Supprimer les guesses du jour
    await this.guessService.deleteGuessesForDate(today);
    
    // Supprimer toutes les dates
    await this.repo.query('UPDATE photo SET date = NULL');
    
    // Générer une nouvelle photo du jour
    await this.generateDailyPhoto();
  }
}
