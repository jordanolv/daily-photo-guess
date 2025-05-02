// src/guess/entities/guess.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discordId: string;

  @Column()
  date: string; // format YYYY-MM-DD

  @Column({ default: 0 })
  attemptCount: number;

  @Column({ default: false })
  found: boolean;

  @CreateDateColumn()
  createdAt: Date;
}

