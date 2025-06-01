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
exports.insertMonthlyStatsFromExcel = insertMonthlyStatsFromExcel;
const MonthlyStats_model_1 = __importDefault(require("../models/MonthlyStats.model"));
function cleanMoney(val) {
    if (typeof val === 'string')
        return Number(val.replace(/[^0-9.]+/g, ''));
    return val;
}
function insertMonthlyStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            yield MonthlyStats_model_1.default.upsert({
                year: Number(row['Año']),
                month: row['Mes'],
                municipality: row['Municipio'],
                occupancyRate: Number(row['Ocupación %']),
                touristFlow: Number(row['Afluencia Turística']),
                economicImpact: cleanMoney(row['Derrama Económica']),
            }, {
                conflictFields: ['year', 'month', 'municipality']
            });
        }
    });
}
