import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { PhotoModule } from 'src/photo/photo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from './entities/guess.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]),
    PhotoModule,
  ],
  controllers: [GuessController],
  providers: [GuessService],
})
export class GuessModule {}
