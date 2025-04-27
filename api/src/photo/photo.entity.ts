import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum PhotoPeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon'
}

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

  @Column({
    type: 'varchar',
    nullable: true
  })
  period: PhotoPeriod;
}
