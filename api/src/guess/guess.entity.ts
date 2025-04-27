import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Guess {
  @PrimaryGeneratedColumn() id: number;
  @Column() date: string;
  @Column() userId: string;
  @Column() guess: string;
  @Column() correct: boolean;
  @Column('int') timestamp: number; // ms depuis epoch
}
