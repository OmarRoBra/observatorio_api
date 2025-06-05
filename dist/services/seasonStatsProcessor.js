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
exports.getSeasonStatsByYear = getSeasonStatsByYear;
exports.getSeasonStatsByMunicipalityAndSeason = getSeasonStatsByMunicipalityAndSeason;
exports.getSeasonStatsByMunicipality = getSeasonStatsByMunicipality;
exports.getSeasonStatsBySeason = getSeasonStatsBySeason;
exports.getAllSeasonStats = getAllSeasonStats;
exports.getSeasonStatsByYearAndMunicipality = getSeasonStatsByYearAndMunicipality;
exports.getSeasonStatsByYearAndSeason = getSeasonStatsByYearAndSeason;
exports.getSeasonStatsByYearSeasonAndMunicipality = getSeasonStatsByYearSeasonAndMunicipality;
exports.getSeasonStatsByYearAndMunicipalityAndSeason = getSeasonStatsByYearAndMunicipalityAndSeason;
exports.getSeasonStatsByMunicipalityAndYear = getSeasonStatsByMunicipalityAndYear;
exports.getSeasonStatsByMunicipalityAndSeasonAndYear = getSeasonStatsByMunicipalityAndSeasonAndYear;
exports.getSeasonStatsBySeasonAndYear = getSeasonStatsBySeasonAndYear;
exports.getSeasonStatsBySeasonAndMunicipality = getSeasonStatsBySeasonAndMunicipality;
exports.getSeasonStatsBySeasonAndMunicipalityAndYear = getSeasonStatsBySeasonAndMunicipalityAndYear;
exports.getSeasonStatsByYearAndMunicipalityAndSeasonAndSeason = getSeasonStatsByYearAndMunicipalityAndSeasonAndSeason;
exports.getSeasonStatsByYearAndMunicipalityAndSeasonAndMunicipality = getSeasonStatsByYearAndMunicipalityAndSeasonAndMunicipality;
const SeasonStats_model_1 = __importDefault(require("../models/SeasonStats.model"));
// Limpia cualquier número
function cleanNumber(val) {
    if (typeof val === "number")
        return val;
    if (typeof val === "string") {
        const cleaned = val.replace(/\./g, "").replace(",", ".");
        return Number(cleaned.replace(/[^0-9.-]/g, ""));
    }
    return 0;
}
// Limpia campos de dinero (usada en "Derrama Económica")
function cleanMoney(val) {
    if (typeof val === "string") {
        const cleaned = val.replace(/\./g, "").replace(",", ".");
        const number = Number(cleaned);
        return isNaN(number) ? 0 : number;
    }
    return val;
}
const fieldMap = {
    "Año": "year",
    "Temporada": "season",
    "Municipio": "municipality",
    "% Ocupación": "occupancyRate",
    "Oferta Cuartos": "roomOffer",
    "Cuartos Ocupados": "occupiedRooms",
    "Ctos. Disp.": "availableRooms",
    "Estadía": "stay",
    "Densidad": "density",
    "Turistas Noche": "touristsPerNight",
    "Gasto promedio por persona": "avgSpending",
    "Derrama Económica": "economicImpact",
    "Afluencia Turística": "touristFlow"
};
function insertSeasonStatsFromExcel(rows) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const row of rows) {
            const record = {};
            for (const [excelKey, modelKey] of Object.entries(fieldMap)) {
                if (modelKey === "economicImpact") {
                    // Solo para el campo de dinero, usa cleanMoney
                    record[modelKey] = cleanMoney(row[excelKey]);
                }
                else if ([
                    "year", "roomOffer", "availableRooms",
                    "occupancyRate", "occupiedRooms", "stay", "density", "touristsPerNight",
                    "avgSpending", "touristFlow"
                ].includes(modelKey)) {
                    record[modelKey] = cleanNumber(row[excelKey]);
                }
                else {
                    record[modelKey] = row[excelKey] || "";
                }
            }
            yield SeasonStats_model_1.default.upsert(record, {
                conflictFields: ['year', 'season', 'municipality']
            });
        }
    });
}
function getSeasonStatsByYear(year) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year },
            order: [['season', 'ASC'], ['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsByMunicipalityAndSeason(municipality, season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { municipality, season },
            order: [['year', 'ASC']]
        });
    });
}
function getSeasonStatsByMunicipality(municipality) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { municipality },
            order: [['year', 'ASC'], ['season', 'ASC']]
        });
    });
}
function getSeasonStatsBySeason(season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { season },
            order: [['year', 'ASC'], ['municipality', 'ASC']]
        });
    });
}
function getAllSeasonStats() {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            order: [['year', 'ASC'], ['season', 'ASC'], ['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsByYearAndMunicipality(year, municipality) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, municipality },
            order: [['season', 'ASC']]
        });
    });
}
function getSeasonStatsByYearAndSeason(year, season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, season },
            order: [['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsByYearSeasonAndMunicipality(year, season, municipality) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, season, municipality },
            order: [['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsByYearAndMunicipalityAndSeason(year, municipality, season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, municipality, season },
            order: [['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsByMunicipalityAndYear(municipality, year) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { municipality, year },
            order: [['season', 'ASC']]
        });
    });
}
function getSeasonStatsByMunicipalityAndSeasonAndYear(municipality, season, year) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { municipality, season, year },
            order: [['year', 'ASC']]
        });
    });
}
function getSeasonStatsBySeasonAndYear(season, year) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { season, year },
            order: [['municipality', 'ASC']]
        });
    });
}
function getSeasonStatsBySeasonAndMunicipality(season, municipality) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { season, municipality },
            order: [['year', 'ASC']]
        });
    });
}
function getSeasonStatsBySeasonAndMunicipalityAndYear(season, municipality, year) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { season, municipality, year },
            order: [['year', 'ASC']]
        });
    });
}
function getSeasonStatsByYearAndMunicipalityAndSeasonAndSeason(year, municipality, season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, municipality, season },
            order: [['season', 'ASC']]
        });
    });
}
function getSeasonStatsByYearAndMunicipalityAndSeasonAndMunicipality(year, municipality, season) {
    return __awaiter(this, void 0, void 0, function* () {
        return SeasonStats_model_1.default.findAll({
            where: { year, municipality, season },
            order: [['municipality', 'ASC']]
        });
    });
}
