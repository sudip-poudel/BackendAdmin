import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({
  tableName: "appointment_services",
  modelName: "AppointmentServiceModel",
  timestamps: true,
})
class AppointmentServiceModel extends Model {
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
  declare appointmentStatus: string;
}

export default AppointmentServiceModel;
