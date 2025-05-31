import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'season_stats' })
export default class SeasonStats extends Model {
  @Column({ type: DataType.INTEGER, allowNull: false }) year!: number;
  @Column({ type: DataType.STRING, allowNull: false }) season!: string;
  @Column({ type: DataType.STRING, allowNull: false }) municipality!: string;
  @Column({ type: DataType.FLOAT, allowNull: false }) occupancyRate!: number;
  @Column({ type: DataType.INTEGER, allowNull: false }) roomOffer!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) occupiedRooms!: number;
  @Column({ type: DataType.INTEGER, allowNull: false }) availableRooms!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) stay!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) density!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) touristsPerNight!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) avgSpending!: number;
  @Column({ type: DataType.BIGINT, allowNull: false }) economicImpact!: number;
  @Column({ type: DataType.FLOAT, allowNull: false }) touristFlow!: number;
}
