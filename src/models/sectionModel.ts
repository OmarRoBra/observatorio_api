import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'sections' })
export default class Section extends Model {
  @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
  id!: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  slug!: string;
}
