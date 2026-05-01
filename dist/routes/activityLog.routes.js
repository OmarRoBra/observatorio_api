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
const auth_middleware_1 = require("../middleware/auth.middleware");
const ActivityLog_model_1 = __importDefault(require("../models/ActivityLog.model"));
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield ActivityLog_model_1.default.findAll({
            order: ["createdAt", "DESC"],
            limit: 200,
        });
        res.json(logs);
    }
    catch (error) {
        console.error("ERROR AL OBTENER LOGS:", error);
        res.status(500).json({
            message: "error al obtener los registros",
            error: error instanceof Error ? error.message : String(error)
        });
    }
}));
exports.default = router;
