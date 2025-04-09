import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'booking',
    modelName: 'BookingModel',
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
    declare location: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    declare name: string;

    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    declare services: string[];

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare staff: string;


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
}

export default BookingModel;

