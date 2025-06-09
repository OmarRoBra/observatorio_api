// src/config/database.ts

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import pg from 'pg';

import Pdf          from '../models/inventory.model';
import News         from '../models/news.model';
import Users        from '../models/user.model';
import Holidays     from '../models/HolidayStats.model';
import MonthlyStats from '../models/MonthlyStats.model';
import SeasonStats  from '../models/SeasonStats.model';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dialectModule: pg,
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
  Pdf,
  Users,
  News,
  Holidays,
  MonthlyStats,
  SeasonStats,
]);

// (Opcional) Sincroniza las tablas si no usas migraciones
// sequelize.sync({ alter: true });

export default sequelize;
