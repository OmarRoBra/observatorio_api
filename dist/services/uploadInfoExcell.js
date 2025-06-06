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
exports.insertHolidayStatsFromExcel = insertHolidayStatsFromExcel;
const HolidayStats_model_1 = __importDefault(require("../models/HolidayStats.model"));
function insertHolidayStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            try {
                yield HolidayStats_model_1.default.create({
                    year: Number(row['Año']),
                    bridge_name: row['Fin de semana largo'] || "",
                    municipality: row['Municipio'] || "",
                    occupancy_rate: Number(row['Tasa de ocupación']),
                    room_offer: Number(row['Oferta cuartos']),
                    occupied_rooms: Number(row['Cuartos ocupados']),
                    available_rooms: Number(row['Cuartos disponibles']),
                    average_stay: Number(row['Estadía promedio']),
                    occupancy_density: Number(row['Densidad de ocupación']),
                    nights: Number(row['Noches']),
                    tourists_per_night: Number(row['Turistas noche']),
                    daily_avg_spending: Number(row['Gasto promedio diario']),
                    economic_impact: Number(row['Derrama económica']),
                    tourist_flow: Number(row['Afluencia turística']),
                });
            }
            catch (e) {
                console.error("❌ Error insertando fila:", e, row);
            }
        }
    });
}
