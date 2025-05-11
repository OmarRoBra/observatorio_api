// backend/config/database.ts
import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [
    path.resolve(__dirname, '../models/inventory.model.js'),
    path.resolve(__dirname, '../models/user.model.js'),
    path.resolve(__dirname, '../models/news.model.js'),
    path.resolve(__dirname,'../models/excel-file.model.ts')
  ],
  logging: false,
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;