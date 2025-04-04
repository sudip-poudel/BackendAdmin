"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clientController_1 = __importDefault(require("../../controller/clientController"));
const router = require('express').Router();
// Register
router.post('/register', clientController_1.default.RegisterClient);
exports.default = router;
