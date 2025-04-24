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
const guess_entity_1 = require("./guess.entity");
const photo_service_1 = require("../photo/photo.service");
let GuessService = class GuessService {
    repo;
    photoService;
    constructor(repo, photoService) {
        this.repo = repo;
        this.photoService = photoService;
    }
    async submit(userId, date, guess) {
        const photo = await this.photoService.getToday();
        if (!photo || photo.date !== date) {
            throw new common_1.BadRequestException('Aucune photo pour cette date');
        }
        const hasWon = await this.repo.findOne({
            where: { userId, date, correct: true }
        });
        if (hasWon) {
            throw new common_1.BadRequestException('Vous avez déjà trouvé cette photo');
        }
        const prior = await this.repo.count({ where: { userId, date } });
        if (prior >= 3) {
            throw new common_1.BadRequestException('Plus d\'essais restants');
        }
        const correct = guess.trim().toLowerCase() === photo.solution.toLowerCase();
        const entry = this.repo.create({
            userId, date, guess, correct,
            timestamp: Date.now(),
        });
        await this.repo.save(entry);
        return {
            correct,
            remainingTries: 3 - (prior + 1),
        };
    }
    async getLeaderboard(date) {
        const result = await this.repo
            .createQueryBuilder('g')
            .select('g.userId', 'userId')
            .addSelect('COUNT(*)', 'totalCorrect')
            .where('g.correct = :correct', { correct: true })
            .groupBy('g.userId')
            .orderBy('totalCorrect', 'DESC')
            .getRawMany();
        console.log('Leaderboard result:', result);
        return result;
    }
    async getTotalCorrectGuesses(date) {
        return this.repo.count({
            where: { date, correct: true }
        });
    }
    async deleteGuessesForDate(date) {
        await this.repo.delete({ date });
    }
    async deleteAllGuesses() {
        await this.repo.clear();
    }
};
exports.GuessService = GuessService;
exports.GuessService = GuessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guess_entity_1.Guess)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => photo_service_1.PhotoService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        photo_service_1.PhotoService])
], GuessService);
//# sourceMappingURL=guess.service.js.map