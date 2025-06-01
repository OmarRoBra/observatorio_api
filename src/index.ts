import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import newsRoutes from './routes/news.routes';
import inventoryRoutes from './routes/inventory.routes';
import excelInfo from './routes/excelFeed';
import sequelize from './config/database';
import path from 'path';
import cors from 'cors';
import monthlyStatsRoutes from './routes/monthlyStats.routes.js';
import seasonStatsRoutes from './routes/seasonStats';


// observatorio_api/src/index.ts
export * from './models/HolidayStats.model';
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/news', newsRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/info-injection', excelInfo);
app.use('/monthly-stats', monthlyStatsRoutes);
app.use('/season-stats', seasonStatsRoutes);

async function initializeDatabase() {
  try {
    await sequelize.authenticate(); // Verificar la conexión
    await sequelize.sync(); // Sincronizar modelos con la base de datos
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
