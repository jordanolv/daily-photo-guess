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
exports.GuessController = void 0;
const common_1 = require("@nestjs/common");
const guess_service_1 = require("./guess.service");
const create_guess_dto_1 = require("./dto/create-guess.dto");
const update_guess_dto_1 = require("./dto/update-guess.dto");
const swagger_1 = require("@nestjs/swagger");
let GuessController = class GuessController {
    guessService;
    constructor(guessService) {
        this.guessService = guessService;
    }
    create(createGuessDto) {
        return this.guessService.create(createGuessDto);
    }
    findAll() {
        return this.guessService.findAll();
    }
    getLeaderboard() {
        return this.guessService.getLeaderboard();
    }
    getTodayCorrectCount() {
        return this.guessService.countCorrectGuessesForToday();
    }
    getUserForToday(userId) {
        return this.guessService.getUserForToday(userId);
    }
    findOne(id) {
        return this.guessService.findOne(+id);
    }
    update(id, updateGuessDto) {
        return this.guessService.update(+id, updateGuessDto);
    }
    remove(id) {
        return this.guessService.remove(+id);
    }
    removeAll() {
        return this.guessService.removeAll();
    }
};
exports.GuessController = GuessController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Soumettre une tentative pour la photo du jour' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_guess_dto_1.CreateGuessDto]),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lister toutes les sessions (admin/dev only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Top 10 joueurs avec le plus de bonnes réponses' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Get)('today/correct-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Nombre de bonnes réponses aujourd’hui' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "getTodayCorrectCount", null);
__decorate([
    (0, common_1.Get)('today/status/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Statut du joueur pour la photo du jour (restants, trouvé ?)' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "getUserForToday", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une session de guess par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une session de guess (admin/dev)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_guess_dto_1.UpdateGuessDto]),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une session de guess' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer toutes les sessions de guess (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GuessController.prototype, "removeAll", null);
exports.GuessController = GuessController = __decorate([
    (0, swagger_1.ApiTags)('Guess'),
    (0, common_1.Controller)('guess'),
    __metadata("design:paramtypes", [guess_service_1.GuessService])
], GuessController);
//# sourceMappingURL=guess.controller.js.map