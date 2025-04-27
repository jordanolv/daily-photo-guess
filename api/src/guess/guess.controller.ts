import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { CreateGuessDto } from './dto/create-guess.dto';
import { UpdateGuessDto } from './dto/update-guess.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Guess')
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @Post()
  @ApiOperation({ summary: 'Soumettre une tentative pour la photo du jour' })
  create(@Body() createGuessDto: CreateGuessDto) {
    return this.guessService.create(createGuessDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister toutes les sessions (admin/dev only)' })
  findAll() {
    return this.guessService.findAll();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Top 10 joueurs avec le plus de bonnes réponses' })
  getLeaderboard() {
    return this.guessService.getLeaderboard();
  }

  @Get('today/correct-count')
  @ApiOperation({ summary: 'Nombre de bonnes réponses aujourd’hui' })
  getTodayCorrectCount() {
    return this.guessService.countCorrectGuessesForToday();
  }

  @Get('today/status/:userId')
  @ApiOperation({ summary: 'Statut du joueur pour la photo du jour (restants, trouvé ?)' })
  getUserForToday(@Param('userId') userId: string) {
    return this.guessService.getUserForToday(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une session de guess par ID' })
  findOne(@Param('id') id: string) {
    return this.guessService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une session de guess (admin/dev)' })
  update(@Param('id') id: string, @Body() updateGuessDto: UpdateGuessDto) {
    return this.guessService.update(+id, updateGuessDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une session de guess' })
  remove(@Param('id') id: string) {
    return this.guessService.remove(+id);
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer toutes les sessions de guess (admin)' })
  removeAll() {
    return this.guessService.removeAll();
  }
}
