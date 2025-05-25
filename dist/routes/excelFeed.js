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
// src/routes/uploadExcel.ts
const express_1 = require("express");
const upload_1 = require("../middleware/upload");
const excelReader_1 = require("../utils/excelReader");
const sequelize_1 = require("sequelize");
const HolidayStats_model_1 = __importDefault(require("../models/HolidayStats.model"));
const uploadInfoExcell_1 = require("../services/uploadInfoExcell");
const router = (0, express_1.Router)();
router.post('/upload-excel', upload_1.upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Archivo o tipo faltante.' });
            return;
        }
        const data = (0, excelReader_1.readExcelFromBuffer)(req.file.buffer);
        yield (0, uploadInfoExcell_1.insertHolidayStatsFromExcel)(data);
        res.status(200).json({ message: `Archivo  procesado correctamente.` });
    }
    catch (error) {
        console.error(error);
        console.log(error);
        res.status(500).json({ message: 'Error procesando el archivo.' });
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { year, fromYear, toYear, municipality, bridgeName } = req.query;
        const where = {};
        if (year || fromYear || toYear) {
            where.year = {};
            if (year) {
                where.year[sequelize_1.Op.eq] = Number(year);
            }
            if (fromYear) {
                where.year[sequelize_1.Op.gte] = Number(fromYear);
            }
            if (toYear) {
                where.year[sequelize_1.Op.lte] = Number(toYear);
            }
        }
        if (municipality) {
            where.municipality = { [sequelize_1.Op.iLike]: `%${municipality}%` };
        }
        if (bridgeName) {
            where.bridgeName = { [sequelize_1.Op.iLike]: `%${bridgeName}%` };
        }
        const results = yield HolidayStats_model_1.default.findAll({ where });
        res.json(results);
    }
    catch (err) {
        console.error('Error fetching holiday stats:', err);
        res.status(500).json({ error: 'Error fetching holiday stats' });
    }
}));
exports.default = router;
