import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  AllowNull,
  HasMany,
  Unique,
  BelongsToMany
} from "sequelize-typescript";
import User from "./User";
import Whatsapp from "./Whatsapp";

@Table
class Companies extends Model<Companies> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull
  @Column(DataType.TEXT)
  name: string;

  @Column
  logo: string;

  @Column
  email: string;

  @Column
  document: string;

  @Column
  phone: string;

  @Column
  status: string;

  @Column
  limitConnections: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @HasMany(() => User)
  users: User[];

  @BelongsToMany(() => User, () => Whatsapp)
  queues: Array<User & { Whatsapp: Whatsapp }>;

  @HasMany(() => Whatsapp)
  whatsapp: Whatsapp[];
}

export default Companies;
