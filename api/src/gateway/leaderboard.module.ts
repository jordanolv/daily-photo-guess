import { Module } from '@nestjs/common';
import { LeaderboardGateway } from './leaderboard.gateway';
import { GuessModule } from '../guess/guess.module';

@Module({
  imports: [GuessModule],
  providers: [LeaderboardGateway],
})
export class LeaderboardModule {}
