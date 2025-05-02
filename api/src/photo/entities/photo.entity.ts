import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

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
}
