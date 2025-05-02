import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuessDto {
  @ApiProperty()
  @IsString()
  discordId: string;

  @ApiProperty()
  @IsString()
  attempt: string;
}
