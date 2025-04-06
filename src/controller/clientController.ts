import {Request, Response} from 'express'
import UserModel from '../database/models/user';

class ClientController {

    async RegisterClient(req: Request, res: Response) {
        const {name, email, password, cPassword, phone, DOB, address, gender  } = req.body;
        const client = new UserModel({ name, email, password });
        await client.save();
        res.json(client);
        
    }
}


export default new ClientController;