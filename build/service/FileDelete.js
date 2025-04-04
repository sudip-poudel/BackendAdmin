"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DeleteFile = (fileLInk) => {
    console.log('Delete File');
    const fileName = fileLInk.split('/').pop();
    const relativePath = `./uploads`;
    const filePath = path_1.default.join(__dirname, '../../', relativePath, fileName);
    console.log('file path :', filePath);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error("Error :", err);
        }
        else {
            console.log("Successfully Deleted!");
        }
    });
};
exports.DeleteFile = DeleteFile;
