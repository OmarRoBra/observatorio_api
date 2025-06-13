"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pdfFront_controller_1 = require("../controllers/pdfFront.controller");
const router = express_1.default.Router();
router.post('/', pdfFront_controller_1.uploadPdf);
router.get('/', pdfFront_controller_1.getPdfs);
router.delete('/:id', pdfFront_controller_1.deletePdf);
router.put('/:id', pdfFront_controller_1.updatePdf);
exports.default = router;
