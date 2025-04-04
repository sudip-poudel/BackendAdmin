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
exports.Role = void 0;
var jwt = require('jsonwebtoken');
const util_1 = require("util");
const connection_1 = __importDefault(require("../database/connection"));
const sequelize_1 = require("sequelize");
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["STAFF"] = "staff";
})(Role || (exports.Role = Role = {}));
class authMiddleware {
    isAuthenticatedUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.headers.authorization;
            if (!token || token == undefined || token == null) {
                res.status(400).json({
                    message: 'Please Provide a token'
                });
                return;
            }
            try {
                const decoded = yield (0, util_1.promisify)(jwt.verify)(token, process.env.ADMIN_JWT_TOKEN);
                const [isUserExists] = yield connection_1.default.query(`SELECT * FROM users WHERE id = ?`, {
                    type: sequelize_1.QueryTypes.SELECT,
                    replacements: [decoded.userId]
                });
                if (!isUserExists) {
                    res.status(400).json({
                        message: "Invalid Credentials",
                    });
                    return;
                }
                req.userId = isUserExists.id;
                req.userEmail = isUserExists.email;
                next();
            }
            catch (error) {
                res.status(400).json({
                    message: `Your session has expired. Please login again.`
                });
            }
        });
    }
}
exports.default = new authMiddleware;
