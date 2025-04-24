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
var PhotoService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const photo_entity_1 = require("./photo.entity");
const guess_service_1 = require("../guess/guess.service");
let PhotoService = PhotoService_1 = class PhotoService {
    repo;
    guessService;
    logger = new common_1.Logger(PhotoService_1.name);
    constructor(repo, guessService) {
        this.repo = repo;
        this.guessService = guessService;
    }
    async generateDailyPhoto() {
        const date = new Date().toISOString().slice(0, 10);
        const existingPhoto = await this.repo.findOneBy({ date });
        if (existingPhoto) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await this.repo.update(existingPhoto.id, { date: yesterday.toISOString().slice(0, 10) });
        }
        await this.guessService.deleteGuessesForDate(date);
        const unusedPhoto = await this.repo.findOne({
            where: { date: (0, typeorm_2.IsNull)() },
            order: { id: 'ASC' }
        });
        if (!unusedPhoto) {
            this.logger.error('No unused photos available');
            return;
        }
        await this.repo.update(unusedPhoto.id, { date });
        this.logger.log(`Assigned photo for ${date}`);
    }
    async getToday() {
        const date = new Date().toISOString().slice(0, 10);
        const photo = await this.repo.findOneBy({ date });
        if (!photo)
            throw new Error(`No photo found for date ${date}`);
        return photo;
    }
    async addPhoto(imageUrl, solution) {
        return this.repo.save({ imageUrl, solution });
    }
    async listUnusedPhotos() {
        return this.repo.find({
            where: { date: (0, typeorm_2.IsNull)() },
            order: { id: 'ASC' }
        });
    }
    async listAllPhotos() {
        return this.repo.find({
            order: { id: 'ASC' }
        });
    }
    async deletePhoto(id) {
        const photo = await this.repo.findOneBy({ id });
        if (!photo)
            return;
        if (photo.date === new Date().toISOString().slice(0, 10)) {
            await this.guessService.deleteGuessesForDate(photo.date);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            await this.repo.update(id, { date: yesterday.toISOString().slice(0, 10) });
            await this.generateDailyPhoto();
        }
        else {
            await this.repo.delete(id);
        }
    }
    async resetAllPhotos() {
        const today = new Date().toISOString().slice(0, 10);
        await this.guessService.deleteGuessesForDate(today);
        await this.repo.query('UPDATE photo SET date = NULL');
        await this.generateDailyPhoto();
    }
};
exports.PhotoService = PhotoService;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotoService.prototype, "generateDailyPhoto", null);
exports.PhotoService = PhotoService = PhotoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => guess_service_1.GuessService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        guess_service_1.GuessService])
], PhotoService);
//# sourceMappingURL=photo.service.js.map