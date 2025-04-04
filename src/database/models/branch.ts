import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'branches',
    modelName: 'BranchModel',
    timestamps: true, 
  })

class BranchModel extends Model {
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
    declare branchName: string;

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
    declare phone: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare address: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare latitude: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare longitude: string;    
}

export default BranchModel;