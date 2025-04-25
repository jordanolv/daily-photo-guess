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
const guess_entity_1 = require("./entities/guess.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const photo_service_1 = require("../photo/photo.service");
let GuessService = class GuessService {
    guessRepository;
    photoService;
    constructor(guessRepository, photoService) {
        this.guessRepository = guessRepository;
        this.photoService = photoService;
    }
    async create(createGuessDto) {
        const { userId, attempt } = createGuessDto;
        const photo = await this.photoService.findTodayPhoto();
        if (!photo) {
            throw new common_1.NotFoundException('Photo du jour introuvable');
        }
        const existingCorrect = await this.guessRepository.findOne({
            where: { userId, isCorrect: true, photo: { id: photo.id } },
            relations: ['photo']
        });
        if (existingCorrect) {
            return {
                status: 'correct',
                guess: existingCorrect,
                remainingAttempts: 0,
                alreadyFound: true,
            };
        }
        const attemptCount = await this.guessRepository.count({
            where: { userId, photo: { id: photo.id } },
            relations: ['photo']
        });
        if (attemptCount >= 3) {
            throw new common_1.BadRequestException('Tu as déjà utilisé tes 3 essais pour cette photo 😬');
        }
        const isCorrect = photo.solution.trim().toLowerCase() === attempt.trim().toLowerCase();
        const guess = this.guessRepository.create({
            userId,
            attempt,
            isCorrect,
            photo,
        });
        const savedGuess = await this.guessRepository.save(guess);
        return {
            status: isCorrect ? 'correct' : 'wrong',
            guess: savedGuess,
            remainingAttempts: 2 - attemptCount,
            alreadyFound: isCorrect,
        };
    }
    findAll() {
        return this.guessRepository.find({
            relations: ['photo'],
        });
    }
    async findOne(id) {
        const guess = await this.guessRepository.findOne({
            where: { id },
            relations: ['photo'],
        });
        if (!guess) {
            throw new common_1.NotFoundException(`Guess with ID ${id} not found`);
        }
        return guess;
    }
    update(id, updateGuessDto) {
        return `This action updates a #${id} guess`;
    }
    remove(id) {
        return `This action removes a #${id} guess`;
    }
    removeAll() {
        return this.guessRepository.delete({});
    }
    async getLeaderboard() {
        return this.guessRepository
            .createQueryBuilder('guess')
            .select('guess.userId', 'userId')
            .addSelect('COUNT(*)', 'total')
            .where('guess.isCorrect = :isCorrect', { isCorrect: true })
            .groupBy('guess.userId')
            .orderBy('total', 'DESC')
            .limit(10)
            .getRawMany();
    }
    async countCorrectGuessesForToday() {
        const photo = await this.photoService.findTodayPhoto();
        if (!photo)
            return 0;
        return this.guessRepository.count({
            where: {
                photo: { id: photo.id },
                isCorrect: true,
            },
            relations: ['photo'],
        });
    }
};
exports.GuessService = GuessService;
exports.GuessService = GuessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(guess_entity_1.Guess)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        photo_service_1.PhotoService])
], GuessService);
//# sourceMappingURL=guess.service.js.map