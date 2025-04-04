import { Sequelize } from 'sequelize-typescript';
import path from 'path';

import UserModel from './models/user';
import AppointmentServiceModel from './models/AppointmentService';
import BranchModel from './models/branch';
import ServiceModel from './models/services';



const sequelize = new Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [path.join(__dirname, '/models')], 
    pool: {
        max: 50, 
        min:5,
        acquire: 60000, 
        idle: 10000 
    }
});


sequelize.authenticate()
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });


// Syncing the models with the database
sequelize.sync({ alter: false });

// Syncing the models with the database
sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized!');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });


// Relationship

// Branch Id In AppointmentServiceModel
BranchModel.hasMany(AppointmentServiceModel,{foreignKey : {name : 'branchId'}})
AppointmentServiceModel.belongsTo(BranchModel, {foreignKey : {name : 'branchId'}})

// Service Id In AppointmentServiceModel
ServiceModel.hasMany(AppointmentServiceModel,{foreignKey : {name : 'serviceId'}})
AppointmentServiceModel.belongsTo(ServiceModel, {foreignKey : {name : 'serviceId'}})


export default sequelize;
