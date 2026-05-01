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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const models_1 = require("../models");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, auth_middleware_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield models_1.ActivityLog.findAll({
            order: ["createdAt", "DESC"],
            limit: 200,
        });
        res.json(logs);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ mesagge: "error al obtener los registros" });
    }
}));
exports.default = router;
