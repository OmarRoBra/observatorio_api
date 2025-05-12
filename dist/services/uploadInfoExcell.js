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
            var _a, _b, _c;
            const rawEconomicImpact = (_a = row['Derrama Económica']) === null || _a === void 0 ? void 0 : _a.toString().replace(/,/g, '');
            return {
                year: parseInt(row['Año']),
                bridgeName: (_b = row['Puente']) === null || _b === void 0 ? void 0 : _b.toString().trim(),
                municipality: (_c = row['Municipio']) === null || _c === void 0 ? void 0 : _c.toString().trim(),
                occupancyRate: parseFloat(row['% Ocupación']),
                roomOffer: parseInt(row['Oferta Cuartos']),
                occupiedRooms: parseInt(row['Cuartos Ocupados']),
                availableBeds: parseInt(row['Ctos. Disp.']),
                stay: parseFloat(row['Estadía']),
                density: parseFloat(row['Densidad']),
                nights: parseInt(row['Noches']),
                touristsPerNight: parseInt(row['Turistas Noche']),
                gpd: parseFloat(row['GPD']),
                economicImpact: parseInt(rawEconomicImpact),
                touristFlow: parseInt(row['Afluencia Turística']),
            };
        })
            .filter((row) => row.bridgeName); // Filtra filas incompletas
        yield HolidayStats_model_1.default.bulkCreate(formatted);
    });
}
