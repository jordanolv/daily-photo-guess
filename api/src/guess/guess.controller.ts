import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { GuessService } from './guess.service';

@Controller('api/guess')
export class GuessController {
  constructor(private readonly svc: GuessService) {}

  @Post()
  async submit(@Body() data: { userId: string; date: string; guess: string }) {
    return this.svc.submit(data.userId, data.date, data.guess);
  }

  @Get('leaderboard/:date')
  async getLeaderboard(@Param('date') date: string) {
    return this.svc.getLeaderboard(date);
  }

  @Get('total-correct/:date')
  async getTotalCorrect(@Param('date') date: string) {
    return this.svc.getTotalCorrectGuesses(date);
  }
}
