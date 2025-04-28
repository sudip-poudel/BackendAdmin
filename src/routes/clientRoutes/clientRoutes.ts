import clientController from "../../controller/clientController";

import express from "express";
const router = express.Router();

// Register
router.post("/register", clientController.RegisterClient);

// Appointment
router.post("/booking", clientController.BookService);

// Payment
//router.post("/payment", clientController.PaymentService);

// Branches
router.get("/branches", clientController.BranchesService);
router.get("/staffList/:branch", clientController.StaffList);

// Services
router.get("/services", clientController.ServicesService);

router.post("/initiate-payment", clientController.InitiatePayment);

router.post("/verify-payment", clientController.VerifyPayment);
export default router;
