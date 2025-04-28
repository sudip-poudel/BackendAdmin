import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from "sequelize-typescript";
import UserModel from "./user";
import BranchModel from "./branch";
import ServiceModel from "./services";
import BookingServiceModel from "./BookingToService";

@Table({
  tableName: "booking",
  modelName: "BookingModel",
  timestamps: true,
})
class BookingModel extends Model {
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
  declare name: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  declare time: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare phone: string;

  @BelongsToMany(() => ServiceModel, () => BookingServiceModel)
  declare services: ServiceModel[];

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare staffId: string;

  @BelongsTo(() => UserModel)
  declare staff: UserModel;

  @ForeignKey(() => BranchModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare branchId: string;

  @BelongsTo(() => BranchModel)
  declare branch: BranchModel;
}

export default BookingModel;
