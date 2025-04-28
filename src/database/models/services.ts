import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
} from "sequelize-typescript";
import BookingModel from "./Booking";
import BookingServiceModel from "./BookingToService";

@Table({
  tableName: "services",
  modelName: "ServiceModel",
  timestamps: true,
})
class ServiceModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  declare service_name: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: true,
    defaultValue: "null",
  })
  declare service_design_types: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare duration: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare price: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare photo: string;

  @BelongsToMany(() => BookingModel, () => BookingServiceModel)
  declare bookings: BookingModel[];
}

export default ServiceModel;
