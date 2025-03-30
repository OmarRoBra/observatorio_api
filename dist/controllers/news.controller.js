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
exports.deleteNews = exports.updateNews = exports.getNewsById = exports.getAllNews = exports.createNews = exports.uploadMiddleware = void 0;
const news_model_1 = __importDefault(require("../models/news.model"));
const supabase_1 = require("../config/supabase");
const multer_1 = __importDefault(require("multer"));
// Configuración de Multer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed!"));
        }
    },
});
exports.uploadMiddleware = upload.single("image");
const uploadToSupabase = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileExt = file.originalname.split(".").pop();
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
        const filePath = `news/${fileName}`;
        const { error } = yield supabase_1.supabase.storage
            .from("news-images")
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error)
            return { error };
        const { data: { publicUrl }, } = supabase_1.supabase.storage.from("news-images").getPublicUrl(filePath);
        return { publicUrl };
    }
    catch (error) {
        return { error: error };
    }
});
const deleteFromSupabase = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const path = url.split("news-images/")[1];
        if (!path)
            return;
        yield supabase_1.supabase.storage.from("news-images").remove([path]);
    }
    catch (error) {
        console.error("Error deleting image:", error);
    }
});
// Controladores actualizados con tipos correctos
const createNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, metadata, userId } = req.body;
        let imageUrl = null;
        if (req.file) {
            const { error, publicUrl } = yield uploadToSupabase(req.file);
            if (error)
                throw error;
            imageUrl = publicUrl || null;
        }
        const news = yield news_model_1.default.create({
            title,
            content,
            metadata,
            imageUrl,
            userId,
        });
        res.status(201).json(news);
    }
    catch (error) {
        next(error);
    }
});
exports.createNews = createNews;
const getAllNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_model_1.default.findAll();
        res.json(news);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNews = getAllNews;
const getNewsById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_model_1.default.findByPk(req.params.id);
        if (!news) {
            res.status(404).json({ message: "News not found" });
            return;
        }
        res.json(news);
    }
    catch (error) {
        next(error);
    }
});
exports.getNewsById = getNewsById;
const updateNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_model_1.default.findByPk(req.params.id);
        if (!news) {
            res.status(404).json({ message: "News not found" });
            return;
        }
        const { title, content, metadata } = req.body;
        let { imageUrl } = news;
        if (req.file) {
            if (imageUrl) {
                yield deleteFromSupabase(imageUrl);
            }
            const { error, publicUrl } = yield uploadToSupabase(req.file);
            if (error)
                throw error;
            imageUrl = publicUrl;
        }
        yield news.update({ title, content, metadata, imageUrl });
        res.json(news);
    }
    catch (error) {
        next(error);
    }
});
exports.updateNews = updateNews;
const deleteNews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_model_1.default.findByPk(req.params.id);
        if (!news) {
            res.status(404).json({ message: "News not found" });
            return;
        }
        if (news.imageUrl) {
            yield deleteFromSupabase(news.imageUrl);
        }
        yield news.destroy();
        res.json({ message: "News deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteNews = deleteNews;
