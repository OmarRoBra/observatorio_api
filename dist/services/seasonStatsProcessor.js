"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSeasonStatsFromExcel = insertSeasonStatsFromExcel;
const SeasonStats_model_1 = __importDefault(require("../models/SeasonStats.model"));
function cleanMoney(val) {
    if (typeof val === 'string')
        return Number(val.replace(/[^0-9.]+/g, ''));
    return val;
}
function insertSeasonStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            yield SeasonStats_model_1.default.upsert({
                year: Number(row['Año']),
                season: row['Temporada'],
                municipality: row['Municipio'],
                occupancyRate: Number(row['% Ocupación']),
                roomOffer: Number(row['Oferta Cuartos']),
                occupiedRooms: Number(row['Cuartos Ocupados']),
                availableRooms: Number(row['Ctos. Disp.']),
                stay: Number(row['Estadía']),
                density: Number(row['Densidad']),
                touristsPerNight: Number(row['Turistas Noche']),
                avgSpending: Number(row['Gasto promedio por persona']),
                economicImpact: cleanMoney(row['Derrama Económica']),
                touristFlow: Number(row['Afluencia Turística']),
            }, {
                conflictFields: ['year', 'season', 'municipality']
            });
        }
    });
}
