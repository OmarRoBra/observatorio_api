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
// Limpia campos de dinero (para "Derrama económica")
function cleanMoney(val) {
    if (typeof val !== 'string') {
        const n = Number(val);
        return isNaN(n) ? 0 : n;
    }
    let v = val.replace(/\s/g, '');
    // Elimina separadores de miles (coma o punto) si van seguidos de 3 dígitos
    v = v.replace(/(\d)[.,](?=\d{3}\b)/g, '$1');
    // Convierte coma decimal a punto
    v = v.replace(/,(\d{1,2})$/, '.$1');
    const num = Number(v);
    return isNaN(num) ? 0 : num;
}
// Campos numéricos a procesar
const numericFields = [
    'year', 'occupancy_rate', 'room_offer', 'occupied_rooms', 'available_rooms',
    'average_stay', 'occupancy_density', 'nights', 'tourists_per_night',
    'daily_avg_spending', 'tourist_flow'
];
// Mapeo de columnas Excel a modelo
const fieldMap = {
    'Año': 'year',
    'Fin de semana largo': 'bridge_name',
    'Municipio': 'municipality',
    'Tasa de ocupación': 'occupancy_rate',
    'Oferta cuartos': 'room_offer',
    'Cuartos ocupados': 'occupied_rooms',
    'Cuartos disponibles': 'available_rooms',
    'Estadía promedio': 'average_stay',
    'Densidad de ocupación': 'occupancy_density',
    'Noches': 'nights',
    'Turistas noche': 'tourists_per_night',
    'Gasto promedio diario': 'daily_avg_spending',
    'Derrama económica': 'economic_impact',
    'Afluencia turística': 'tourist_flow'
};
function insertHolidayStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        const upsertPromises = [];
        for (const [idx, row] of rows.entries()) {
            const record = {};
            // Mapear y limpiar valores
            for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
                const val = row[excelKey];
                if (modelKey === 'economic_impact') {
                    record[modelKey] = cleanMoney(val);
                }
                else if (numericFields.includes(modelKey)) {
                    record[modelKey] = Number(val) || 0;
                }
                else {
                    // asume tipo string
                    record[modelKey] = val != null ? String(val).trim() : '';
                }
            }
            // Validación de campos clave
            if (!record.year || !record.bridge_name || !record.municipality) {
                console.warn(`Fila ${idx + 1} omitida: falta year, bridge_name o municipality.`, row);
                continue;
            }
            // Realizar upsert con manejo de errores por fila
            upsertPromises.push(HolidayStats_model_1.default.upsert(record, {
                conflictFields: ['year', 'bridge_name', 'municipality']
            }).catch(err => {
                console.error(`Error upserting fila ${idx + 1}:`, record, err);
            }));
        }
        // Esperar todas las promesas
        yield Promise.all(upsertPromises);
        console.log(`Procesadas ${upsertPromises.length} filas de ${rows.length} (omitidas ${rows.length - upsertPromises.length}).`);
    });
}
