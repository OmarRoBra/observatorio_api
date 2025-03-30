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
exports.deletePdf = exports.getPdfs = exports.uploadPdf = void 0;
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, fileUrl } = req.body;
        if (!title || !fileUrl) {
            res.status(400).json({
                message: 'Title and file URL are required'
            });
            return;
        }
        const pdf = yield inventory_model_1.default.create({ title, fileUrl });
        res.status(201).json(pdf);
    }
    catch (error) {
        console.error('Error saving PDF:', error);
        res.status(500).json({
            message: 'Error saving PDF information',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.uploadPdf = uploadPdf;
const getPdfs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfs = yield inventory_model_1.default.findAll();
        res.json(pdfs);
    }
    catch (error) {
        console.error('Error fetching PDFs:', error);
        res.status(500).json({
            message: 'Error getting PDFs',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getPdfs = getPdfs;
const deletePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pdf = yield inventory_model_1.default.findByPk(id);
        if (!pdf) {
            res.status(404).json({ message: 'PDF not found' });
            return;
        }
        yield pdf.destroy();
        res.json({ message: 'PDF deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting PDF:', error);
        res.status(500).json({
            message: 'Error deleting PDF',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deletePdf = deletePdf;
