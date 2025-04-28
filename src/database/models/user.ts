import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import BookingModel from "./Booking";
import { UserRole } from "../../controller/clientController";
import BranchModel from "./branch";

@Table({
  tableName: "users",
  modelName: "UserModel",
  timestamps: true,
})
class UserModel extends Model {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(15),
    allowNull: false,
  })
  declare phoneNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare profilePicture: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
  })
  declare DOB: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
  })
  declare gender: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare address: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: true,
  })
  declare otp: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare status: boolean;

  @ForeignKey(() => BranchModel)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  declare branchId?: string;

  @BelongsTo(() => BranchModel)
  declare branch: BranchModel;

  @HasMany(() => BookingModel)
  declare bookings: BookingModel[];
}

export default UserModel;
