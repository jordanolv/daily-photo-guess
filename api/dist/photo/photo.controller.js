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
exports.AdminController = exports.PhotoController = void 0;
const common_1 = require("@nestjs/common");
const photo_service_1 = require("./photo.service");
let PhotoController = class PhotoController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    async today() {
        const photo = await this.svc.getToday();
        return {
            date: photo.date,
            imageUrl: photo.imageUrl,
            maxTries: 3,
        };
    }
};
exports.PhotoController = PhotoController;
__decorate([
    (0, common_1.Get)('today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotoController.prototype, "today", null);
exports.PhotoController = PhotoController = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], PhotoController);
let AdminController = class AdminController {
    photoSvc;
    constructor(photoSvc) {
        this.photoSvc = photoSvc;
    }
    async getTodayAdmin() {
        return this.photoSvc.getToday();
    }
    async gen() {
        await this.photoSvc.generateDailyPhoto();
        return { ok: true };
    }
    async reset() {
        await this.photoSvc.resetAllPhotos();
        return { ok: true };
    }
    async addPhoto(data) {
        const photo = await this.photoSvc.addPhoto(data.imageUrl, data.solution);
        return photo;
    }
    async listAllPhotos() {
        return this.photoSvc.listAllPhotos();
    }
    async listUnusedPhotos() {
        return this.photoSvc.listUnusedPhotos();
    }
    async deletePhoto(id) {
        await this.photoSvc.deletePhoto(parseInt(id));
        return { ok: true };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('today'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTodayAdmin", null);
__decorate([
    (0, common_1.Post)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "gen", null);
__decorate([
    (0, common_1.Post)('reset'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "reset", null);
__decorate([
    (0, common_1.Post)('photos'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Get)('photos'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listAllPhotos", null);
__decorate([
    (0, common_1.Get)('photos/unused'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "listUnusedPhotos", null);
__decorate([
    (0, common_1.Delete)('photos/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deletePhoto", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], AdminController);
//# sourceMappingURL=photo.controller.js.map