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
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const excelReader_1 = require("../utils/excelReader");
const LongWeekendStats_model_1 = __importDefault(require("../models/LongWeekendStats.model"));
const uploadLongWeekendStatsExcel_1 = require("../services/uploadLongWeekendStatsExcel");
const sequelize_1 = require("sequelize");
const router = (0, express_1.Router)();
// Subir Excel
router.post('/upload-excel', upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Archivo requerido.' });
            return;
        }
        const data = (0, excelReader_1.readExcelFromBuffer)(req.file.buffer);
        yield (0, uploadLongWeekendStatsExcel_1.insertLongWeekendStatsFromExcel)(data);
        res.status(200).json({ message: 'Archivo procesado correctamente.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el archivo.' });
    }
}));
// GET con filtros (año, municipio, puente, etc.)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, municipality, bridge_name } = req.query;
        const where = {};
        if (year)
            where.year = Number(year);
        if (municipality)
            where.municipality = { [sequelize_1.Op.iLike]: `%${municipality}%` };
        if (bridge_name)
            where.bridge_name = { [sequelize_1.Op.iLike]: `%${bridge_name}%` };
        const results = yield LongWeekendStats_model_1.default.findAll({ where });
        res.json(results);
    }
    catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Error fetching long weekend stats' });
    }
}));
// Insertar registro individual
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, bridge_name, municipality, occupancy_rate, room_offer, occupied_rooms, available_rooms, average_stay, occupancy_density, nights, tourists_per_night, daily_avg_spending, economic_impact, tourist_flow } = req.body;
        if (!year || !bridge_name || !municipality) {
            res.status(400).json({ error: 'Año, puente y municipio son requeridos.' });
            return;
        }
        const record = yield LongWeekendStats_model_1.default.create({ year, bridge_name, municipality, occupancy_rate: occupancy_rate !== null && occupancy_rate !== void 0 ? occupancy_rate : 0, room_offer: room_offer !== null && room_offer !== void 0 ? room_offer : 0, occupied_rooms: occupied_rooms !== null && occupied_rooms !== void 0 ? occupied_rooms : 0, available_rooms: available_rooms !== null && available_rooms !== void 0 ? available_rooms : 0, average_stay: average_stay !== null && average_stay !== void 0 ? average_stay : 0, occupancy_density: occupancy_density !== null && occupancy_density !== void 0 ? occupancy_density : 0, nights: nights !== null && nights !== void 0 ? nights : 0, tourists_per_night: tourists_per_night !== null && tourists_per_night !== void 0 ? tourists_per_night : 0, daily_avg_spending: daily_avg_spending !== null && daily_avg_spending !== void 0 ? daily_avg_spending : 0, economic_impact: economic_impact !== null && economic_impact !== void 0 ? economic_impact : 0, tourist_flow: tourist_flow !== null && tourist_flow !== void 0 ? tourist_flow : 0 });
        res.status(201).json(record);
    }
    catch (err) {
        console.error('Error creando registro de fin de semana largo:', err);
        res.status(500).json({ error: 'Error creando el registro.' });
    }
}));
// Eliminar registro por ID
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield LongWeekendStats_model_1.default.destroy({ where: { id: req.params.id } });
        if (deleted)
            res.json({ success: true });
        else
            res.status(404).json({ error: 'No encontrado' });
    }
    catch (err) {
        res.status(500).json({ error: 'Error eliminando el registro' });
    }
}));
exports.default = router;
