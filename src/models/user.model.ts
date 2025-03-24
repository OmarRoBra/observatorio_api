import { Table, Column, Model, BeforeCreate, BeforeUpdate, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export default class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'editor',
    validate: { isIn: [['admin', 'editor']] }
  })
  role!: string;


}
