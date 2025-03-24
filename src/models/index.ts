import { Sequelize } from 'sequelize-typescript';
import User from './user.model';
import News from './news.model';

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  models: [User,News],
});

export { sequelize, User,News };