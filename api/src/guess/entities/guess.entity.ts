// src/guess/entities/guess.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Photo, PhotoPeriod } from '../../photo/entities/photo.entity';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  date: string; // format YYYY-MM-DD

  @Column({ type: 'text' })
  period: PhotoPeriod;

  @Column({ default: 0 })
  attemptCount: number;

  @Column({ default: false })
  found: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

