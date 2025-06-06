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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
let HolidayStats = class HolidayStats extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "year", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'bridge_name', type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], HolidayStats.prototype, "bridge_name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], HolidayStats.prototype, "municipality", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'occupancy_rate', type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "occupancy_rate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'room_offer', type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "room_offer", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'occupied_rooms', type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "occupied_rooms", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'available_rooms', type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "available_rooms", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'average_stay', type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "average_stay", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'occupancy_density', type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "occupancy_density", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "nights", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'tourists_per_night', type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "tourists_per_night", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'daily_avg_spending', type: sequelize_typescript_1.DataType.FLOAT }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "daily_avg_spending", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'economic_impact', type: sequelize_typescript_1.DataType.BIGINT }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "economic_impact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ field: 'tourist_flow', type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], HolidayStats.prototype, "tourist_flow", void 0);
HolidayStats = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: 'holiday_stats', timestamps: true })
], HolidayStats);
exports.default = HolidayStats;
