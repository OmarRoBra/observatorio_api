import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'holiday_stats', timestamps: true })
export default class HolidayStats extends Model {
  @Column({ type: DataType.INTEGER }) year!: number;
  @Column({ field: 'bridge_name', type: DataType.STRING }) bridge_name!: string;
  @Column({ type: DataType.STRING }) municipality!: string;
  @Column({ field: 'occupancy_rate', type: DataType.FLOAT }) occupancy_rate!: number;
  @Column({ field: 'room_offer', type: DataType.INTEGER }) room_offer!: number;
  @Column({ field: 'occupied_rooms', type: DataType.INTEGER }) occupied_rooms!: number;
  @Column({ field: 'available_rooms', type: DataType.INTEGER }) available_rooms!: number;
  @Column({ field: 'average_stay', type: DataType.FLOAT }) average_stay!: number;
  @Column({ field: 'occupancy_density', type: DataType.FLOAT }) occupancy_density!: number;
  @Column({ type: DataType.INTEGER }) nights!: number;
  @Column({ field: 'tourists_per_night', type: DataType.INTEGER }) tourists_per_night!: number;
  @Column({ field: 'daily_avg_spending', type: DataType.FLOAT }) daily_avg_spending!: number;
  @Column({ field: 'economic_impact', type: DataType.BIGINT }) economic_impact!: number;
  @Column({ field: 'tourist_flow', type: DataType.INTEGER }) tourist_flow!: number;
}
