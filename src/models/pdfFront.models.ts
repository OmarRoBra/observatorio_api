import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'pdfFront' }) // Puedes llamarla 'pdfFront' o 'pdfFronts' según tu gusto
export default class PdfFront extends Model {
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
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileUrl!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category!: string;
}
