import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import User from './user.model';

@Table({ tableName: 'news' })
export default class News extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string; // Encabezado

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string; // Cuerpo de la noticia

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata!: { author: string; date: string }; // Metadata

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl!: string; // URL de la imagen

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}