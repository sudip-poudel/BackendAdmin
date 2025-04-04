import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query"
import sequelize from "../database/connection"
import { DataTypes, json, QueryTypes } from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import { time, timeStamp } from "console";
const bcrypt = require('bcrypt');


export interface UserInterface  {
    id : string,
    name : string,
    email : string
    password : string
    phoneNumber: string,
    profilePictureUrl : string,
    dateOfBirth : string,
    gender : string,
    address : string,
    role : string,
    status : string,
}

const RegisterAdmin = ()=>{
    const AdminRegister = async (AdminList:UserInterface[])=>{
        const currentTimestamp = new Date();
        const hashPassword = bcrypt.hashSync(AdminList[0].password, 12);

        const [isAdminAlreadyEnolled] = await sequelize.query(`SELECT * FROM users WHERE role = ?`,{
            type : QueryTypes.SELECT,
            replacements : ['admin']
        })

        if(!isAdminAlreadyEnolled){
            await sequelize.query(`INSERT INTO users (id, name, email, password, phoneNumber, profilePicture, DOB, gender, address, role, otp, status, createdAt, updatedAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,{
                type : QueryTypes.INSERT,
                replacements : [AdminList[0].id, AdminList[0].name, AdminList[0].email, hashPassword, AdminList[0].phoneNumber, AdminList[0].profilePictureUrl, AdminList[0].dateOfBirth, AdminList[0].gender, AdminList[0].address, AdminList[0].role, '', AdminList[0].status, currentTimestamp, currentTimestamp]
            })
            console.log('Admin Registered Successfully')
        }else{
            console.log('Admin Already Exists')
        }
    }

    const AdminDetails:UserInterface[] = [
        {'id':uuidv4(), 
        'name':'amita', 
        'profilePictureUrl' : 'https://i.sstatic.net/l60Hf.png',
        'password' : 'amita',
        'email':'admin@gmail.com',
        'dateOfBirth' : '2020-09-23',
        'phoneNumber': '9800000000',
        'address' : 'Pokhara',
        'gender' : 'female',
        'status' : '1',
        'role' : 'admin',
        }
    ]
    AdminRegister(AdminDetails)
}

export default RegisterAdmin