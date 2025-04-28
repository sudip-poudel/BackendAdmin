import { Table, Model, Column, ForeignKey } from "sequelize-typescript";
import BookingModel from "./Booking";
import ServiceModel from "./services";

@Table({ tableName: "booking_service" })
class BookingServiceModel extends Model {
  @ForeignKey(() => BookingModel)
  @Column
  declare bookingId: string;

  @ForeignKey(() => ServiceModel)
  @Column
  declare serviceId: string;
}

export default BookingServiceModel;
