import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'pdfs' })
export default class Pdf extends Model {
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
  title!: string; // Título del archivo PDF

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileUrl!: string; // Ruta del archivo PDF en el servidor
}