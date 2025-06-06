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
// Limpia número, soporta miles y decimales
function cleanNumber(val) {
    if (typeof val === "number")
        return val;
    if (typeof val === "string") {
        const cleaned = val.replace(/\./g, '').replace(',', '.');
        return Number(cleaned.replace(/[^0-9.-]/g, ""));
    }
    return 0;
}
function insertHolidayStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            yield HolidayStats_model_1.default.create({
                year: Number(row['Año']),
                bridgeName: row['Fin de semana largo'] || "",
                municipality: row['Municipio'] || "",
                occupancyRate: cleanNumber(row['Tasa de ocupación']),
                roomOffer: cleanNumber(row['Oferta cuartos']),
                occupiedRooms: cleanNumber(row['Cuartos ocupados']),
                availableRooms: cleanNumber(row['Cuartos disponibles']),
                averageStay: cleanNumber(row['Estadía promedio']),
                occupancyDensity: cleanNumber(row['Densidad de ocupación']),
                nights: cleanNumber(row['Noches']),
                touristsPerNight: cleanNumber(row['Turistas noche']),
                dailyAvgSpending: cleanNumber(row['GPD']),
                economicImpact: cleanNumber(row['Derrama económica']),
                touristFlow: cleanNumber(row['Afluencia turística']),
            });
        }
    });
}
// Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
//   month: row['Mes'] || "", // Si tu Excel tiene columna 'Mes', si no ponle un valor por defecto
