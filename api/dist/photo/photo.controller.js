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
exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const photo_service_1 = require("./photo.service");
const create_photo_dto_1 = require("./dto/create-photo.dto");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let PhotoController = class PhotoController {
    photoService;
    constructor(photoService) {
        this.photoService = photoService;
    }
    async create(file, dto) {
        if (!file) {
            throw new common_1.BadRequestException('Aucune image fournie');
        }
        const photo = await this.photoService.create({
            ...dto,
            imageUrl: `/uploads/${file.filename}`,
        });
        return photo;
    }
    findAll() {
        return this.photoService.findAll();
    }
    generateTodayPhoto() {
        return this.photoService.generateTodayPhoto();
    }
    getTodayPhoto() {
        return this.photoService.findTodayPhoto();
    }
    regenerate() {
        return this.photoService.regenerateTodayPhoto();
    }
    async resetAllPhotos() {
        const affected = await this.photoService.resetAllPhotos();
        return {
            message: `✅ ${affected} photos ont été réinitialisées.`,
            affected
        };
    }
    deleteAllPhotos() {
        return this.photoService.deleteAllPhotos();
    }
};
exports.PhotoController = PhotoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${(0, path_1.extname)(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_photo_dto_1.CreatePhotoDto]),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les photos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhotoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('generate-today'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupére la photo du jour' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhotoController.prototype, "generateTodayPhoto", null);
__decorate([
    (0, common_1.Get)('today'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupére la photo du jour' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhotoController.prototype, "getTodayPhoto", null);
__decorate([
    (0, common_1.Post)('regenerate'),
    (0, swagger_1.ApiOperation)({ summary: 'Regénère une nouvelle photo pour le moment actuel (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhotoController.prototype, "regenerate", null);
__decorate([
    (0, common_1.Post)('reset-dates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "resetAllPhotos", null);
__decorate([
    (0, common_1.Delete)('delete-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer toutes les photos' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PhotoController.prototype, "deleteAllPhotos", null);
exports.PhotoController = PhotoController = __decorate([
    (0, swagger_1.ApiTags)('Photos'),
    (0, common_1.Controller)('photo'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], PhotoController);
//# sourceMappingURL=photo.controller.js.map