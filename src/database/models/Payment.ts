import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "payments",
  modelName: "PaymentModel",
  timestamps: true,
})
class PaymentModel extends Model {
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
  declare transactionId: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  declare pidx: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [["khalti"]],
    },
  })
  declare paymentGateway: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "pending",
    validate: {
      isIn: [["success", "pending", "failed"]],
    },
  })
  declare status: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare customerName: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare paymentDate: Date;
}

export default PaymentModel;
