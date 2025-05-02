import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiPropertyOptional()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty()
  @IsString()
  solution: string;
}


