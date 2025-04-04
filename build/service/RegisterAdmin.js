"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("../database/connection"));
const sequelize_1 = require("sequelize");
const uuid_1 = require("uuid");
const bcrypt = require('bcrypt');
const RegisterAdmin = () => {
    const AdminRegister = (AdminList) => __awaiter(void 0, void 0, void 0, function* () {
        const currentTimestamp = new Date();
        const hashPassword = bcrypt.hashSync(AdminList[0].password, 12);
        const [isAdminAlreadyEnolled] = yield connection_1.default.query(`SELECT * FROM users WHERE role = ?`, {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: ['admin']
        });
        if (!isAdminAlreadyEnolled) {
            yield connection_1.default.query(`INSERT INTO users (id, name, email, password, phoneNumber, profilePicture, DOB, gender, address, role, otp, status, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, {
                type: sequelize_1.QueryTypes.INSERT,
                replacements: [AdminList[0].id, AdminList[0].name, AdminList[0].email, hashPassword, AdminList[0].phoneNumber, AdminList[0].profilePictureUrl, AdminList[0].dateOfBirth, AdminList[0].gender, AdminList[0].address, AdminList[0].role, '', AdminList[0].status, currentTimestamp, currentTimestamp]
            });
            console.log('Admin Registered Successfully');
        }
        else {
            console.log('Admin Already Exists');
        }
    });
    const AdminDetails = [
        { 'id': (0, uuid_1.v4)(),
            'name': 'amita',
            'profilePictureUrl': 'https://i.sstatic.net/l60Hf.png',
            'password': 'amita',
            'email': 'admin@gmail.com',
            'dateOfBirth': '2020-09-23',
            'phoneNumber': '9800000000',
            'address': 'Pokhara',
            'gender': 'female',
            'status': '1',
            'role': 'admin',
        }
    ];
    AdminRegister(AdminDetails);
};
exports.default = RegisterAdmin;
