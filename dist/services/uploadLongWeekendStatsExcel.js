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
exports.insertLongWeekendStatsFromExcel = insertLongWeekendStatsFromExcel;
const LongWeekendStats_model_1 = __importDefault(require("../models/LongWeekendStats.model"));
function insertLongWeekendStatsFromExcel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatted = data.map((row) => {
            var _a, _b, _c;
            return ({
                year: parseInt(row['Año']),
                bridge_name: (_a = row['Puente']) === null || _a === void 0 ? void 0 : _a.toString().trim(),
                municipality: (_b = row['Municipio']) === null || _b === void 0 ? void 0 : _b.toString().trim(),
                occupancy_rate: parseFloat(row['% Ocupación']),
                room_offer: parseInt(row['Oferta Cuartos']),
                occupied_rooms: parseInt(row['Cuartos Ocupados']),
                available_rooms: parseInt(row['Cuartos Disponibles']),
                average_stay: parseFloat(row['Estadía Promedio']),
                occupancy_density: parseFloat(row['Densidad de Ocupación']),
                nights: parseInt(row['Noches']),
                tourists_per_night: parseInt(row['Turistas por Noche']),
                daily_avg_spending: parseFloat(row['Gasto Diario Promedio']),
                economic_impact: parseInt((_c = row['Derrama Económica']) === null || _c === void 0 ? void 0 : _c.toString().replace(/,/g, '')),
                tourist_flow: parseInt(row['Afluencia Turística']),
            });
        }).filter((row) => row.bridge_name);
        yield LongWeekendStats_model_1.default.bulkCreate(formatted);
    });
}
