import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'services',
    modelName: 'ServiceModel',
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
        allowNull: false,
    })
    declare service_design_types: string;

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
}

export default ServiceModel;

