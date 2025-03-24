"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const news_controller_1 = require("../controllers/news.controller");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = express_1.default.Router();
router.post('/', uploadMiddleware_1.uploadImage.single('image'), news_controller_1.createNews);
router.get('/', news_controller_1.getAllNews);
router.get('/:id', news_controller_1.getNewsById);
router.put('/:id', uploadMiddleware_1.uploadImage.single('image'), news_controller_1.updateNews);
router.delete('/:id', news_controller_1.deleteNews);
exports.default = router;
