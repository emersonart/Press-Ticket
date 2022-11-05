import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import Queue from "./Queue";
import Whatsapp from "./Whatsapp";
import Companies from "./Companies";

@Table
class WhatsappQueue extends Model<WhatsappQueue> {
  @ForeignKey(() => Whatsapp)
  @Column
  whatsappId: number;

  @ForeignKey(() => Queue)
  @Column
  queueId: number;

  @ForeignKey(() => Companies)
  @Column
  companyId: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @BelongsTo(() => Queue)
  queue: Queue;
}

export default WhatsappQueue;
