import { Request, Response } from "express";
import UserModel from "../database/models/user";
import BookingModel from "../database/models/Booking";
import { Op } from "sequelize";
import BranchModel from "../database/models/branch";
import { initializeKhaltiPayment } from "../service/khalti";
import ServiceModel from "../database/models/services";
import PaymentModel from "../database/models/Payment";

export enum UserRole {
  CUSTOMER = "Customer",
  ADMIN = "Admin",
  STAFF = "Staff",
}

class ClientController {
  async RegisterClient(req: Request, res: Response) {
    try {
      const { name, email, password, phoneNumber, DOB, address, gender } =
        req.body;
      const client = new UserModel({
        name,
        email,
        password,
        phoneNumber,
        DOB,
        address,
        gender,
        role: UserRole.CUSTOMER,
        status: 1,
      });
      await client.save();
      res.json(client);
    } catch (error: any) {
      console.error("Error while registering user:", error);
      res.status(500).json({ error: error.message, full: error });
    }
  }

  // Book Service
  async BookService(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { branchId, serviceIds, staffId, date, time, name, email, phone } =
        req.body;

      // Check if all required fields are provided
      if (
        !serviceIds ||
        !staffId ||
        !date ||
        !time ||
        !name ||
        !email ||
        !phone ||
        !branchId
      ) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      // Check if the date is a valid date format
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      // Check if the phone number already exists (assuming phone is unique)
      const existingBooking = await BookingModel.findOne({
        where: {
          [Op.and]: [{ phone }, { date }, { time }], // You can add more constraints here
        },
      });

      if (existingBooking) {
        return res
          .status(400)
          .json({ message: "Booking already exists for this time slot" });
      }

      //TODO check this if work or not
      const booking = await BookingModel.create({
        name: name,
        date: date,
        time: time,
        email,
        phone,
        staffId,
        branchId,
      });

      // 2. Associate services to booking
      if (serviceIds && serviceIds.length > 0) {
        await booking.$set("services", serviceIds);
      }

      res.status(201).json(booking);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error saving booking" });
    }
  }

  // Branch Service
  async BranchesService(req: Request, res: Response) {
    try {
      const branchesList = await BranchModel.findAll();
      return res.status(200).json({ message: branchesList });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error fetchng branches" });
    }
  }

  async StaffList(req: Request, res: Response) {
    try {
      const branch = req.params.branch;
      console.log("Getting staff list for branch:", branch);

      const staffUserList = await UserModel.findAll({
        where: {
          branchId: branch,
          role: UserRole.STAFF,
        },
      });

      return res.status(200).json({
        message: staffUserList,
      });
    } catch (error) {
      console.error("Error fetching staff list:", error);
      res.status(500).json({ error: "Failed to fetch staff list" });
    }
  }

  // Payment Service
  async PaymentService(req: Request, res: Response) {
    console.log("PaymentService endpoint hit");
    try {
      const { totalPrice, website_url } = req.body;

      // Validate input
      if (!totalPrice || !website_url) {
        return res.status(400).json({
          message: "Missing required fields: totalPrice or website_url",
        });
      }

      // Initialize Khalti payment
      const paymentInitiate = await initializeKhaltiPayment({
        amount: totalPrice * 100, // amount in paisa
        return_url: `${process.env.HOST_PATH}/complete-khalti-payment`,
        website_url,
      });

      // Respond with success
      return res.json({
        success: true,
        message: "Payment initialized successfully",
        payment: paymentInitiate,
      });
    } catch (error: any) {
      console.error("Error while processing payment:", {
        message: error.message,
        stack: error.stack,
      });
      return res.status(500).json({ error: "Failed to process payment" });
    }
  }

  async InitiatePayment(req: Request, res: Response) {
    const { amount, purchase_order_id, purchase_order_name, return_url } =
      req.body;

    try {
      console.log(req.body.data);

      const { branchId, serviceIds, staffId, date, time, name, email, phone } =
        req.body.data;
      // Check if all required fields are provided
      // console the all if condition below
      console.log(branchId, !branchId);
      console.log(!serviceIds);
      console.log(!staffId);
      console.log(!date);
      console.log(!time);
      console.log(!name);
      console.log(!email);
      console.log(!phone);

      console.log();
      if (
        !serviceIds ||
        !staffId ||
        !date ||
        !time ||
        !name ||
        !email ||
        !phone ||
        !branchId
      ) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      // Check if the date is a valid date format
      if (isNaN(Date.parse(date))) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      // Check if the phone number already exists (assuming phone is unique)
      const existingBooking = await BookingModel.findOne({
        where: {
          [Op.and]: [{ phone }, { date }, { time }], // You can add more constraints here
        },
      });

      if (existingBooking) {
        return res
          .status(400)
          .json({ message: "Booking already exists for this time slot" });
      }

      //TODO check this if work or not

      const ru = decodeURIComponent(return_url);
      console.log(ru);
      const response = await fetch(
        `${process.env.KHALTI_GATEWAY_URL}/epayment/initiate/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
          body: JSON.stringify({
            return_url: ru,
            website_url: "http://localhost:5174",
            amount,
            purchase_order_id,
            purchase_order_name,
          }),
        },
      );
      if (!response.ok) {
        console.log(await response.text());
        return;
      }
      const responseData = await response.json();

      return res.json(responseData);
    } catch (error) {
      console.error("Error while initiating payment:", error);
      res.status(500).json({ error: "Payment initiation failed" });
    }
  }

  async VerifyPayment(req: Request, res: Response) {
    const { pidx } = req.body;
    const { serviceIds, staffId, date, name, email, phone, time, branchId } =
      req.body.data;

    try {
      //check if rhis pidx is already in daabase
      const payment = await PaymentModel.findOne({ where: { pidx } });
      console.log(payment);
      if (payment) {
        return res
          .status(400)
          .json({ message: "Payment already verified", status: "Duplicate" });
      }

      const response = await fetch(
        "https://dev.khalti.com/api/v2/epayment/lookup/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          },
          body: JSON.stringify({ pidx }),
        },
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const data = await response.json();
      console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      if (data.status === "Completed") {
        const booking = await BookingModel.create({
          name,
          date,
          time,
          email,
          phone,
          staffId,
          branchId,
        });

        if (serviceIds && serviceIds.length > 0) {
          await booking.$set("services", serviceIds);
        }

        const pmt = await PaymentModel.create({
          amount: data.total_amount / 100,
          bookingId: booking.id,
          pidx: data.pidx,
          transactionId: data.transaction_id,
          paymentGateway: "khalti",
          status: data.status == "success" ? "success" : "failed",
          customerName: name,
        });
        console.log(booking, pmt, "kshdkjfhsdkjfhkdjsfkjdshfkjh");
        return res.json(data);
      }
      return res.status(400).json({ message: "Payment unsuccessfull" });
    } catch (error) {
      console.error("Error while verifying payment:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  }

  async ServicesService(req: Request, res: Response) {
    try {
      const servicesList = await ServiceModel.findAll();
      return res.status(200).json({ message: servicesList });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Error fetchng services" });
    }
  }
}

export default new ClientController();
