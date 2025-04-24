import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guess } from './guess.entity';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { PhotoModule } from '../photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guess]),
    forwardRef(() => PhotoModule),
  ],
  providers: [GuessService],
  controllers: [GuessController],
  exports: [GuessService],
})
export class GuessModule {}
