"use strict";
// src/config/database.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const news_model_1 = __importDefault(require("../models/news.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const HolidayStats_model_1 = __importDefault(require("../models/HolidayStats.model"));
const MonthlyStats_model_1 = __importDefault(require("../models/MonthlyStats.model"));
const SeasonStats_model_1 = __importDefault(require("../models/SeasonStats.model"));
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
// Registro explícito de todos los modelos
sequelize.addModels([
    inventory_model_1.default,
    user_model_1.default,
    news_model_1.default,
    HolidayStats_model_1.default,
    MonthlyStats_model_1.default,
    SeasonStats_model_1.default,
]);
// (Opcional) Sincroniza las tablas si no usas migraciones
// sequelize.sync({ alter: true });
exports.default = sequelize;
