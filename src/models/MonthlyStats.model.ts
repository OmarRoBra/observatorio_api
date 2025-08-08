import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'monthly_stats', timestamps: false })
export default class MonthlyStats extends Model {
  @Column({ type: DataType.INTEGER, allowNull: false })
  year!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  month!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  municipality!: string;

  @Column({ type: DataType.FLOAT, allowNull: false, field: 'occupancyRate' })
  occupancyRate!: number;

  @Column({ type: DataType.INTEGER, allowNull: false, field: 'touristFlow' })
  touristFlow!: number;

  @Column({ type: DataType.BIGINT, allowNull: false, field: 'economicImpact' })
  economicImpact!: number;

  @Column({ type: DataType.DATE, allowNull: false, field: 'createdAt' })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false, field: 'updatedAt' })
  updatedAt!: Date;
}