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
const photo_entity_1 = require("./entities/photo.entity");
const typeorm_2 = require("typeorm");
const schedule_1 = require("@nestjs/schedule");
const date_1 = require("../utils/date");
const guess_entity_1 = require("../guess/entities/guess.entity");
let PhotoService = PhotoService_1 = class PhotoService {
    photoRepository;
    guessRepository;
    logger = new common_1.Logger(PhotoService_1.name);
    constructor(photoRepository, guessRepository) {
        this.photoRepository = photoRepository;
        this.guessRepository = guessRepository;
    }
    async create(createPhotoDto) {
        const photo = this.photoRepository.create(createPhotoDto);
        const saved = await this.photoRepository.save(photo);
        this.logger.log(`🆕 Photo créée : ${saved.imageUrl} (solution: ${saved.solution})`);
        return saved;
    }
    findAll() {
        return this.photoRepository.find();
    }
    remove(id) {
        return this.photoRepository.delete(id);
    }
    async findRandomWithoutDate() {
        const photos = await this.photoRepository.find({
            where: { date: (0, typeorm_2.IsNull)(), period: (0, typeorm_2.IsNull)() },
        });
        if (photos.length === 0)
            return null;
        const randomIndex = Math.floor(Math.random() * photos.length);
        return photos[randomIndex];
    }
    async generateTodayPhoto() {
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        this.logger.log(`Tentative de génération de la photo du jour [${date} - ${period}]`);
        const existing = await this.photoRepository.findOne({ where: { date, period } });
        if (existing) {
            this.logger.log(`Photo déjà existante pour aujourd'hui : ${existing.imageUrl}`);
            return existing;
        }
        const random = await this.findRandomWithoutDate();
        if (!random) {
            this.logger.warn('Aucune photo disponible sans date pour générer la photo du jour');
            return null;
        }
        random.date = date;
        random.period = period;
        const saved = await this.photoRepository.save(random);
        this.logger.log(`✅ Photo du jour générée : ${saved.imageUrl} (solution: ${saved.solution})`);
        return saved;
    }
    async regenerateTodayPhoto() {
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        const current = await this.photoRepository.findOne({ where: { date, period } });
        if (current) {
            current.date = null;
            current.period = null;
            await this.photoRepository.save(current);
        }
        await this.guessRepository.delete({ date, period });
        return this.generateTodayPhoto();
    }
    async findTodayPhoto() {
        const date = (0, date_1.getTodayDate)();
        const period = (0, date_1.getCurrentPeriod)();
        return this.photoRepository.findOne({ where: { date, period } });
    }
    async handlePhotoGeneration() {
        this.logger.debug('⏰ Déclenchement automatique du cron de génération de photo');
        await this.generateTodayPhoto();
    }
    async resetAllPhotos() {
        const result = await this.photoRepository
            .createQueryBuilder()
            .update()
            .set({ date: null, period: null })
            .execute();
        return result.affected || 0;
    }
    async deleteAllPhotos() {
        const result = await this.photoRepository.delete({});
        return result.affected || 0;
    }
};
exports.PhotoService = PhotoService;
__decorate([
    (0, schedule_1.Cron)('*/10 * * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotoService.prototype, "handlePhotoGeneration", null);
exports.PhotoService = PhotoService = PhotoService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(photo_entity_1.Photo)),
    __param(1, (0, typeorm_1.InjectRepository)(guess_entity_1.Guess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PhotoService);
//# sourceMappingURL=photo.service.js.map