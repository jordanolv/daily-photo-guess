import { DataSource } from 'typeorm';
import { Photo } from './src/photo/photo.entity';
import { Guess } from './src/guess/guess.entity';

export default new DataSource({
  type: 'sqlite',
  database: '/home/deploy/dbs/daily-photo-guess.sqlite',
  entities: [Photo, Guess],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
}); 