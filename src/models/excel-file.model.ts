// src/models/excel-data.model.ts
import { Table, Column, Model, DataType, ForeignKey, CreatedAt } from 'sequelize-typescript';
import ExcelFile from './excel-data.model'; // ✔️ Nombre de archivo en minúsculas

// Define la interfaz PRIMERO
interface ExcelContent {
  periodo_nombre: string;
  municipio: string;
  ocupacion: number;
  oferta_cuartos: number;
  turistas: number;
  derrama_economica: number;
}

@Table({ tableName: 'excel_data', updatedAt: false })
class ExcelData extends Model {
  @Column({ 
    type: DataType.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  })
  id!: number;

  @ForeignKey(() => ExcelFile)
  @Column({ 
    type: DataType.INTEGER, 
    field: 'excel_file_id', 
    allowNull: false 
  })
  excelFileId!: number;

  @Column({ 
    type: DataType.JSONB, 
    allowNull: false 
  })
  content!: ExcelContent;

  @CreatedAt 
  @Column({ field: 'created_at' }) 
  createdAt!: Date;
}

export default ExcelData; // ✔️ Solo UN export default por archivo