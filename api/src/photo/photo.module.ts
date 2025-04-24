import { Module, forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './photo.entity';
import { PhotoService } from './photo.service';
import { PhotoController, AdminController } from './photo.controller';
import { GuessModule } from '../guess/guess.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Photo]),
    forwardRef(() => GuessModule),
  ],
  providers: [PhotoService],
  controllers: [PhotoController, AdminController],
  exports: [PhotoService],
})
export class PhotoModule {}
