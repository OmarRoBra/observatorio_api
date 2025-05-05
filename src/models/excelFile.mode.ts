import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'excel_files' })
export default class ExcelFile extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fileName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  filePath!: string;

  // antes era ForeignKey a Section; ahora:
  @Column({ type: DataType.STRING, allowNull: false })
  section!: string;
}
