import { Request } from "express";
import { IncomingHttpHeaders } from "http";

export default interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

export interface UserRequestInterface extends Request {
  headers: IncomingHttpHeaders;
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePictureUrl: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  role: string;
  status: string;
}

export interface AuthRequest extends Request {
  email: string;
  role: string;
  id: string;
}
