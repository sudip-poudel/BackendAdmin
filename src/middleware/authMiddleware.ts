import { NextFunction, Response } from "express";
var jwt = require('jsonwebtoken');
import { promisify } from 'util'
import sequelize from "../database/connection";
import { QueryTypes } from "sequelize";


export interface UserRequestInterface  extends Request {
    headers: any;
    userId : string;
    userEmail : string
    role : string
}

export interface AuthRequest extends Request{
    email : string, 
    role : string, 
    id : string
}



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


export enum Role {
    ADMIN = "admin",
    STAFF = 'staff'
}

class authMiddleware {
    async isAuthenticatedUser(req:UserRequestInterface, res:Response, next:NextFunction) :Promise<void>{
        const token = req.headers.authorization;

        if(!token || token == undefined || token == null){
            res.status(400).json({
                message : 'Please Provide a token'
            })
            return
        }
        

        try {
            const decoded = await promisify(jwt.verify)(token, process.env.ADMIN_JWT_TOKEN)
            const [isUserExists]:UserInterface[] = await sequelize.query(`SELECT * FROM users WHERE id = ?`,{
                type : QueryTypes.SELECT,
                replacements : [decoded.userId]
            })

            if (!isUserExists) {
                res.status(400).json({
                    message: "Invalid Credentials",
                });
                return;
            }

            req.userId = isUserExists.id
            req.userEmail = isUserExists.email
            next()
            
        } catch (error) {
            res.status(400).json({
                message : `Your session has expired. Please login again.`
            })
        }
    }
}

export default new authMiddleware