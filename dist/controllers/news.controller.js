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
exports.deleteNews = exports.updateNews = exports.getNewsById = exports.getAllNews = exports.createNews = void 0;
const news_model_1 = __importDefault(require("../models/news.model"));
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, metadata, userId } = req.body;
    const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;
    try {
        const news = yield news_model_1.default.create({ title, content, metadata, imageUrl, userId });
        res.status(201).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating news', error });
    }
});
exports.createNews = createNews;
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_model_1.default.findAll();
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
});
exports.getAllNews = getAllNews;
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const news = yield news_model_1.default.findByPk(id);
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching news', error });
    }
});
exports.getNewsById = getNewsById;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, metadata } = req.body;
    const imageUrl = req.file ? `/uploads/images/${req.file.filename}` : null;
    try {
        const news = yield news_model_1.default.findByPk(id);
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }
        news.title = title || news.title;
        news.content = content || news.content;
        news.metadata = metadata || news.metadata;
        news.imageUrl = imageUrl || news.imageUrl;
        yield news.save();
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating news', error });
    }
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const news = yield news_model_1.default.findByPk(id);
        if (!news) {
            res.status(404).json({ message: 'News not found' });
            return;
        }
        yield news.destroy();
        res.json({ message: 'News deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting news', error });
    }
});
exports.deleteNews = deleteNews;
