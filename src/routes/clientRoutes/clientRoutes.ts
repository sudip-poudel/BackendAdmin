import clientController from "../../controller/clientController"
import authMiddleware from "../../middleware/authMiddleware"
import { upload } from "../../middleware/multer"

const router = require('express').Router()

// Register
router.post('/register', clientController.RegisterClient)

// Appointment
router.post('/booking', clientController.BookService)

// Payment
router.post('/payment', clientController.PaymentService)

// Branches
router.get('/branches', clientController.BranchesService)
router.get('/staffList/:branch', clientController.StaffList )


export default router