import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'holiday_stats' })
export default class HolidayStats extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  id!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  bridgeName!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  municipality!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  month!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  occupancyRate!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  roomOffer!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  occupiedRooms!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  availableBeds!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  stay!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  density!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  nights!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  touristsPerNight!: number;

  @Column({ type: DataType.FLOAT, allowNull: false })
  gpd!: number;

  @Column({ type: DataType.BIGINT, allowNull: false })
  economicImpact!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  touristFlow!: number;

  @Column({ type: DataType.DATE, allowNull: false })
  createdAt!: Date;

  @Column({ type: DataType.DATE, allowNull: false })
  updatedAt!: Date;
}
