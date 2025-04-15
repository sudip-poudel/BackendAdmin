import clientController from "../../controller/clientController"
import authMiddleware from "../../middleware/authMiddleware"
import { upload } from "../../middleware/multer"

const router = require('express').Router()

// Register
router.post('/register', clientController.RegisterClient)

// Appointment
router.post('/booking', clientController.BookService)

router.get('/staffList/:branch', clientController.StaffList )


export default router