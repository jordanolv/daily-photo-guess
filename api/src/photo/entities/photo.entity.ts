import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

export enum PhotoPeriod {
  MORNING = 'morning',
  AFTERNOON = 'afternoon'
}

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  @Index()
  date: string | null;  

  @Column()
  imageUrl: string;

  @Column()
  solution: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  period: PhotoPeriod | null;
}
