import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import ExcelFile from './excelFile.mode';

@Table({ tableName: 'excel_rows' })
export default class ExcelRow extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => ExcelFile)
  @Column({ type: DataType.INTEGER, allowNull: false })
  excelFileId!: number;

  @Column({ type: DataType.JSONB, allowNull: false })
  row!: object;
}
