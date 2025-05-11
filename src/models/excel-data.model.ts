// src/models/excel-file.model.ts
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import ExcelData from './excel-data.model'; // ✔️ Importación consistente

@Table({ tableName: 'excel_files' })
class ExcelFile extends Model {
  @Column({ 
    type: DataType.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  fileName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  section!: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year!: number;

  @Column({ 
    type: DataType.ENUM('año', 'semestre', 'trimestre', 'mes', 'evento'),
    allowNull: false 
  })
  periodType!: string;

  @HasMany(() => ExcelData)
  data!: ExcelData[];
}

export default ExcelFile; // ✔️ Solo UN export default por archivo