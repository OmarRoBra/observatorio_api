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
const monthlyStatsProcessor_1 = require("../services/monthlyStatsProcessor");
const MonthlyStats_model_1 = __importDefault(require("../models/MonthlyStats.model"));
const router = (0, express_1.Router)();
router.post('/upload-excel', upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Archivo o tipo faltante.' });
            return;
        }
        const data = (0, excelReader_1.readExcelFromBuffer)(req.file.buffer);
        yield (0, monthlyStatsProcessor_1.insertMonthlyStatsFromExcel)(data);
        res.status(200).json({ message: `Archivo  procesado correctamente.` });
    }
    catch (error) {
        console.error(error);
        console.log(error);
        res.status(500).json({ message: 'Error procesando el archivo.' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Entrando a /monthly-stats");
    try {
        const stats = yield MonthlyStats_model_1.default.findAll();
        console.log("Datos de monthly:", stats);
        res.json(stats || []);
    }
    catch (e) {
        console.error("Error en /monthly-stats:", e);
        res.status(500).json({ error: "Error en monthly-stats", details: e });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield MonthlyStats_model_1.default.destroy({ where: { id: req.params.id } });
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
