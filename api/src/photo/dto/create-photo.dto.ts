import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PhotoPeriod } from '../entities/photo.entity';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  solution: string;
}


