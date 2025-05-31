import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'monthly_stats' })
export default class MonthlyStats extends Model {
  @Column({ type: DataType.INTEGER, allowNull: false }) year!: number;
  @Column({ type: DataType.STRING, allowNull: false }) month!: string;
  @Column({ type: DataType.STRING, allowNull: false }) municipality!: string;
  @Column({ type: DataType.FLOAT, allowNull: false }) occupancyRate!: number;
  @Column({ type: DataType.INTEGER, allowNull: false }) touristFlow!: number;
  @Column({ type: DataType.BIGINT, allowNull: false }) economicImpact!: number;
}
