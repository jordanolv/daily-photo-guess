// src/guess/entities/guess.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Photo } from '../../photo/entities/photo.entity';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  attempt: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(() => Photo, { onDelete: 'CASCADE' })
  photo: Photo;

  @CreateDateColumn()
  createdAt: Date;
}
