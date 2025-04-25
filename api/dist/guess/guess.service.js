"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const guess_entity_1 = require("./entities/guess.entity");
const photo_service_1 = require("../photo/photo.service");
const date_1 = require("../utils/date");
let GuessService = class GuessService {
    guessRepository;
    photoService;
    constructor(guessRepository, photoService) {
        this.guessRepository = guessRepository;
        this.photoService = photoService;
    }
    async create(createGuessDto) {
        const { userId, attempt } = createGuessDto;
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        const photo = await this.photoService.findTodayPhoto();
        if (!photo) {
            throw new common_1.NotFoundException('Photo du jour introuvable');
        }
        let guess = await this.guessRepository.findOne({ where: { userId, date, period } });
        if (guess?.found) {
            return {
                status: 'correct',
                guess,
                remainingAttempts: 0,
                alreadyFound: true,
            };
        }
        if (!guess) {
            guess = this.guessRepository.create({
                userId,
                date,
                period,
                attemptCount: 0,
                found: false,
            });
        }
        if (guess.attemptCount >= 3) {
            throw new common_1.BadRequestException('Tu as déjà utilisé tes 3 essais pour cette période 😬');
        }
        guess.attemptCount++;
        const isCorrect = photo.solution.trim().toLowerCase() === attempt.trim().toLowerCase();
        if (isCorrect) {
            guess.found = true;
        }
        const saved = await this.guessRepository.save(guess);
        return {
            status: isCorrect ? 'correct' : 'wrong',
            guess: saved,
            remainingAttempts: Math.max(0, 3 - saved.attemptCount),
            alreadyFound: saved.found,
        };
    }
    async findAll() {
        return this.guessRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const guess = await this.guessRepository.findOne({ where: { id } });
        if (!guess) {
            throw new common_1.NotFoundException(`Session de jeu #${id} introuvable`);
        }
        return guess;
    }
    async update(id, updateGuessDto) {
        const guess = await this.findOne(id);
        Object.assign(guess, updateGuessDto);
        return this.guessRepository.save(guess);
    }
    async remove(id) {
        await this.guessRepository.delete(id);
    }
    async removeAll() {
        await this.guessRepository.clear();
    }
    async getUserForToday(userId) {
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        const guess = await this.guessRepository.findOne({ where: { userId, date, period } });
        return {
            remainingAttempts: guess ? Math.max(0, 3 - guess.attemptCount) : 3,
            alreadyFound: guess?.found || false,
        };
    }
    async countCorrectGuessesForToday() {
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        return this.guessRepository.count({
            where: { date, period, found: true },
        });
    }
    async getLeaderboard() {
        return this.guessRepository
            .createQueryBuilder('guess')
            .select('guess.userId', 'userId')
            .addSelect('COUNT(*)', 'total')
            .where('guess.found = true')
            .groupBy('guess.userId')
            .orderBy('total', 'DESC')
            .limit(10)
            .getRawMany();
    }
};
exports.GuessService = GuessService;
exports.GuessService = GuessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guess_entity_1.Guess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        photo_service_1.PhotoService])
], GuessService);
//# sourceMappingURL=guess.service.js.map