"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const path_1 = __importDefault(require("path"));
const AppointmentService_1 = __importDefault(require("./models/AppointmentService"));
const branch_1 = __importDefault(require("./models/branch"));
const services_1 = __importDefault(require("./models/services"));
// import CategoryModel from './models/category';
// import ProductModel from './models/product';
// import OrderModels from './models/order';
// import OrderItemModel from './models/orderItems';
// import SupplierModel from './models/suppliers';
const sequelize = new sequelize_typescript_1.Sequelize({
    database: process.env.DB_NAME,
    dialect: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    models: [path_1.default.join(__dirname, '/models')],
    pool: {
        max: 50,
        min: 5,
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
branch_1.default.hasMany(AppointmentService_1.default, { foreignKey: { name: 'branchId' } });
AppointmentService_1.default.belongsTo(branch_1.default, { foreignKey: { name: 'branchId' } });
// Service Id In AppointmentServiceModel
services_1.default.hasMany(AppointmentService_1.default, { foreignKey: { name: 'serviceId' } });
AppointmentService_1.default.belongsTo(services_1.default, { foreignKey: { name: 'serviceId' } });
// CategoryModel.hasMany(ProductModel, {foreignKey : {name : 'categoryId', allowNull : false}})
// UserModel.hasMany(OrderModels, {foreignKey : {name : 'staffId', allowNull : false }})
// OrderModels.hasMany(OrderItemModel, {foreignKey : {name : 'orderId', allowNull : false}})
// ProductModel.hasMany(OrderItemModel, {foreignKey : {name : 'productId', allowNull : false}})
// SupplierModel.hasMany(ProductModel, {foreignKey: {name : 'supplierId', allowNull: false}})
exports.default = sequelize;
