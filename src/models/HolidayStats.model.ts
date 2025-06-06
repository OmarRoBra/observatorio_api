// models/HolidayStats.model.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'holiday_stats', timestamps: true }) // timestamps true si tienes createdAt/updatedAt
export default class HolidayStats extends Model {
  @Column({ type: DataType.INTEGER }) year!: number;
  @Column({ type: DataType.STRING }) bridge_name!: string;
  @Column({ type: DataType.STRING }) municipality!: string;
  @Column({ type: DataType.FLOAT }) occupancy_rate!: number;
  @Column({ type: DataType.INTEGER }) room_offer!: number;
  @Column({ type: DataType.INTEGER }) occupied_rooms!: number;
  @Column({ type: DataType.INTEGER }) available_rooms!: number;
  @Column({ type: DataType.FLOAT }) average_stay!: number;
  @Column({ type: DataType.FLOAT }) occupancy_density!: number;
  @Column({ type: DataType.INTEGER }) nights!: number;
  @Column({ type: DataType.INTEGER }) tourists_per_night!: number;
  @Column({ type: DataType.FLOAT }) daily_avg_spending!: number;
  @Column({ type: DataType.BIGINT }) economic_impact!: number;
  @Column({ type: DataType.INTEGER }) tourist_flow!: number;
}
