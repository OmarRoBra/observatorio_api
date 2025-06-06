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
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const database_1 = __importDefault(require("./config/database"));
const cors_1 = __importDefault(require("cors"));
const monthlyStats_1 = __importDefault(require("./routes/monthlyStats"));
const seasonStats_1 = __importDefault(require("./routes/seasonStats"));
/* import longWeekendStatsRoutes from './routes/longWeekendStats'; */
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: [
        "https://observatorio-colima.vercel.app", // tu frontend en producción
        "http://localhost:3000" // para desarrollo local (opcional)
    ],
    credentials: true, // Si necesitas cookies/autenticación, si no puedes omitir
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/news', news_routes_1.default);
app.use('/auth', auth_routes_1.default);
app.use('/user', user_routes_1.default);
app.use('/inventory', inventory_routes_1.default); // ✅ Correcto
app.use('/monthly-stats', monthlyStats_1.default);
app.use('/monthly-stats', monthlyStats_1.default);
app.use('/season-stats', seasonStats_1.default);
/* app.use('/long-weekend-stats', longWeekendStatsRoutes); */
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.authenticate(); // Verificar la conexión
            yield database_1.default.sync(); // Sincronizar modelos con la base de datos
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
