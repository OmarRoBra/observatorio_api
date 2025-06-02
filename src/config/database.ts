import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';
import Pdf from '../models/inventory.model';
import News from '../models/news.model';
import Users from '../models/user.model';
import Hollydays from '../models/HolidayStats.model';
import MonthlyStats from '../models/MonthlyStats.model';
import SeasonStats from '../models/SeasonStats.model';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [Pdf, Users, News, Hollydays,MonthlyStats,SeasonStats], // Asegúrate de que la ruta sea correcta
  logging: false,
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false, // This line will fix new error
    },
  },
});

export default sequelize;
