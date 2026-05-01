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
const seasonStatsProcessor_1 = require("../services/seasonStatsProcessor");
const SeasonStats_model_1 = __importDefault(require("../models/SeasonStats.model"));
const sequelize_1 = require("sequelize");
const activityLog_service_1 = require("../services/activityLog.service");
const models_1 = require("../models");
const router = (0, express_1.Router)();
router.post('/upload-excel', upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Archivo o tipo faltante.' });
            return;
        }
        const data = (0, excelReader_1.readExcelFromBuffer)(req.file.buffer);
        yield (0, seasonStatsProcessor_1.insertSeasonStatsFromExcel)(data);
        const user = yield models_1.User.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (user === null || user === void 0 ? void 0 : user.email) || 'unknown',
            action: 'Subió Excel de temporadas',
            section: 'season-stats',
            details: `Archivo: ${req.file.originalname}`,
        });
        res.status(200).json({ message: `Archivo procesado correctamente.` });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error procesando el archivo.' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield SeasonStats_model_1.default.findAll();
    res.json(stats);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, season, municipality, occupancyRate, roomOffer, occupiedRooms, availableRooms, stay, density, touristsPerNight, avgSpending, economicImpact, touristFlow } = req.body;
        if (!year || !season || !municipality) {
            res.status(400).json({ error: 'Año, temporada y municipio son requeridos.' });
            return;
        }
        const record = yield SeasonStats_model_1.default.create({ year, season, municipality, occupancyRate: occupancyRate !== null && occupancyRate !== void 0 ? occupancyRate : 0, roomOffer: roomOffer !== null && roomOffer !== void 0 ? roomOffer : 0, occupiedRooms: occupiedRooms !== null && occupiedRooms !== void 0 ? occupiedRooms : 0, availableRooms: availableRooms !== null && availableRooms !== void 0 ? availableRooms : 0, stay: stay !== null && stay !== void 0 ? stay : 0, density: density !== null && density !== void 0 ? density : 0, touristsPerNight: touristsPerNight !== null && touristsPerNight !== void 0 ? touristsPerNight : 0, avgSpending: avgSpending !== null && avgSpending !== void 0 ? avgSpending : 0, economicImpact: economicImpact !== null && economicImpact !== void 0 ? economicImpact : 0, touristFlow: touristFlow !== null && touristFlow !== void 0 ? touristFlow : 0 });
        const user = yield models_1.User.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (user === null || user === void 0 ? void 0 : user.email) || 'unknown',
            action: 'Creó registro de temporada',
            section: 'season-stats',
            details: `Nuevo registro con ID ${record.id}`,
        });
        res.status(201).json(record);
    }
    catch (err) {
        console.error('Error creando registro de temporada:', err);
        res.status(500).json({ error: 'Error creando el registro.' });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { year, season, municipality, occupancyRate, roomOffer, occupiedRooms, availableRooms, stay, density, touristsPerNight, avgSpending, economicImpact, touristFlow } = req.body;
        const record = yield SeasonStats_model_1.default.findByPk(id);
        if (!record) {
            res.status(404).json({ error: 'Registro no encontrado.' });
            return;
        }
        yield record.update({ year, season, municipality, occupancyRate: occupancyRate !== null && occupancyRate !== void 0 ? occupancyRate : record.occupancyRate, roomOffer: roomOffer !== null && roomOffer !== void 0 ? roomOffer : record.roomOffer, occupiedRooms: occupiedRooms !== null && occupiedRooms !== void 0 ? occupiedRooms : record.occupiedRooms, availableRooms: availableRooms !== null && availableRooms !== void 0 ? availableRooms : record.availableRooms, stay: stay !== null && stay !== void 0 ? stay : record.stay, density: density !== null && density !== void 0 ? density : record.density, touristsPerNight: touristsPerNight !== null && touristsPerNight !== void 0 ? touristsPerNight : record.touristsPerNight, avgSpending: avgSpending !== null && avgSpending !== void 0 ? avgSpending : record.avgSpending, economicImpact: economicImpact !== null && economicImpact !== void 0 ? economicImpact : record.economicImpact, touristFlow: touristFlow !== null && touristFlow !== void 0 ? touristFlow : record.touristFlow });
        const user = yield models_1.User.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (user === null || user === void 0 ? void 0 : user.email) || 'unknown',
            action: 'Editó registro de temporada',
            section: 'season-stats',
            details: `Registro con ID ${id} actualizado`,
        });
        res.json(record);
    }
    catch (err) {
        console.error('Error actualizando registro de temporada:', err);
        res.status(500).json({ error: 'Error actualizando el registro.' });
    }
}));
router.post('/delete-batch', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({ error: 'Se requiere un arreglo de IDs.' });
            return;
        }
        yield SeasonStats_model_1.default.destroy({ where: { id: ids } });
        const user = yield models_1.User.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (user === null || user === void 0 ? void 0 : user.email) || 'unknown',
            action: 'Eliminó lote de temporadas',
            section: 'season-stats',
            details: `IDs eliminados: ${ids.join(', ')}`,
        });
        res.json({ success: true });
    }
    catch (err) {
        console.error('Error eliminando lote de temporada:', err);
        res.status(500).json({ error: 'Error eliminando el lote.' });
    }
}));
router.delete('/by-date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        if (!start) {
            res.status(400).json({ error: 'Debe indicar al menos fecha start (YYYY-MM-DD)' });
            return;
        }
        const where = { date: { [sequelize_1.Op.gte]: new Date(start) } };
        if (end)
            where.date[sequelize_1.Op.lte] = new Date(end);
        const count = yield SeasonStats_model_1.default.destroy({ where });
        const user = yield models_1.User.findByPk(req.userId);
        yield (0, activityLog_service_1.createActivityLog)({
            user: (user === null || user === void 0 ? void 0 : user.email) || 'unknown',
            action: 'Eliminó temporadas por rango de fecha',
            section: 'season-stats',
            details: `${count} registros eliminados (${start}${end ? ` hasta ${end}` : ''})`,
        });
        res.json({ success: true, deletedCount: count, message: `${count} registros eliminados desde ${start}${end ? ` hasta ${end}` : ''}.` });
    }
    catch (err) {
        console.error('Error eliminando por fecha:', err);
        res.status(500).json({ error: 'Error eliminando registros por fecha' });
    }
}));
exports.default = router;
