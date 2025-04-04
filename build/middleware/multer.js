"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
// Multer disk storage configuration
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        console.log(' 😂 😂 😂 😂 😂 😂 😂 😂 😂 multer vitra aayo !!');
        // Check if file type is allowed
        const allowedFileTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        if (!allowedFileTypes.includes(file.mimetype)) {
            cb(new Error("This file type is not accepted"), '');
        }
        else {
            const uploadPath = './src/uploads'; // You can set the path where you want to store files
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath); // Creates the directory if it doesn't exist
            }
            cb(null, uploadPath); // Pass the path where the file will be stored
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    }
});
// Multer upload instance
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
