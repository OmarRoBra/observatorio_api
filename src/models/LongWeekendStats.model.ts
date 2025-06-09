import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'long_weekend_stats',
  timestamps: true, // createdAt y updatedAt automáticos
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class LongWeekendStats extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.INTEGER })
  year!: number;

  @Column({ type: DataType.TEXT })
  bridge_name!: string;

  @Column({ type: DataType.TEXT })
  municipality!: string;

  @Column({ type: DataType.DOUBLE })
  occupancy_rate!: number;

  @Column({ type: DataType.INTEGER })
  room_offer!: number;

  @Column({ type: DataType.INTEGER })
  occupied_rooms!: number;

  @Column({ type: DataType.INTEGER })
  available_rooms!: number;

  @Column({ type: DataType.DOUBLE })
  average_stay!: number;

  @Column({ type: DataType.DOUBLE })
  occupancy_density!: number;

  @Column({ type: DataType.INTEGER })
  nights!: number;

  @Column({ type: DataType.INTEGER })
  tourists_per_night!: number;

  @Column({ type: DataType.DOUBLE })
  daily_avg_spending!: number;

  @Column({ type: DataType.BIGINT })
  economic_impact!: number;

  @Column({ type: DataType.INTEGER })
  tourist_flow!: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt!: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt!: Date;
}
