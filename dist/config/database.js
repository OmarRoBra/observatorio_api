"use strict";
// src/config/database.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = exports.PdfFront = exports.LongWeekendStats = exports.SeasonStats = exports.MonthlyStats = exports.Holidays = exports.News = exports.Users = exports.Pdf = exports.sequelize = exports.default = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
const LongWeekendStats_model_1 = __importDefault(require("../models/LongWeekendStats.model"));
exports.LongWeekendStats = LongWeekendStats_model_1.default;
const pdfFront_model_1 = __importDefault(require("../models/pdfFront.model"));
exports.PdfFront = pdfFront_model_1.default;
const ActivityLog_model_1 = __importDefault(require("../models/ActivityLog.model"));
exports.ActivityLog = ActivityLog_model_1.default;
const news_model_1 = __importDefault(require("../models/news.model"));
exports.News = news_model_1.default;
const user_model_1 = __importDefault(require("../models/user.model"));
exports.Users = user_model_1.default;
const HolidayStats_model_1 = __importDefault(require("../models/HolidayStats.model"));
exports.Holidays = HolidayStats_model_1.default;
const MonthlyStats_model_1 = __importDefault(require("../models/MonthlyStats.model"));
exports.MonthlyStats = MonthlyStats_model_1.default;
const SeasonStats_model_1 = __importDefault(require("../models/SeasonStats.model"));
exports.SeasonStats = SeasonStats_model_1.default;
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
exports.Pdf = inventory_model_1.default;
dotenv_1.default.config();
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialectModule: pg_1.default,
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
exports.default = sequelize;
exports.sequelize = sequelize;
// Registro explícito de todos los modelos
sequelize.addModels([
    inventory_model_1.default,
    user_model_1.default,
    news_model_1.default,
    HolidayStats_model_1.default,
    MonthlyStats_model_1.default,
    SeasonStats_model_1.default,
    LongWeekendStats_model_1.default,
    pdfFront_model_1.default,
    ActivityLog_model_1.default
]);
