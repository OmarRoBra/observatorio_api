import { Table, Column, Model, DataType, CreatedAt } from 'sequelize-typescript';

@Table({ tableName: 'activity_logs', timestamps: true, updatedAt: false })
export default class ActivityLog extends Model {

    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id!: number;

    // ¿Quién lo hizo? (nombre o email del usuario)
    @Column({ type: DataType.STRING, allowNull: false })
    user!: string;

    // ¿Qué hizo? (ej: "Subió Excel", "Eliminó registro", "Creó usuario")
    @Column({ type: DataType.STRING, allowNull: false })
    action!: string;

    // ¿En qué sección? (ej: "monthly-stats", "usuarios", "noticias")
    @Column({ type: DataType.STRING, allowNull: false })
    section!: string;

    // Detalle extra (ej: "ID 45", "nombre del archivo", etc.)
    @Column({ type: DataType.TEXT, allowNull: true })
    details!: string;

    @CreatedAt
    createdAt!: Date;
}
