import {Request, Response} from 'express'
import UserModel from '../database/models/user';
import BookingModel from "../database/models/Booking";
import {Op} from "sequelize";
import BranchModel from "../database/models/branch";

class ClientController {

    async RegisterClient(req: Request, res: Response) {
        const {name, email, password, cPassword, phone, DOB, address, gender  } = req.body;
        const client = new UserModel({ name, email, password });
        await client.save();
        res.json(client);
        
    }

    // Book Service
    async BookService(req: Request, res: Response) {
        try {
            const {location, services, staff, date, time, name, email, phone} = req.body;

            // Check if all required fields are provided
            if (!location || !services || !staff || !date || !time || !name || !email || !phone) {
                return res.status(400).json({message: "Please provide all required fields"});
            }

            // Check if the date is a valid date format
            if (isNaN(Date.parse(date))) {
                return res.status(400).json({message: "Invalid date format"});
            }

            // Check if the phone number already exists (assuming phone is unique)
            const existingBooking = await BookingModel.findOne({
                where: {
                    [Op.and]: [{phone}, {date}, {time}] // You can add more constraints here
                }
            });

            if (existingBooking) {
                return res.status(400).json({message: "Booking already exists for this time slot"});
            }

            const booking = new BookingModel({
                name,
                email,
                phone,
                services,
                staff,
                date,
                time,
                location
            });

            await booking.save();
            res.status(201).json(booking);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error saving booking" });
        }
    }

    // Branch Service
    async BranchesService(req: Request, res: Response) {
        try{
            const branchesList = await BranchModel.findAll();
            return res.status(200).json(branchesList);
        } catch (e) {
            res.status(500).json({message: "Error saving branches"});
        }
    }
}

export default new ClientController;