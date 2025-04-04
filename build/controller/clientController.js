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
const user_1 = __importDefault(require("../database/models/user"));
class ClientController {
    RegisterClient(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, cPassword, phone, DOB, address, gender } = req.body;
            // setName('')  // Reset name field
            // setEmail('') // Reset email field
            // setPassword('') // Fix: Typo, should be setPassword('')
            // setPhone('') // Reset phone field
            // setDOB('') // Reset date of birth field
            // setGender('') // Reset gender selection
            // setAddress('') // Reset address field
            // setPhoto(null) // Reset profile picture
            const client = new user_1.default({ name, email, password });
            yield client.save();
            res.json(client);
        });
    }
}
exports.default = new ClientController;
