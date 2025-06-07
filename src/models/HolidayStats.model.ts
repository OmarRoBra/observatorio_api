import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, Unique } from 'sequelize-typescript';

import { Index } from 'sequelize-typescript';

@Table({ 
  tableName: 'holiday_stats', 
  timestamps: true,
  underscored: true   // Convierte camelCase a snake_case automáticamente
})
export default class HolidayStats extends Model<HolidayStats> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Index({ name: 'uq_holiday_stats', unique: true })
  @Column({ field: 'year', type: DataType.SMALLINT, allowNull: false })
  year!: number;

  @Index({ name: 'uq_holiday_stats', unique: true })
  @Column({ field: 'bridge_name', type: DataType.STRING(100), allowNull: false })
  bridge_name!: string;

  @Index({ name: 'uq_holiday_stats', unique: true })
  @Column({ field: 'municipality', type: DataType.STRING(50), allowNull: false })
  municipality!: string;

  @Column({ field: 'occupancy_rate', type: DataType.DECIMAL(5,2), allowNull: true })
  occupancy_rate!: number;

  @Column({ field: 'room_offer', type: DataType.INTEGER, allowNull: true })
  room_offer!: number;

  @Column({ field: 'occupied_rooms', type: DataType.INTEGER, allowNull: true })
  occupied_rooms!: number;

  @Column({ field: 'available_rooms', type: DataType.INTEGER, allowNull: true })
  available_rooms!: number;

  @Column({ field: 'average_stay', type: DataType.DECIMAL(4,2), allowNull: true })
  average_stay!: number;

  @Column({ field: 'occupancy_density', type: DataType.DECIMAL(4,2), allowNull: true })
  occupancy_density!: number;

  @Column({ field: 'nights', type: DataType.SMALLINT, allowNull: true })
  nights!: number;

  @Column({ field: 'tourists_per_night', type: DataType.INTEGER, allowNull: true })
  tourists_per_night!: number;

  @Column({ field: 'daily_avg_spending', type: DataType.DECIMAL(10,2), allowNull: true })
  daily_avg_spending!: number;

  @Column({ field: 'economic_impact', type: DataType.BIGINT, allowNull: true })
  economic_impact!: number;

  @Column({ field: 'tourist_flow', type: DataType.INTEGER, allowNull: true })
  tourist_flow!: number;

  // Sequelize manejará createdAt y updatedAt automáticamente
}
