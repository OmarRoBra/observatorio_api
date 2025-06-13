"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const excelFeed_1 = __importDefault(require("./routes/excelFeed"));
const database_1 = __importDefault(require("./config/database"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const monthlyStats_1 = __importDefault(require("./routes/monthlyStats"));
const seasonStats_1 = __importDefault(require("./routes/seasonStats"));
const longWeekendStats_routes_1 = __importDefault(require("./routes/longWeekendStats.routes"));
const pdfsFront_routes_1 = __importDefault(require("./routes/pdfsFront.routes"));
// Importar modelos para asegurar que se registren
require("./models/pdfFront.models");
__exportStar(require("./models/HolidayStats.model"), exports);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// CORS
app.use((0, cors_1.default)({
    origin: [
        'https://observatorio-colima.vercel.app',
        'http://localhost:3001',
        'https://observatorioturisticocolima.org',
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir archivos estáticos (PDFs)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
// Routes
app.use('/news', news_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
app.use('/inventory', inventory_routes_1.default);
app.use('/info-injection', excelFeed_1.default);
app.use('/monthly-stats', monthlyStats_1.default);
app.use('/season-stats', seasonStats_1.default);
app.use('/long-weekend-stats', longWeekendStats_routes_1.default);
app.use('/pdfs-front', pdfsFront_routes_1.default);
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.authenticate();
            yield database_1.default.sync();
            console.log('Base de datos sincronizada correctamente.');
        }
        catch (error) {
            console.error('Error al sincronizar la base de datos:', error);
        }
    });
}
initializeDatabase();
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
