"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("../controllers/inventory.controller");
const router = express_1.default.Router();
router.post('/', inventory_controller_1.uploadPdf);
router.get('/', inventory_controller_1.getPdfs);
router.delete('/:id', inventory_controller_1.deletePdf);
router.put('/:id', inventory_controller_1.updatePdf); // <-- Falta en tu router
exports.default = router;
