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
exports.getHolidayStats = getHolidayStats;
exports.getHolidayStatsById = getHolidayStatsById;
const HolidayStats_model_1 = __importDefault(require("../models/HolidayStats.model"));
// Limpia números: quita comas y convierte a número JS
function cleanNumber(val) {
    if (typeof val === "number")
        return val;
    if (typeof val === "string") {
        // quita todos los espacios y comas, luego convierte a número
        let cleaned = val.trim().replace(/\s/g, '').replace(/,/g, '');
        return Number(cleaned.replace(/[^0-9.-]/g, ""));
    }
    return null;
}
function insertHolidayStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            try {
                yield HolidayStats_model_1.default.create({
                    year: Number(row['Año']),
                    bridge_name: row['Fin de semana largo'] || "",
                    municipality: row['Municipio'] || "",
                    occupancy_rate: cleanNumber(row['Tasa de ocupación']),
                    room_offer: cleanNumber(row['Oferta cuartos']),
                    occupied_rooms: cleanNumber(row['Cuartos ocupados']),
                    available_rooms: cleanNumber(row['Cuartos disponibles']),
                    average_stay: cleanNumber(row['Estadía promedio']),
                    occupancy_density: cleanNumber(row['Densidad de ocupación']),
                    nights: cleanNumber(row['Noches']),
                    tourists_per_night: cleanNumber(row['Turistas noche']),
                    daily_avg_spending: cleanNumber(row['GPD']),
                    economic_impact: cleanNumber(row['Derrama económica']),
                    tourist_flow: cleanNumber(row['Afluencia turística']),
                });
            }
            catch (e) {
                console.error("❌ Error insertando fila:", e, row);
            }
        }
    });
}
function getHolidayStats(where) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield HolidayStats_model_1.default.findAll({ where });
        }
        catch (err) {
            console.error('🔴 Error fetching holiday stats:', err);
            if (err instanceof Error) {
                console.error('Message:', err.message);
                const anyErr = err;
                if (anyErr.parent) {
                    console.error('Parent detail:', anyErr.parent.detail || anyErr.parent);
                    console.error('Parent sql:', anyErr.parent.sql);
                }
            }
            throw new Error('Error fetching holiday stats');
        }
    });
}
function getHolidayStatsById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield HolidayStats_model_1.default.findByPk(id);
        }
        catch (err) {
            console.error('🔴 Error fetching holiday stats by ID:', err);
            if (err instanceof Error) {
                console.error('Message:', err.message);
                const anyErr = err;
                if (anyErr.parent) {
                    console.error('Parent detail:', anyErr.parent.detail || anyErr.parent);
                    console.error('Parent sql:', anyErr.parent.sql);
                }
            }
            throw new Error('Error fetching holiday stats by ID');
        }
    });
}
