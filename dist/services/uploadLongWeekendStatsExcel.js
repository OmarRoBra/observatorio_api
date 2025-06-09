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
// services/longWeekendStats.service.ts
const LongWeekendStats_model_1 = __importDefault(require("../models/LongWeekendStats.model"));
const cleaners_1 = require("../utils/cleaners");
function insertLongWeekendStatsFromExcel(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const formatted = data
            .map((row, idx) => {
            var _a, _b;
            const year = (0, cleaners_1.cleanNumber)(row['Año']);
            const bridge_name = ((_a = row['Fin de semana largo']) === null || _a === void 0 ? void 0 : _a.toString().trim()) || '';
            const municipality = ((_b = row['Municipio']) === null || _b === void 0 ? void 0 : _b.toString().trim()) || '';
            if (!year || !bridge_name || !municipality) {
                console.warn(`Fila ${idx + 1} omitida (campos clave faltan).`);
                return null;
            }
            return {
                year,
                bridge_name,
                municipality,
                occupancy_rate: (0, cleaners_1.cleanNumber)(row['Tasa de ocupación']),
                room_offer: (0, cleaners_1.cleanNumber)(row['Oferta cuartos']),
                occupied_rooms: (0, cleaners_1.cleanNumber)(row['Cuartos ocupados']),
                available_rooms: (0, cleaners_1.cleanNumber)(row['Cuartos disponibles']),
                average_stay: (0, cleaners_1.cleanNumber)(row['Estadía promedio']),
                occupancy_density: (0, cleaners_1.cleanNumber)(row['Densidad de ocupación']),
                nights: (0, cleaners_1.cleanNumber)(row['Noches']),
                tourists_per_night: (0, cleaners_1.cleanNumber)(row['Turistas noche']),
                daily_avg_spending: (0, cleaners_1.cleanNumber)(row['Gasto promedio diario']),
                economic_impact: (0, cleaners_1.cleanNumber)(row['Derrama económica']),
                tourist_flow: (0, cleaners_1.cleanNumber)(row['Afluencia turística']),
            };
        })
            .filter((r) => r !== null);
        console.log(`Total válido: ${formatted.length} filas.`);
        try {
            yield LongWeekendStats_model_1.default.bulkCreate(formatted, {
                updateOnDuplicate: [
                    'occupancy_rate',
                    'room_offer',
                    'occupied_rooms',
                    'available_rooms',
                    'average_stay',
                    'occupancy_density',
                    'nights',
                    'tourists_per_night',
                    'daily_avg_spending',
                    'economic_impact',
                    'tourist_flow'
                ]
            });
            console.log('Insert/update batch completado con éxito.');
        }
        catch (e) {
            console.error('Error al bulkCreate/upsert:', e);
            throw e;
        }
    });
}
