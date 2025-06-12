import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import newsRoutes from './routes/news.routes';
import inventoryRoutes from './routes/inventory.routes';
import excelInfo from './routes/excelFeed';
import sequelize from './config/database';
import path from 'path';
import cors from 'cors';
import monthlyStatsRoutes from './routes/monthlyStats';
import seasonStatsRoutes from './routes/seasonStats';
import LongWeekendStatsRoutes from './routes/longWeekendStats.routes';
import pdfFrontRoutes from './routes/pdfsFront.routes';

// Importar modelos para asegurar que se registren
import './models/pdfFront.models';

export * from './models/HolidayStats.model';

const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: [
    'https://observatorio-colima.vercel.app',
    'http://localhost:3001',
    'https://observatorioturisticocolima.org',
    'http://localhost:5173'
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (PDFs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/news', newsRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/info-injection', excelInfo);
app.use('/monthly-stats', monthlyStatsRoutes);
app.use('/season-stats', seasonStatsRoutes);
app.use('/long-weekend-stats', LongWeekendStatsRoutes);
app.use('/pdf-front', pdfFrontRoutes);

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Base de datos sincronizada correctamente.');
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
}

initializeDatabase();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});