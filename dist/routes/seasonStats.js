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
const router = (0, express_1.Router)();
router.post('/upload-excel', upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Archivo o tipo faltante.' });
            return;
        }
        const data = (0, excelReader_1.readExcelFromBuffer)(req.file.buffer);
        yield (0, seasonStatsProcessor_1.insertSeasonStatsFromExcel)(data);
        res.status(200).json({ message: `Archivo  procesado correctamente.` });
    }
    catch (error) {
        console.error(error);
        console.log(error);
        res.status(500).json({ message: 'Error procesando el archivo.' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield SeasonStats_model_1.default.findAll();
    res.json(stats);
}));
router.delete('/by-date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start, end } = req.query;
        if (!start) {
            res.status(400).json({ error: 'Debe indicar al menos fecha start (YYYY-MM-DD)' });
            return;
        }
        // Construimos la condición
        const where = {
            date: {
                // >= start
                [sequelize_1.Op.gte]: new Date(start),
            }
        };
        if (end) {
            // <= end (solo si end viene)
            where.date[sequelize_1.Op.lte] = new Date(end);
        }
        // Ejecutamos el borrado en lote
        const count = yield SeasonStats_model_1.default.destroy({ where });
        res.json({
            success: true,
            deletedCount: count,
            message: `${count} registros eliminados desde ${start}${end ? ` hasta ${end}` : ''}.`
        });
    }
    catch (err) {
        console.error('Error eliminando por fecha:', err);
        res.status(500).json({ error: 'Error eliminando registros por fecha' });
    }
}));
exports.default = router;
