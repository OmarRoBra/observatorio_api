import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import dotenv from 'dotenv';
import pg from "pg"

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: [path.join(__dirname, '../models/*.model.ts')], // Asegúrate de que la ruta sea correcta
  logging: false,
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
  },
});

export default sequelize;