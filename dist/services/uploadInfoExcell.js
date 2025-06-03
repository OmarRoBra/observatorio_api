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
function insertHolidayStatsFromExcel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatted = data
            .map((row) => {
            var _a;
            const rawEconomicImpact = (_a = row['Derrama Económica']) === null || _a === void 0 ? void 0 : _a.toString().replace(/,/g, '');
            return {
                year: parseNumber(row['Año']),
                bridgeName: row['Fin de semana largo'] || '',
                municipality: row['Municipio'] || '',
                occupancyRate: parseFloat(row['Tasa de ocupación']) || 0,
                roomOffer: parseNumber(row['Oferta cuartos']),
                occupiedRooms: parseNumber(row['Cuartos ocupados']),
                availableBeds: parseNumber(row['Cuartos disponibles']),
                stay: parseFloat(row['Estadía promedio']) || 0,
                density: parseFloat(row['Densidad de ocupación']) || 0,
                nights: parseNumber(row['Noches']),
                touristsPerNight: parseNumber(row['Turistas noche']),
                gpd: parseFloat(row['Gasto promedio diario']) || 0,
                economicImpact: parseNumber(row['Derrama económica']),
                touristFlow: parseNumber(row['Afluencia turística']),
                month: row['Mes'] || '',
            };
        })
            .filter((row) => row.bridgeName); // Filtra filas incompletas
        yield HolidayStats_model_1.default.bulkCreate(formatted);
    });
}
function parseNumber(value) {
    if (typeof value === 'number')
        return value;
    if (typeof value === 'string') {
        // Remove commas and whitespace, then parse
        const cleaned = value.replace(/,/g, '').trim();
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}
