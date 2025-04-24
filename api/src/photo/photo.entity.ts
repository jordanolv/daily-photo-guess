import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @Index()
  date: string;           // ex. '2025-04-23'

  @Column()
  imageUrl: string;

  @Column()
  solution: string;             // ex. 'Titeuf'
}
